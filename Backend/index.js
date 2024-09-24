const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();

// Database connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('Database connection error', err));

// Middleware
app.use(express.json());
app.use(cookieParser());

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token

  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is not valid' });
    req.user = user; // Attach user to the request
    next(); // Proceed to the next middleware
  });
};

// Routes
app.use('/', require('./routes/authRoutes'));

// Example protected route to fetch habits
app.get('/habits', authenticateToken, (req, res) => {
  // You can fetch habits from MongoDB based on req.user.id (the authenticated user's ID)
  // Here's an example response for demonstration purposes:
  res.json({
    message: 'Successfully fetched habits',
    habits: [
      { id: 1, name: 'Read 10 pages', frequency: ['Monday', 'Wednesday', 'Friday'] },
      { id: 2, name: 'Run for 30 minutes', frequency: ['Tuesday', 'Thursday'] },
    ],
  });
});

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));
