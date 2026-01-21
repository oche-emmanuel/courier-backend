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
  origin: ['https://turbo-courier.onrender.com', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

app.use('/admin', adminRoutes);
app.use('/', publicRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
