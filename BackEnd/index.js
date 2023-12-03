
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/brewery', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define Brewery schema
const brewerySchema = new mongoose.Schema({
  id: { type: String, required: true },
  ratingCount: { type: Number, default: 0 },
  totalRating: { type: Number, default: 0 }
});

const Brewery = mongoose.model('Brewery', brewerySchema);

// Add rating for a brewery
app.post('/breweries/:id/rating', async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  try {
    const brewery = await Brewery.findOne({ id });

    if (!brewery) {
      return res.status(404).json({ message: 'Brewery not found' });
    }

    brewery.ratingCount++;
    brewery.totalRating += rating;
    await brewery.save();

    res.json({ message: 'Rating added successfully' });
  } catch (error) {
    console.error('Failed to add rating', error);
    res.status(500).json({ message: 'Failed to add rating' });
  }
});

// Get average rating for a brewery
app.get('/breweries/:id/average-rating', async (req, res) => {
  const { id } = req.params;

  try {
    const brewery = await Brewery.findOne({ id });

    if (!brewery) {
      return res.json({ averageRating: 0 });
    }

    const averageRating = brewery.totalRating / brewery.ratingCount;
    res.json({ averageRating });
  } catch (error) {
    console.error('Failed to get average rating', error);
    res.status(500).json({ message: 'Failed to get average rating' });
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
