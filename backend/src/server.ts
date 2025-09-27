import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cors from 'cors';
import Sentiment from 'sentiment';



interface Book {
    title: string;
    author: string;
    rating: string;
    dateRead: string;
    dateAdded?: string;         // NEW: Date when book was added to shelves
    dateStarted?: string;       // NEW: Date when book was started
    readingDays?: number;       // NEW: Days between start and finish
    userRating?: number;        // 1-5 stars
    avgRating?: number;         // Goodreads average
    numRatings?: number;        // Total ratings count
    numPages?: number;          // Total pages read
    coverImage?: string;         // Cover image URL
    genres?: string[];             // Genres
    review?: string;
    sentiment?: {
      score: number;
      comparative: number;
      positive: string[];
      negative: string[];
      fullReview: string;
    };
  }

const scrapeBookGenres = async (bookUrl: string): Promise<string[]> => {
  try {
    console.log(`Scraping genres from: ${bookUrl}`);
    
    const fullBookUrl = bookUrl.startsWith('http') ? bookUrl : `https://www.goodreads.com${bookUrl}`;
    
    const response = await axios.get(fullBookUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GoodreadsWrapped/1.0)'
      }
    });
    
    const $ = cheerio.load(response.data);
    const genres: string[] = [];
    
    // List of non-genre categories to filter out
    const nonGenres = [
      'fiction', 'non-fiction', 'nonfiction', 'adult', 'young-adult', 'ya', 'children', 'kids',
      'audiobook', 'book-club', 'book club', 'library', 'owned', 'to-read', 'currently-reading',
      'read', 'favorites', 'favourites', 'recommended', 'modern', 'queer', 'lgbt', 'lgbtq',
      'new', 'old', 'popular', 'bestseller', 'award-winning', 'series', 'standalone', 
      'novel', 'book', 'story', 'tale', 'narrative', 'literature', 'writing', 'author', 
      'publisher', 'edition', 'format', 'hardcover', 'paperback', 'ebook', 'kindle', 
      'digital', 'print', 'audio', 'review', 'rating', 'star', 'page', 'chapter', 
      'volume', 'part', 'collection', 'anthology', 'trilogy', 'series', 'chronicles', 
      'saga', 'cycle', 'prequel', 'sequel', 'companion', 'tie-in', 'crossover'
    ];
    
    $('a[href*="/genres/"], .elementList a[href*="/genres/"], .leftContainer a[href*="/genres/"]').each((index, element) => {
      const genreText = $(element).text().trim().toLowerCase();
      if (genreText && !genres.includes(genreText) && !nonGenres.includes(genreText)) {
        genres.push(genreText);
      }
    });
    
    if (genres.length === 0) {
      $('.bookPageGenreLink').each((index, element) => {
        const genreText = $(element).text().trim().toLowerCase();
        if (genreText && !genres.includes(genreText) && !nonGenres.includes(genreText)) {
          genres.push(genreText);
        }
      });
    }
    
    if (genres.length === 0) {
      $('a[href*="genres"]').each((index, element) => {
        const genreText = $(element).text().trim().toLowerCase();
        if (genreText && !genres.includes(genreText) && !nonGenres.includes(genreText) && genreText.length < 50) {
          genres.push(genreText);
        }
      });
    }
    
    console.log(`Found genres for ${fullBookUrl}: ${genres.join(', ')}`);
    return genres;
    
  } catch (error) {
    console.error(`Error scraping genres from ${bookUrl}:`, error);
    return [];
  }
};


// Initialize sentiment analyzer
const sentiment = new Sentiment();

// Add this function after your existing helper functions
const analyzeReviewSentiment = (reviewText: string): { score: number; comparative: number; positive: string[]; negative: string[] } => {
  if (!reviewText || reviewText.trim().length < 10) {
    return { score: 0, comparative: 0, positive: [], negative: [] };
  }
  
  const result = sentiment.analyze(reviewText);
  return result;
};

