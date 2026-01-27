import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cors from 'cors';
import Sentiment from 'sentiment';

// Helper function to parse RSS feed for books
const scrapeBookListFromRSS = async (username: string, shelf: string = 'read'): Promise<any[]> => {
  const books: any[] = [];
  let page = 1;
  let hasMoreItems = true;
  
  while (hasMoreItems) {
    const rssUrl = `https://www.goodreads.com/review/list_rss/${username}?shelf=${shelf}&page=${page}`;
    console.log(`Fetching RSS page ${page}: ${rssUrl}`);
    
    try {
      const response = await axios.get(rssUrl, {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data, { xmlMode: true });
      const items = $('item');
      
      if (items.length === 0) {
        hasMoreItems = false;
        console.log(`No items found on page ${page}, stopping.`);
        break;
      }
      
      items.each((index, element) => {
        const $item = $(element);
        
        const title = $item.find('title').text().trim();
        const authorName = $item.find('author_name').text().trim();
        const userRating = parseInt($item.find('user_rating').text().trim()) || undefined;
        const avgRating = parseFloat($item.find('average_rating').text().trim()) || undefined;
        const userReadAt = $item.find('user_read_at').text().trim();
        const userDateAdded = $item.find('user_date_added').text().trim();
        const userDateCreated = $item.find('user_date_created').text().trim();
        const numPages = parseInt($item.find('book num_pages').text().trim()) || undefined;
        const bookLargeImageUrl = $item.find('book_large_image_url').text().trim();
        const userReview = $item.find('user_review').text().trim();
        // Some RSS feeds may expose an author image URL; if not present this will be empty
        const authorImage = $item.find('author_image_url').text().trim();
        const bookId = $item.find('book_id').text().trim();
        const guid = $item.find('guid').text().trim();
        
        // Extract book URL from guid
        const bookUrlMatch = guid.match(/review\/show\/(\d+)/);
        const reviewId = bookUrlMatch ? bookUrlMatch[1] : null;
        
        books.push({
          title,
          author: authorName,
          userRating,
          avgRating,
          userReadAt,
          userDateAdded,
          userDateCreated,
          numPages,
          coverImage: bookLargeImageUrl,
          authorImage: authorImage || undefined,
          review: userReview && userReview !== '' ? userReview : undefined,
          bookId,
          reviewId,
        });
      });
      
      console.log(`Page ${page}: Found ${items.length} items, total so far: ${books.length}`);
      
      // RSS typically has 30 items per page
      if (items.length < 30) {
        hasMoreItems = false;
      } else {
        page++;
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between pages
      }
    } catch (error) {
      console.error(`Error fetching RSS page ${page}:`, error);
      hasMoreItems = false;
    }
  }
  
  return books;
};

// Helper to extract year from RSS date format (e.g., "Wed, 31 Dec 2025 00:00:00 +0000")
const extractYearFromRSSDate = (dateStr: string): number | null => {
  if (!dateStr) return null;
  const match = dateStr.match(/\b(20\d{2})\b/);
  return match ? parseInt(match[1]) : null;
};

interface Book {
  title: string;
  author: string;
  rating: string;
  dateRead: string;
  dateAdded?: string; // Date when book was added to shelves
  dateStarted?: string; // Date when book was started
  readingDays?: number; // Days between start and finish
  userRating?: number; // 1-5 stars
  avgRating?: number; // Goodreads average
  numRatings?: number; // Total ratings count
  numPages?: number; // Total pages read
  coverImage?: string; // Cover image URL
  authorImage?: string; // Author image URL (if we can find it via RSS, may be undefined)
  genres?: string[]; // Genres
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
    const fullBookUrl = bookUrl.startsWith('http') 
      ? bookUrl 
      : `https://www.goodreads.com${bookUrl}`;
    
    const response = await axios.get(fullBookUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Extract the Next.js data
    const nextDataScript = $('#__NEXT_DATA__').html();
    if (!nextDataScript) {
      console.log('No __NEXT_DATA__ found');
      return [];
    }
    
    const nextData = JSON.parse(nextDataScript);
    
    // Navigate to the book data
    const apolloState = nextData.props?.pageProps?.apolloState;
    if (!apolloState) return [];
    
    // Find the book object (it has bookGenres)
    const bookKey = Object.keys(apolloState).find(key => 
      key.startsWith('Book:') && apolloState[key].bookGenres
    );
    
    if (!bookKey) return [];

    const nonGenres = [
      'fiction', 'non-fiction', 'nonfiction', 'adult', 'young-adult', 'ya', 'children', 'kids',
      'audiobook', 'book-club', 'book club', 'library', 'owned', 'to-read', 'currently-reading',
      'read', 'favorites', 'favourites', 'recommended', 'modern', 'queer', 'lgbt', 'lgbtq',
      'new', 'old', 'popular', 'bestseller', 'award-winning', 'series', 'standalone', 
      'novel', 'book', 'story', 'tale', 'narrative', 'literature', 'writing', 'author', 
      'publisher', 'edition', 'format', 'hardcover', 'paperback', 'ebook', 'kindle', 
      'digital', 'print', 'audio', 'review', 'rating', 'star', 'page', 'chapter', 
      'volume', 'part', 'collection', 'anthology', 'trilogy', 'series', 'chronicles', 
      'saga', 'cycle', 'prequel', 'sequel', 'companion', 'tie-in', 'crossover',
      'genres', 'adult fiction', 'literary fiction', 'contemporary', 'coming of age',
      'friendship', 'summer'
    ];
    
    const bookGenres = apolloState[bookKey].bookGenres;
    const genres = bookGenres
      .map((g: any) => g.genre.name.toLowerCase())
      .filter((name: string) => !nonGenres.includes(name));
    
    console.log(`Found genres: ${genres.join(', ')}`);
    return genres;
    
  } catch (error) {
    console.error(`Error:`, error);
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
  const targetYearNum = parseInt(year);
  
  console.log(`Scraping to-read list via RSS for ${username}, year ${year}`);
  
  try {
    // Use RSS feed for to-read shelf
    const allToReadBooks = await scrapeBookListFromRSS(username, 'to-read');
    console.log(`Total to-read books from RSS: ${allToReadBooks.length}`);
    
    for (const book of allToReadBooks) {
      // Use userDateAdded (when book was added to shelf) for to-read list
      const bookYear = extractYearFromRSSDate(book.userDateAdded);
      
      if (bookYear === targetYearNum && book.bookId) {
        toReadIds.add(book.bookId);
        console.log(`✅ To-read book added in ${year}: ${book.title}`);
      }
    }
  } catch (error) {
    console.error(`Error scraping to-read RSS:`, error);
  }
  
  console.log(`To-read scraping complete! Found ${toReadIds.size} books added in ${year}`);
  return toReadIds;
};

console.log('Starting server...');

const app = express();
const PORT = 3001;
// app.use(cors());

// 💡 This allows all origins explicitly, which is the easiest fix 
// for Vercel Serverless Function APIs.
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization'
}));

