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
      .then((data) => {
        setRatings(data.ratings);
        setRating(data.avgRating);
        console.log(data);
      });
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
        <div
          key={rating.id}
          style={{
            border: "1px solid black",
            padding: "1rem",
            margin: "1rem",
            borderRadius: "5px",
            cursor: "pointer",
          }}>
          <p>User: {rating.user_email}</p>
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
    </div>
  );
};

export default BreweryDetails;
