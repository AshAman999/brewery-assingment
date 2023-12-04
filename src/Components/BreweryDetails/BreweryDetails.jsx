import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const BreweryDetails = () => {
  const [brewery, setBrewery] = useState({});
  const [ratings, setRatings] = useState([]);
  const location = useLocation();

  // Parse the query parameters
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const rating = queryParams.get("rating");

  useEffect(() => {
    // Fetch brewery details
    fetch(`https://api.openbrewerydb.org/v1/breweries/${id}`)
      .then((response) => response.json())
      .then((data) => setBrewery(data));

    // Fetch ratings
    fetch("http://localhost:4000/brewery/1", {
      // pass authentication headers
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      // .then((data) => setRatings(data))
      .then((data) => console.log(data));
  }, [id]);

  const handleRatingSubmit = (rating, comment) => {
    // Submit rating
    fetch("/api/ratings", {
      method: "POST",
      body: JSON.stringify({ rating, comment }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Refetch ratings
        fetch("/api/ratings")
          .then((response) => response.json())
          .then((data) => setRatings(data));
      });
  };

  const handleRatingEdit = (ratingId, newRating, newComment) => {
    // Edit rating
    fetch(`/api/ratings/${ratingId}`, {
      method: "PUT",
      body: JSON.stringify({ rating: newRating, comment: newComment }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Refetch ratings
        fetch("/api/ratings")
          .then((response) => response.json())
          .then((data) => setRatings(data));
      });
  };

  return (
    <div>
      <h3>{brewery.name}</h3>
      <p>{brewery.adress}</p>
      <p>{brewery.phone}</p>
      <a href={brewery.website}>{brewery.website}</a>
      <p>Rating: {rating}</p>
      <p>
        {brewery.state}, {brewery.city}
      </p>

      {/* Display ratings */}
      {ratings.map((rating) => (
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
      {ratings.map((rating) => (
        <form key={rating.id} onSubmit={handleRatingEdit}>
          <input
            type="number"
            min="1"
            max="5"
            step="1"
            defaultValue={rating.rating}
            required
          />
          <input type="text" defaultValue={rating.comment} required />
          <button type="submit">Edit Rating</button>
        </form>
      ))}
    </div>
  );
};

export default BreweryDetails;
