const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// POST route for /bfhl
app.post('/bfhl', (req, res) => {
  try {
    const { data, user_id, email, roll_number } = req.body;

    // Basic input validation
    if (!user_id || typeof user_id !== 'string') {
      return res.status(400).json({
        is_success: false,
        message: 'Invalid or missing user_id. It must be a non-empty string.',
      });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        is_success: false,
        message: 'Invalid or missing email. It must be a valid email address.',
      });
    }

    if (!roll_number || typeof roll_number !== 'string') {
      return res.status(400).json({
        is_success: false,
        message: 'Invalid or missing roll_number. It must be a non-empty string.',
      });
    }

    if (!Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        message: 'Invalid or missing data. It must be an array.',
      });
    }

    // Separate numbers and alphabets
    const numbers = [];
    const alphabets = [];
    let highestLowercase = null;

    data.forEach((item) => {
      if (!isNaN(item)) {
        // Check if the item is a number
        numbers.push(item);
      } else if (typeof item === 'string' && item.length === 1) {
        // Check if the item is a single alphabet character
        alphabets.push(item);

        // Check if the alphabet is lowercase and find the highest lowercase alphabet
        const lowerCaseItem = item.toLowerCase();
        if (lowerCaseItem === item && (!highestLowercase || lowerCaseItem > highestLowercase)) {
          highestLowercase = lowerCaseItem;
        }
      }
    });

    const response = {
      is_success: true,
      user_id: user_id,
      email: email,
      roll_number: roll_number,
      numbers: numbers,
      alphabets: alphabets,
      highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
    };

    res.json(response);

  } catch (error) {
    // Handle unexpected errors
    console.error('Error processing request:', error);
    res.status(500).json({
      is_success: false,
      message: 'An internal server error occurred. Please try again later.',
    });
  }
});

// GET route for /bfhl
app.get('/bfhl', (req, res) => {
  try {
    res.status(200).json({ operation_code: 1 });
  } catch (error) {
    // Handle unexpected errors
    console.error('Error processing GET request:', error);
    res.status(500).json({
      is_success: false,
      message: 'An internal server error occurred. Please try again later.',
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
