import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cors from 'cors';


interface Book {
    title: string;
    author: string;
    rating: string;
    dateRead: string;
    userRating?: number;        // 1-5 stars
    avgRating?: number;         // Goodreads average
    numRatings?: number;        // Total ratings count
    numPages?: number;          // Total pages read
    coverImage?: string;         // Cover image URL
    genres?: string[];             // Genres
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
            
            const dateRead = $book.find('.date, .date_pub, [class*="date"]').text().trim();
            
            const book: Book = {
              title: title,
              author: author || 'Unknown Author',
              rating: ratingText || 'No rating',
              dateRead: dateRead || 'Date not specified',
              userRating: userRating,
              avgRating: avgRating,
              numRatings: numRatings,
              numPages: numPages,        // NEW
              coverImage: coverImage,     // NEW
              genres: [],
            };

            (book as any).bookUrl = bookUrl;

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

      // ADD THIS CODE RIGHT HERE TOO:
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
        url: `https://www.goodreads.com/review/list/${username}?shelf=read&sort=date_read`
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