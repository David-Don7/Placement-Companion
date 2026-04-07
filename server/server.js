require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/dsa', require('./routes/dsa'));
app.use('/api/hr', require('./routes/hr'));
app.use('/api/company', require('./routes/company'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/survey', require('./routes/survey'));
app.use('/api/code', require('./routes/code'));
app.use('/api/solutions', require('./routes/solution'));
app.use('/api/recommendations', require('./routes/recommendation'));

// Fallback — serve index.html for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