// Add this function to analyze sentiment for existing reviews
const analyzeReviewsWithSentiment = async (books: Book[]): Promise<Book[]> => {
  console.log(`Analyzing sentiment for ${books.length} books...`);
  
  const booksWithSentiment = books.map((book, index) => {
    if (book.review && book.review.length > 10) {
      try {
        // Analyze sentiment of the existing review
        const sentimentResult = analyzeReviewSentiment(book.review);
        
        // Add sentiment data to the book
        (book as any).sentiment = {
          score: sentimentResult.score,
          comparative: sentimentResult.comparative,
          positive: sentimentResult.positive,
          negative: sentimentResult.negative,
          fullReview: book.review
        };
        
        console.log(`Progress: ${index + 1}/${books.length} - ${book.title}: Score ${sentimentResult.score}, Comparative ${sentimentResult.comparative.toFixed(3)}`);
      } catch (error) {
        console.error(`Error analyzing sentiment for ${book.title}:`, error);
        (book as any).sentiment = {
          score: 0,
          comparative: 0,
          positive: [],
          negative: [],
          fullReview: book.review || ''
        };
      }
    } else {
      // No review available
      (book as any).sentiment = {
        score: 0,
        comparative: 0,
        positive: [],
        negative: [],
        fullReview: book.review || ''
      };
    }
    
    return book;
  });
  
  return booksWithSentiment;
};


const scrapeToReadList = async (username: string, year: string): Promise<Set<string>> => {
  const toReadIds = new Set<string>();
  let page = 1;
  let hasMorePages = true;
  let foundOlderBook = false;

  while (hasMorePages && !foundOlderBook) {
    const toReadUrl = `https://www.goodreads.com/review/list/${username}?page=${page}&shelf=to-read&sort=date_added`;
    console.log(`Scraping to-read page ${page}: ${toReadUrl}`);
    
    try {
      const response = await axios.get(toReadUrl);
      const $ = cheerio.load(response.data);
      const bookElements = $('tr[itemtype="http://schema.org/Book"], tr:has(a[href*="/book/show/"])');
      
      let booksOnThisPage = 0;
      
      bookElements.each((index, element) => {
        const $book = $(element);
        
        const titleElement = $book.find('td.field.title a[href*="/book/show/"]');
        const bookUrl = titleElement.attr('href');
        const dateAdded = $book.find('.field.date_added').text().trim();
        
        if (bookUrl && dateAdded) {
          booksOnThisPage++;
          
          // Check if this book was added in the target year
          if (dateAdded.includes(year)) {
            // Extract book ID from URL (e.g., "/book/show/12345-title" -> "12345")
            const bookIdMatch = bookUrl.match(/\/book\/show\/(\d+)/);
            if (bookIdMatch) {
              toReadIds.add(bookIdMatch[1]);
              console.log(`✅ To-read book added in ${year}: ${titleElement.text().trim()}`);
            }
          } else if (dateAdded && dateAdded !== 'Date not specified') {
            // Since books are sorted by date_added, we can stop when we hit a different year
            console.log(`🛑 Found book from different year: ${titleElement.text().trim()} (${dateAdded}) - stopping pagination`);
            foundOlderBook = true;
            return false; // Break out of the .each() loop
          }
        }
      });
      
      console.log(`To-read page ${page}: Found ${booksOnThisPage} books, ${toReadIds.size} added in ${year} so far`);
      
      if (booksOnThisPage < 20) {
        hasMorePages = false;
        console.log(`Reached last to-read page (found ${booksOnThisPage} books)`);
      } else if (!foundOlderBook) {
        page++;
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between pages
      }
    } catch (error) {
      console.error(`Error scraping to-read page ${page}:`, error);
      hasMorePages = false;
    }
  }
  
  console.log(`To-read scraping complete! Found ${toReadIds.size} books added in ${year}`);
  return toReadIds;
};

console.log('Starting server...');

const app = express();
const PORT = 3001;
app.use(cors());

console.log('Express app created');

app.use(express.json());

console.log('Middleware added');