console.log('Express app created');

app.use(express.json());

console.log('Middleware added');

// Basic test endpoint
// Add this before your /test endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Goodreads Wrapped Backend is running!' });
  });

// app.get('/test', (req, res) => {
//    console.log('Test endpoint hit');
//    res.json({ message: 'Hello from your backend!' });
// });

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
      const targetYearNum = parseInt(year);
      console.log(`Attempting to scrape ${year} books for: ${username} using RSS feed`);
      
      // Use RSS feed to get all books from 'read' shelf
      const allRSSBooks = await scrapeBookListFromRSS(username, 'read');
      console.log(`Total books from RSS: ${allRSSBooks.length}`);
      
      // Filter for target year books
      const yearBooks: Book[] = [];
      const allBooks: Book[] = [];
      
      for (const rssBook of allRSSBooks) {
        const bookYear = extractYearFromRSSDate(rssBook.userReadAt);
        
        const book: Book = {
          title: rssBook.title,
          author: rssBook.author || 'Unknown Author',
          rating: rssBook.userRating ? `${rssBook.userRating} stars` : 'No rating',
          dateRead: rssBook.userReadAt || 'Date not specified',
          dateAdded: rssBook.userDateAdded || undefined,
          userRating: rssBook.userRating,
          avgRating: rssBook.avgRating,
          numPages: rssBook.numPages,
          coverImage: rssBook.coverImage,
          authorImage: rssBook.authorImage,
          genres: [],
          review: rssBook.review,
        };
        
        // Store book ID for genre scraping
        (book as any).bookId = rssBook.bookId;
        
        allBooks.push(book);
        
        if (bookYear === targetYearNum) {
          yearBooks.push(book);
          console.log(`✅ ${year} book: ${rssBook.title}`);
        } else if (bookYear !== null) {
          console.log(`📅 Found book from ${bookYear}: ${rssBook.title}`);
        }
      }
      
      console.log(`Scraping complete! Total books found: ${allBooks.length}, Books in ${year}: ${yearBooks.length}`);

      // Scrape genres for each book read in the target year
      console.log(`Scraping genres for ${yearBooks.length} books from ${year}...`);

      const genrePromises = yearBooks.map(async (book, index) => {
        const bookId = (book as any).bookId;
        
        if (bookId) {
          // Add staggered delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, index * 100));
          const bookUrl = `https://www.goodreads.com/book/show/${bookId}`;
          const genres = await scrapeBookGenres(bookUrl);
          book.genres = genres;
          console.log(`Progress: ${index + 1}/${yearBooks.length} books processed`);
        }
        
        return book;
      });

      // Wait for all genre scraping to complete
      await Promise.all(genrePromises);

      // Clean up the bookId property we added temporarily
      yearBooks.forEach(book => {
        delete (book as any).bookId;
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

      // Calculate top genres with percentages
      const totalGenreBooks = Object.values(genreCounts).reduce((sum, count) => sum + count, 0);
      const topGenres = Object.entries(genreCounts)
        .map(([name, count]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
          count: count,
          percentage: totalGenreBooks > 0 ? (count / totalGenreBooks) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Get top 10 genres

      console.log(`Genre stats: ${uniqueGenres} unique genres, most popular: ${mostPopularGenre}`);

      // Calculate monthly genre data for chart
      console.log(`Calculating monthly genre distribution...`);
      const monthlyGenreData: { [month: string]: { [genre: string]: number } } = {};
      const monthlyBookTotals: { [month: string]: number } = {};

      yearBooks.forEach(book => {
        if (book.dateRead && book.genres && book.genres.length > 0) {
          const dateMatch = book.dateRead.match(/(\w{3})\s+\d{2},\s+(\d{4})/);
          if (dateMatch) {
            const monthAbbr = dateMatch[1];
            const year = dateMatch[2];

            const monthMap: { [key: string]: string } = {
              'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
              'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
              'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
            };

            const monthNumber = monthMap[monthAbbr];
            if (monthNumber) {
              const monthKey = `${year}-${monthNumber}`;

              if (!monthlyGenreData[monthKey]) {
                monthlyGenreData[monthKey] = {};
                monthlyBookTotals[monthKey] = 0;
              }

              // Increment total books for this month
              monthlyBookTotals[monthKey]++;

              // Count each genre fully
              book.genres.forEach(genre => {
                monthlyGenreData[monthKey][genre] =
                  (monthlyGenreData[monthKey][genre] || 0) + 1;
              });
            }
          }
        }
      });

      console.log(`Monthly genre data calculated for ${Object.keys(monthlyGenreData).length} months`);

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

      // Calculate biggest fan moment (biggest positive disparity between user rating and average rating)
      let biggestFanMoment = null as Book | null;
      let biggestFanDisparity = 0;
      
      booksWithBothRatings.forEach(book => {
        const disparity = (book.userRating || 0) - (book.avgRating || 0);
        if (disparity > biggestFanDisparity) {
          biggestFanDisparity = disparity;
          biggestFanMoment = book;
        }
      });

      console.log(`Biggest fan moment: ${biggestFanMoment ? biggestFanMoment.title : 'None'} (User: ${biggestFanMoment ? biggestFanMoment.userRating : 0}/5, Average: ${biggestFanMoment ? biggestFanMoment.avgRating : 0}/5, Disparity: ${biggestFanDisparity.toFixed(2)})`);

      const booksWithRatings = yearBooks.filter(book => book.userRating !== undefined);
      const averageRating = booksWithRatings.length > 0 
        ? booksWithRatings.reduce((sum, book) => sum + (book.userRating || 0), 0) / booksWithRatings.length
        : 0;

      // Calculate top rated books (sorted by user rating, highest first)
      const topRatedBooks = [...booksWithRatings]
        .sort((a, b) => (b.userRating || 0) - (a.userRating || 0))
        .slice(0, 5);

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

      const mostPositiveReview = booksWithReviews.length > 0 
        ? booksWithReviews.reduce((mostPositive, book) => 
            book.sentiment!.comparative > mostPositive.sentiment!.comparative ? book : mostPositive
          )
        : null;
      
      console.log(`Most positive review: ${mostPositiveReview ? mostPositiveReview.title : 'None'} (Score: ${mostPositiveReview ? mostPositiveReview.sentiment!.comparative.toFixed(3) : 0})`);

      res.json({ 
        message: `Successfully scraped ${username}'s ${year} reading list!`,
        username: username,
        year: year,
        totalBooks: allBooks.length,
        yearBooks: yearBooks.length,
        books: yearBooks,
        averageRating: Math.round(averageRating * 100) / 100,
        booksWithRatings: booksWithRatings.length,
        topRatedBooks: topRatedBooks,
        averagePages: Math.round(averagePages),
        longestBook: longestBook,
        shortestBook: shortestBook,
        booksWithPages: booksWithPages.length,
        mostPopularGenre: mostPopularGenre,
        uniqueGenres: uniqueGenres,
        genreCounts: genreCounts,
        topGenres: topGenres,
        // NEW: Reading time statistics
        averageReadingTime: Math.round(averageReadingTime * 100) / 100,
        fastestRead: fastestRead,
        slowestRead: slowestRead,
        booksWithReadingTime: booksWithReadingTime.length,
        // NEW: Biggest hater moment
        biggestHaterMoment: biggestHaterMoment,
        biggestDisparity: Math.round(biggestDisparity * 100) / 100,
        // NEW: Biggest fan moment
        biggestFanMoment: biggestFanMoment,
        biggestFanDisparity: Math.round(biggestFanDisparity * 100) / 100,
        booksWithBothRatings: booksWithBothRatings.length,
        url: `https://www.goodreads.com/review/list/${username}?shelf=read&sort=date_read`,
        // NEW: Dependability statistics
        toReadAddedCount: toReadAddedCount,
        toReadReadCount: readAndAddedInYear,
        dependability: Math.round(dependability * 1000) / 1000, // Round to 3 decimal places
        // NEW: Most scathing review
        mostScathingReview: mostScathingReview,
        mostPositiveReview: mostPositiveReview,
        booksWithReviews: booksWithReviews.length,
        // NEW: Monthly genre data
        monthlyGenreData: monthlyGenreData,
        monthlyBookTotals: monthlyBookTotals,
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

// ------------------------------------------------------------------------------------------------

// Local development server (uncomment for local dev, comment for Vercel deployment)
console.log('About to start listening...');

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (error) => {
  console.error('Server error:', error);
});

console.log('Server setup complete');

// ------------------------------------------------------------------------------------------------

// The necessary export for Vercel Serverless Functions
module.exports = app;