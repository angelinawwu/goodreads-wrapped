import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface Book {
    title: string;
    author: string;
    rating: string;
    dateRead: string;
    userRating?: number;        // 1-5 stars
    avgRating?: number;         // Goodreads average
    numRatings?: number;        // Total ratings count
  }

console.log('Starting server...');

const app = express();
const PORT = 3001;

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
          
          
          const titleElement = $book.find('a[href*="/book/show/"]');
          const title = titleElement.text().trim();

          
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
            }            const dateRead = $book.find('.date, .date_pub, [class*="date"]').text().trim();
            
            const book: Book = {
              title: title,
              author: author || 'Unknown Author',
              rating: ratingText || 'No rating',
              dateRead: dateRead || 'Date not specified',
              userRating: userRating,
              avgRating: avgRating,
              numRatings: numRatings
            };
            
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
      
      res.json({ 
        message: `Successfully scraped ${username}'s ${year} reading list!`,
        username: username,
        year: year,
        totalBooks: allBooks.length,
        yearBooks: yearBooks.length,
        books: yearBooks,
        pagesScraped: page,
        stoppedEarly: foundOlderBook,
        url: `https://www.goodreads.com/review/list/${username}?shelf=read&sort=date_read`
      });
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

console.log('About to start listening...');

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (error) => {
  console.error('Server error:', error);
});

console.log('Server setup complete');