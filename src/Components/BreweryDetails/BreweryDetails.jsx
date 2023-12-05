import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const BreweryDetails = () => {
  const [brewery, setBrewery] = useState({});
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [rating, setRating] = useState(2);
  const [newRating, setNewRating] = useState("");
  const [newComment, setNewComment] = useState("");
  const [editRating, setEditRating] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editModeList, setEditModeList] = useState([]);
  const [alreadyRated, setAlreadyRated] = useState(false);

  useEffect(() => {
    fetch(`https://api.openbrewerydb.org/v1/breweries/${id}`)
      .then((response) => response.json())
      .then((data) => setBrewery(data));

    fetch(`http://localhost:4000/brewery/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setRatings(data.ratings);
        setRating(data.avgRating);
        // Check if the user has already rated
        const hasUserRated = data.ratings.some(
          (rating) => rating.user_email === localStorage.getItem("email")
        );
        setAlreadyRated(hasUserRated);

        // Initialize edit mode list
        setEditModeList(data.ratings.map(() => false));
      });
  }, [id]);

  const handleRatingSubmit = (event) => {
    event.preventDefault();

    fetch(`http://localhost:4000/rating`, {
      method: "POST",
      body: JSON.stringify({
        breweryId: id,
        rating: newRating,
        comment: newComment,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then(async () => {
        const response = await fetch(`http://localhost:4000/brewery/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        const data = await response.json();
        setRatings(data.ratings);
        setRating(data.avgRating);
        setAlreadyRated(true);
      });
  };

  const handleRatingEdit = (index) => {
    fetch(`http://localhost:4000/rating`, {
      method: "PUT",
      body: JSON.stringify({ rating: editRating, comment: editComment }),
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "Rating updated successfully") {
          // Update state to reflect the changes
          const updatedRatings = [...ratings];
          updatedRatings[index] = {
            ...updatedRatings[index],
            rating: editRating,
            comment: editComment,
          };
          setRatings(updatedRatings);

          // Disable edit mode for the current rating
          const updatedEditModeList = [...editModeList];
          updatedEditModeList[index] = false;
          setEditModeList(updatedEditModeList);
        } else {
          // Handle error message from server
          console.error(data.message);
        }
      })
      .catch((error) => {
        // Handle fetch error
        console.error(error);
      });
  };

  const enableEditMode = (index) => {
    const updatedEditModeList = [...editModeList];
    updatedEditModeList[index] = true;
    setEditModeList(updatedEditModeList);
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

      {ratings.map((rating, index) => (
        <div
          key={index}
          style={{
            border: "1px solid black",
            padding: "1rem",
            margin: "1rem",
            borderRadius: "5px",
            cursor: "pointer",
          }}>
          <p>
            User:
            {rating.user_email === localStorage.getItem("email")
              ? "You"
              : rating.user_email}
          </p>

          {editModeList[index] ? (
            <div>
              <label>Rating:</label>
              <input
                type="number"
                min="1"
                max="5"
                step="1"
                value={editRating}
                onChange={(e) => setEditRating(e.target.value)}
              />
              <br />
              <label>Comment:</label>
              <input
                type="text"
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
              />
              <br />
              <button onClick={() => handleRatingEdit(index)}>Save</button>
              <button
                onClick={() =>
                  setEditModeList((prev) => ({ ...prev, [index]: false }))
                }>
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <p>Rating: {rating.rating}</p>
              <p>Comment: {rating.comment}</p>
              {rating.user_email === localStorage.getItem("email") && (
                <button onClick={() => enableEditMode(index)}>Edit</button>
              )}
            </div>
          )}
        </div>
      ))}

      {!alreadyRated && (
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
      )}
    </div>
  );
};

export default BreweryDetails;
