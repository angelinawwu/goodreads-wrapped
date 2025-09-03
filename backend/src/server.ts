import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface Book {
    title: string;
    author: string;
    rating: string;
    dateRead: string;
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

// app.get('/scrape/:username/books/:year', async (req, res) => {
//     try {
//       const username = req.params.username;
//       const year = req.params.year;
//       console.log(`Attempting to scrape ${year} books for: ${username}`);
      
//       const goodreadsUrl = `https://www.goodreads.com/review/list/${username}?shelf=read`;
//       console.log(`Scraping URL: ${goodreadsUrl}`);
      
//       const response = await axios.get(goodreadsUrl);
//       console.log(`Response status: ${response.status}`);
      
//       const $ = cheerio.load(response.data);

//       const allBooks: Book[] = [];
//       const yearBooks: Book[] = [];
      
//       // Find all book entries
//       $('tr[itemtype="http://schema.org/Book"]').each((index, element) => {
//         const $book = $(element);
        
//         const title = $book.find('a.field title').text().trim();
//         const author = $book.find('a.field author').text().trim();
//         const rating = $book.find('.field avg_rating').text().trim();
//         const dateRead = $book.find('.field date_read').text().trim();
        
//         if (title) {
//           const book = {
//             title: title,
//             author: author || 'Unknown Author',
//             rating: rating || 'No rating',
//             dateRead: dateRead || 'Date not specified'
//           };
          
//           allBooks.push(book);
          
//           // Check if the book was read in the specified year
//           if (dateRead && dateRead.includes(year)) {
//             yearBooks.push(book);
//           }
//         }
//       });
      
//       console.log(`Found ${allBooks.length} total books, ${yearBooks.length} in ${year}`);
      
//       res.json({ 
//         message: `Successfully scraped ${username}'s reading list!`,
//         username: username,
//         year: year,
//         totalBooks: allBooks.length,
//         yearBooks: yearBooks.length,
//         books: yearBooks,
//         url: goodreadsUrl
//       });
      
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ error: 'Something went wrong' });
//     }
//   });

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
            
            const rating = $book.find('.rating, .stars, [class*="rating"]').text().trim();
            const dateRead = $book.find('.date, .date_pub, [class*="date"]').text().trim();
            
            const book: Book = {
              title: title,
              author: author || 'Unknown Author',
              rating: rating || 'No rating',
              dateRead: dateRead || 'Date not specified'
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