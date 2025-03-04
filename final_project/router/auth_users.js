import express from 'express';
import jwt from 'jsonwebtoken';
import { books } from './booksdb.js';

const router = express.Router();
let users = [];

const authenticatedUser = (username, password) => {
  const user = users.find((u) => username === u.username && password === u.password);
  return user ? true : false;
}

// Only registered users can login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required!' });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, 'fingerprint_customer', { expiresIn: '1h' });
    return res.status(200).json({ token, message: 'Login succes!' });
  } else {
    return res.status(400).json({ message: 'Invalid credentials!' });
  }
})

// Add a book review
router.put("/auth/review/:isbn", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }

  const { review } = req.body;
  const { isbn } = req.params;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(400).json({ message: 'Book not found!' });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: `Review added for book ${isbn}` });
})

router.delete('/auth/review/:isbn', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }

  const { isbn } = req.params;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(400).json({ message: 'Book not found!' });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(400).json({ message: `No review found for ${username}` });
  }

  console.log(`${username} => ${isbn}`)
  delete books[isbn].reviews[username];

  return res.status(200).json({message: 'Review has been deleted!'})
})

export { authenticatedUser, router as authenticated, users };