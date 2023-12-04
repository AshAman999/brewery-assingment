import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const BreweryDetails = () => {
  const [brewery, setBrewery] = useState({});
  const [ratings, setRatings] = useState([]);
  const location = useLocation();

  // Parse the query parameters
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [rating, setRating] = useState(2);
  const [newRating, setNewRating] = useState("");
  const [newComment, setNewComment] = useState("");
  const [editRating, setEditRating] = useState("");
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    // Fetch brewery details
    fetch(`https://api.openbrewerydb.org/v1/breweries/${id}`)
      .then((response) => response.json())
      .then((data) => setBrewery(data));

    // Fetch ratings
    fetch(`http://localhost:4000/brewery/${id}`, {
      // pass authentication headers
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      // .then((data) => setRatings(data))
      .then((data) => setRating(data.avgRating))
      .then((data) => console.log(data));
  }, [id]);

  const handleRatingSubmit = (rating, comment) => {
    // Submit rating
    fetch(`http://localhost:4000/rating}`, {
      method: "POST",
      body: JSON.stringify({ breweryId: id, rating, comment }),
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
    // .then((data) => {
    //   // Refetch ratings
    //   fetch("/api/ratings")
    //     .then((response) => response.json())
    //     .then((data) => setRatings(data));
    // });
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
        <input
          type="number"
          min="1"
          max="5"
          step="1"
          required
          onChange={(e) => setNewRating(e.target.value)}
        />
        <input
          type="text"
          required
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit">Submit Rating</button>
      </form>
      {/* Edit rating form */}
      {ratings.map((rating) => (
        <form key={rating.id} onSubmit={(e) => handleRatingEdit(rating.id, e)}>
          <input
            type="number"
            min="1"
            max="5"
            step="1"
            defaultValue={rating.rating}
            required
            onChange={(e) => setEditRating(e.target.value)}
          />
          <input
            type="text"
            defaultValue={rating.comment}
            required
            onChange={(e) => setEditComment(e.target.value)}
          />
          <button type="submit">Edit Rating</button>
        </form>
      ))}
    </div>
  );
};

export default BreweryDetails;
