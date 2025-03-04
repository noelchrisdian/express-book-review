import express from 'express';
import axios from 'axios';
import { books } from './booksdb.js';
import { users } from './auth_users.js';

const router = express.Router();

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required!' });
  }

  const exist = users.some((user) => username === user.username);

  if (exist) {
    return res.status(400).json({ message: 'Username already existed!' });
  }

  users.push({ username, password });
  return res.status(201).json({ message: `User with username ${username} has been registered` });
})

// Get the book list available in the shop
router.get('/', (req, res) => {
  return res.status(200).json(books);
})

// Get book details based on ISBN
router.get('/isbn/:isbn', (req, res) => {
  const item = books[req.params.isbn]

  if (!item) {
    return res.status(400).json({ message: 'Book not found!' });
  }

  return res.status(200).json(item);
})
  
// Get book details based on author
router.get('/author/:author', (req, res) => {
  const items = Object.values(books).filter((book) => book.author === req.params.author);

  return items.length > 0 ? res.status(200).json(items) : res.status(400).json({message: `No book found for ${req.params.author}`});

})

// Get all books based on title
router.get('/title/:title', (req, res) => {
  const items = Object.values(books).filter((book) => book.title === req.params.title);

  return items.length > 0 ? res.status(200).json(items) : res.status(400).json({ message: `No book found for ${req.params.title}` });
})

// Get book review
router.get('/review/:isbn', (req, res) => {
  const item = books[req.params.isbn];

  if (!item) {
    return res.status(404).json({ message: 'Book not found!' });
  }

  return res.status(200).json(item.reviews);
})

export { router as general };

BOOKS_API = '';

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(BOOKS_API);

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch books', error: error.message });
  }
})

router.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`${BOOKS_API}/isbn/${req.params.isbn}`);

    if (!response.data) {
      return res.status(400).json({ message: 'Book not found!' });
    }

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching book details', error: error.message });
  }
})

// Using Promise instead of async await
router.get('/isbn/:isbn', (req, res) => {
  axios.get(`${BOOKS_API}/isbn/${req.params.isbn}`)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(500).json({ message: 'Error fetching book details', error: error.message });
    })
})

router.get('/author/:author', async (req, res) => {
  try {
    const { author } = req.params;
    const response = await axios.get(BOOKS_API);
    const items = response.data.filter((book) => book.author === author)

    return items.length > 0 ? res.status(200).json(items) : res.status(400).json({ message: `No book found for ${author}` });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching book details', error: error.message });
  }
})

router.get('/title/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const response = await axios.get(BOOKS_API);
    const items = response.data.filter((book) => book.title === title)

    return items.length > 0 ? res.status(200).json(items) : res.status(400).json({ message: `No book found for ${title}` });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching book details', error: error.message });
  }
})