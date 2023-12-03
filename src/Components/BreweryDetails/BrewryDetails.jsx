import React, { useState, useEffect } from 'react';

const BreweryDetails = () => {
  const [brewery, setBrewery] = useState({});
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    // Fetch brewery details
    fetch('/api/brewery')
      .then(response => response.json())
      .then(data => setBrewery(data));

    // Fetch ratings
    fetch('/api/ratings')
      .then(response => response.json())
      .then(data => setRatings(data));
  }, []);

  const handleRatingSubmit = (rating, comment) => {
    // Submit rating
    fetch('/api/ratings', {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        // Refetch ratings
        fetch('/api/ratings')
          .then(response => response.json())
          .then(data => setRatings(data));
      });
  };

  const handleRatingEdit = (ratingId, newRating, newComment) => {
    // Edit rating
    fetch(`/api/ratings/${ratingId}`, {
      method: 'PUT',
      body: JSON.stringify({ rating: newRating, comment: newComment }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        // Refetch ratings
        fetch('/api/ratings')
          .then(response => response.json())
          .then(data => setRatings(data));
      });
  };

  return (
    <div>
      <h3>{brewery.name}</h3>
      <p>{brewery.address}</p>
      <p>{brewery.phone}</p>
      <a href={brewery.website}>{brewery.website}</a>
      <p>Rating: {brewery.rating}</p>
      <p>
        {brewery.state}, {brewery.city}
      </p>

      {/* Display ratings */}
      {ratings.map(rating => (
        <div key={rating.id}>
          <p>Rating: {rating.rating}</p>
          <p>Comment: {rating.comment}</p>
        </div>
      ))}

      {/* Rating form */}
      <form onSubmit={handleRatingSubmit}>
        <input type="number" min="1" max="5" step="1" required />
        <input type="text" required />
        <button type="submit">Submit Rating</button>
      </form>

      {/* Edit rating form */}
      {ratings.map(rating => (
        <form key={rating.id} onSubmit={handleRatingEdit}>
          <input type="number" min="1" max="5" step="1" defaultValue={rating.rating} required />
          <input type="text" defaultValue={rating.comment} required />
          <button type="submit">Edit Rating</button>
        </form>
      ))}
    </div>
  );
};

export default BreweryDetails;
