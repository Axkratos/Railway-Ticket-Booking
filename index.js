const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Use CORS to avoid cross-origin issues
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Routes
const reservationsRouter = require('./routes/reservations');
app.use('/api', reservationsRouter); // Use reservations routes with base path `/api`

// Root Route (Optional)
app.get('/', (req, res) => {
  // If you're serving a front-end application:
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
  // Or, just send a response:
  // res.send('Welcome to the Railway Reservation System!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
