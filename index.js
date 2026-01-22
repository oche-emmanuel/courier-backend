const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');

dotenv.config();

connectDB();

const app = express();

// Disable CSP for development
app.use((req, res, next) => {
  res.removeHeader('Content-Security-Policy');
  next();
});

app.use(cors({
  origin: [
    'https://turbo-courier.onrender.com',
    'https://courier-frontend-ms06.onrender.com',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

app.get('/', (req, res) => {
  res.send('Courier Backend API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