// Basic test endpoint
// Add this before your /test endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Goodreads Wrapped Backend is running!' });
  });

app.get('/test', (req, res) => {
   console.log('Test endpoint hit');
   res.json({ message: 'Hello from your backend!' });
});

// Add this after your /test endpoint
app.get('/scrape/:username', async (req, res) => {
    try {
      const username = req.params.username;
      console.log(`Attempting to scrape profile for: ${username}`);
      
      // Construct the Goodreads URL
      const goodreadsUrl = `https://www.goodreads.com/user/show/${username}`;
      console.log(`Scraping URL: ${goodreadsUrl}`);
      
      // Make the HTTP request to Goodreads
      const response = await axios.get(goodreadsUrl);
      console.log(`Response status: ${response.status}`);

      // Load the HTML into cheerio for parsing
      const $ = cheerio.load(response.data);

      // Extract the user's name
      const userName = $('h1.userProfileName').text().trim();
      console.log(`Found user name: ${userName}`);

      // Extract the profile picture URL
      const profilePic = $('img.profilePictureIcon').attr('src');
      console.log(`Found profile picture: ${profilePic}`);

      // Return the extracted data
      res.json({ 
        message: `Successfully scraped ${username}'s profile!`,
        userData: {
            name: userName || 'Name not found',
            profilePicture: profilePic || 'No profile picture found'
          },
        status: response.status,
        url: goodreadsUrl
      });
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

app.get('/scrape/:username/books/:year', async (req, res) => {
    try {
      const username = req.params.username;
      const year = req.params.year;
      console.log(`Attempting to scrape ${year} books for: ${username}`);
      
      const allBooks: Book[] = [];
      const yearBooks: Book[] = [];
      let page = 1;
      let hasMorePages = true;
      let foundOlderBook = false;
      
      while (hasMorePages && !foundOlderBook) {
        // Use Goodreads' built-in date sorting
        const goodreadsUrl = `https://www.goodreads.com/review/list/${username}?page=${page}&shelf=read&sort=date_read`;
        console.log(`Scraping page ${page}: ${goodreadsUrl}`);
        
        const response = await axios.get(goodreadsUrl);
        console.log(`Page ${page} response status: ${response.status}`);
        
        const $ = cheerio.load(response.data);
        const bookElements = $('tr[itemtype="http://schema.org/Book"], tr:has(a[href*="/book/show/"])');
        console.log(`Page ${page}: Found ${bookElements.length} book elements`);
        
        let booksOnThisPage = 0;
        
        bookElements.each((index, element) => {
          const $book = $(element);
          
          
          const titleElement = $book.find('td.field.title a[href*="/book/show/"]');
          const title = titleElement.text().trim();
          const bookUrl = titleElement.attr('href'); // NEW: Extract the book URL

          
          if (title) {
            booksOnThisPage++;
            
            const authorElement = $book.find('a[href*="/author/show/"]');
            const author = authorElement.text().trim();
            
            
            const ratingText = $book.find('.rating, .stars, [class*="rating"]').text().trim();

            // Parse the rating data
            let userRating: number | undefined;
            let avgRating: number | undefined;
            let numRatings: number | undefined;
            
            if (ratingText) {
              // Extract user's rating (look for "liked it", "really liked it", etc.)
              if (ratingText.includes('it was amazing')) userRating = 5;
              else if (ratingText.includes('really liked it')) userRating = 4;
              else if (ratingText.includes('liked it')) userRating = 3;
              else if (ratingText.includes('it was ok')) userRating = 2;
              else if (ratingText.includes('did not like it')) userRating = 1;
              
              // Extract average rating (look for "avg rating X.XX")
              const avgMatch = ratingText.match(/avg rating\s+(\d+\.\d+)/);
              if (avgMatch) {
                avgRating = parseFloat(avgMatch[1]);
              }

              
              
              // Extract number of ratings (look for "num ratings X,XXX")
              const numMatch = ratingText.match(/num ratings\s+([\d,]+)/);
              if (numMatch) {
                numRatings = parseInt(numMatch[1].replace(/,/g, ''));
              }
            }            
            
            // NEW: Extract number of pages
            const numPagesText = $book.find('.field.num_pages').text().trim();
            let numPages: number | undefined;
            if (numPagesText) {
              const pagesMatch = numPagesText.match(/(\d+)/);
              if (pagesMatch) {
                numPages = parseInt(pagesMatch[1]);
              }
            }
            
            // NEW: Extract book cover image
            const coverElement = $book.find('.field.cover img');
            const coverImage = coverElement.attr('src') || coverElement.attr('data-src');
            const reviewText = $book.find('.field.review').text().trim();
            // Filter out placeholder text
            const actualReview = reviewText && reviewText !== 'Write a review' ? reviewText : undefined;

            const dateRead = $book.find('.date, .date_pub, [class*="date"]').text().trim();
            
            // NEW: Extract date added to shelves
            const dateAdded = $book.find('.field.date_added').text().trim();
            
            // NEW: Extract start and finish dates
            const dateStarted = $book.find('.field.date_started').text().trim();
            const dateFinished = $book.find('.field.date_read').text().trim();
            
            // Calculate reading days if both dates are available
            let readingDays: number | undefined;
            if (dateStarted && dateFinished) {
              try {
                const startDate = new Date(dateStarted);
                const finishDate = new Date(dateFinished);
                if (!isNaN(startDate.getTime()) && !isNaN(finishDate.getTime())) {
                  const timeDiff = finishDate.getTime() - startDate.getTime();
                  readingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                }
              } catch (error) {
                console.log(`Could not parse dates for ${title}: ${dateStarted} - ${dateFinished}`);
              }
            }

            
            const book: Book = {
              title: title,
              author: author || 'Unknown Author',
              rating: ratingText || 'No rating',
              dateRead: dateRead || 'Date not specified',
              dateAdded: dateAdded || undefined,
              dateStarted: dateStarted || undefined,
              readingDays: readingDays,
              userRating: userRating,
              avgRating: avgRating,
              numRatings: numRatings,
              numPages: numPages,        // NEW
              coverImage: coverImage,     // NEW
              genres: [],
              review: actualReview,
            };

            (book as any).bookUrl = bookUrl;

            // Extract book ID for dependability calculation
            if (bookUrl) {
              const bookIdMatch = bookUrl.match(/\/book\/show\/(\d+)/);
              if (bookIdMatch) {
                (book as any).bookId = bookIdMatch[1];
              }
            }

            allBooks.push(book);
            
            // Check if this book was read in the target year
            if (dateRead && dateRead.includes(year)) {
              yearBooks.push(book);
              console.log(`✅ ${year} book: ${title}`);
            } else if (dateRead && dateRead !== 'Date not specified') {
              // Since books are now sorted by date_read, we can stop when we hit a different year
              console.log(`🛑 Found book from different year: ${title} (${dateRead}) - stopping pagination`);
              foundOlderBook = true;
              return false; // Break out of the .each() loop
            }
          }
        });

        
        console.log(`Page ${page}: Found ${booksOnThisPage} books, ${yearBooks.length} from ${year} so far`);
        
        if (booksOnThisPage < 20) {
          hasMorePages = false;
          console.log(`Reached last page (found ${booksOnThisPage} books)`);
        } else if (!foundOlderBook) {
          page++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      console.log(`Scraping complete! Total books found: ${allBooks.length}, Books in ${year}: ${yearBooks.length}`);

      // ADD THIS CODE RIGHT HERE:
      console.log(`Scraping genres for ${yearBooks.length} books from ${year}...`);

      // Scrape genres for each book read in the target year (parallel processing)
      const genrePromises = yearBooks.map(async (book, index) => {
        const bookUrl = (book as any).bookUrl;
        
        if (bookUrl) {
          // Add staggered delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, index * 100));
          const genres = await scrapeBookGenres(bookUrl);
          book.genres = genres;
          console.log(`Progress: ${index + 1}/${yearBooks.length} books processed`);
        }
        
        return book;
      });

      // Wait for all genre scraping to complete
      await Promise.all(genrePromises);

      // Clean up the bookUrl property we added temporarily
      yearBooks.forEach(book => {
        delete (book as any).bookUrl;
      });

      // Calculate genre statistics
      const allGenres = yearBooks.flatMap(book => book.genres || []);
      const genreCounts: { [key: string]: number } = {};

      allGenres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });

      // Find most popular genre
      const mostPopularGenre = Object.keys(genreCounts).length > 0 
        ? Object.keys(genreCounts).reduce((a, b) => 
            genreCounts[a] > genreCounts[b] ? a : b, '')
        : '';

      // Get unique genres count
      const uniqueGenres = Object.keys(genreCounts).length;

      console.log(`Genre stats: ${uniqueGenres} unique genres, most popular: ${mostPopularGenre}`);


      // Calculate dependability (proportion of books read in year that were added in year)
      console.log(`Scraping to-read list for dependability calculation...`);
      const toReadIds = await scrapeToReadList(username, year);

      // Count books read in year that were also added in year
      const readAndAddedInYear = yearBooks.filter(book => 
        book.dateAdded && book.dateAdded.includes(year)
      ).length;

      // Calculate dependability using new formula
      const toReadAddedCount = toReadIds.size;
      const totalBooksAddedInYear = toReadAddedCount + readAndAddedInYear;
      const dependability = totalBooksAddedInYear > 0 ? readAndAddedInYear / totalBooksAddedInYear : 0;

      console.log(`Dependability: ${readAndAddedInYear}/(${toReadAddedCount} + ${readAndAddedInYear}) = ${(dependability * 100).toFixed(1)}%`);

      // Calculate reading time statistics
      const booksWithReadingTime = yearBooks.filter(book => book.readingDays !== undefined);
      const averageReadingTime = booksWithReadingTime.length > 0 
        ? booksWithReadingTime.reduce((sum, book) => sum + (book.readingDays || 0), 0) / booksWithReadingTime.length
        : 0;

      // Find fastest and slowest reads
      const fastestRead = booksWithReadingTime.length > 0 
        ? booksWithReadingTime.reduce((fastest, book) => (book.readingDays || 0) < (fastest.readingDays || 0) ? book : fastest)
        : null;

      const slowestRead = booksWithReadingTime.length > 0 
        ? booksWithReadingTime.reduce((slowest, book) => (book.readingDays || 0) > (slowest.readingDays || 0) ? book : slowest)
        : null;

      console.log(`Reading time stats: Average ${averageReadingTime.toFixed(2)} days, Fastest: ${fastestRead?.title} (${fastestRead?.readingDays} days), Slowest: ${slowestRead?.title} (${slowestRead?.readingDays} days)`);

      // Calculate biggest hater moment (biggest negative disparity between user rating and average rating)
      const booksWithBothRatings = yearBooks.filter(book => 
        book.userRating !== undefined && book.avgRating !== undefined
      );
      
      let biggestHaterMoment = null as Book | null;
      let biggestDisparity = 0;
      
      booksWithBothRatings.forEach(book => {
        const disparity = (book.avgRating || 0) - (book.userRating || 0);
        if (disparity > biggestDisparity) {
          biggestDisparity = disparity;
          biggestHaterMoment = book;
        }
      });

      console.log(`Biggest hater moment: ${biggestHaterMoment ? biggestHaterMoment.title : 'None'} (User: ${biggestHaterMoment ? biggestHaterMoment.userRating : 0}/5, Average: ${biggestHaterMoment ? biggestHaterMoment.avgRating : 0}/5, Disparity: ${biggestDisparity.toFixed(2)})`);

      const booksWithRatings = yearBooks.filter(book => book.userRating !== undefined);
      const averageRating = booksWithRatings.length > 0 
        ? booksWithRatings.reduce((sum, book) => sum + (book.userRating || 0), 0) / booksWithRatings.length
        : 0;

      const booksWithPages = yearBooks.filter(book => book.numPages !== undefined);
      const averagePages = booksWithPages.length > 0 
        ? booksWithPages.reduce((sum, book) => sum + (book.numPages || 0), 0) / booksWithPages.length
        : 0;

      // Find longest and shortest books
      const longestBook = booksWithPages.length > 0 
        ? booksWithPages.reduce((longest, book) => (book.numPages || 0) > (longest.numPages || 0) ? book : longest)
        : null;

      const shortestBook = booksWithPages.length > 0 
        ? booksWithPages.reduce((shortest, book) => (book.numPages || 0) < (shortest.numPages || 0) ? book : shortest)
        : null;

      console.log(`Page stats: Average ${averagePages.toFixed(0)} pages, Longest: ${longestBook?.title} (${longestBook?.numPages} pages), Shortest: ${shortestBook?.title} (${shortestBook?.numPages} pages)`);
      
      // Analyze sentiment for existing reviews
      console.log(`Analyzing sentiment for ${yearBooks.length} books...`);
      const booksWithSentiment = await analyzeReviewsWithSentiment(yearBooks);

      // Find the most scathing review (most negative sentiment)
      const booksWithReviews = booksWithSentiment.filter(book => 
        book.sentiment && book.sentiment.fullReview && book.sentiment.fullReview.length > 20
      );

      const mostScathingReview = booksWithReviews.length > 0 
        ? booksWithReviews.reduce((mostScathing, book) => 
            book.sentiment!.comparative < mostScathing.sentiment!.comparative ? book : mostScathing
          )
        : null;

      console.log(`Most scathing review: ${mostScathingReview ? mostScathingReview.title : 'None'} (Score: ${mostScathingReview ? mostScathingReview.sentiment!.comparative.toFixed(3) : 0})`);

      res.json({ 
        message: `Successfully scraped ${username}'s ${year} reading list!`,
        username: username,
        year: year,
        totalBooks: allBooks.length,
        yearBooks: yearBooks.length,
        books: yearBooks,
        pagesScraped: page,
        stoppedEarly: foundOlderBook,
        averageRating: Math.round(averageRating * 100) / 100,
        booksWithRatings: booksWithRatings.length,
        averagePages: Math.round(averagePages),
        longestBook: longestBook,
        shortestBook: shortestBook,
        booksWithPages: booksWithPages.length,
        mostPopularGenre: mostPopularGenre,
        uniqueGenres: uniqueGenres,
        genreCounts: genreCounts,
        // NEW: Reading time statistics
        averageReadingTime: Math.round(averageReadingTime * 100) / 100,
        fastestRead: fastestRead,
        slowestRead: slowestRead,
        booksWithReadingTime: booksWithReadingTime.length,
        // NEW: Biggest hater moment
        biggestHaterMoment: biggestHaterMoment,
        biggestDisparity: Math.round(biggestDisparity * 100) / 100,
        booksWithBothRatings: booksWithBothRatings.length,
        url: `https://www.goodreads.com/review/list/${username}?shelf=read&sort=date_read`,
        // NEW: Dependability statistics
        toReadAddedCount: toReadAddedCount,
        toReadReadCount: readAndAddedInYear,
        dependability: Math.round(dependability * 1000) / 1000, // Round to 3 decimal places
        // NEW: Most scathing review
        mostScathingReview: mostScathingReview,
        booksWithReviews: booksWithReviews.length,
      });
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

// Store user data temporarily in memory
const userDataStore: { [key: string]: any } = {};

// Backend: Store user data
app.post('/store-data', (req, res) => {
  const { userId, data } = req.body;
  // Store in memory or database
  userDataStore[userId] = data;
  res.json({ success: true });
});

// Backend: Retrieve user data
app.get('/get-data/:userId', (req, res) => {
  const data = userDataStore[req.params.userId];
  res.json(data || { error: 'Data not found' });
});

// Keep your existing app.listen() code below this
console.log('About to start listening...');

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (error) => {
  console.error('Server error:', error);
});

console.log('Server setup complete');