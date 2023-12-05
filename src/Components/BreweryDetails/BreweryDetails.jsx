import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const BreweryDetails = () => {
  const [brewery, setBrewery] = useState({});
  const [ratings, setRatings] = useState([]);
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

  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  };

  const fetchData = async (url, options = {}) => {
    const response = await fetch(url, { headers, ...options });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  };

  const updateRatingsAndEditModeList = (data) => {
    setRatings(data.ratings);
    setRating(data.avgRating);
    setAlreadyRated(checkIfUserHasRated(data.ratings));
    setEditModeList(data.ratings.map(() => false));
  };

  const checkIfUserHasRated = (ratings) =>
    ratings.some(
      (rating) => rating.user_email === localStorage.getItem("email")
    );

  const getDetails = async () => {
    const data = await fetchData(
      `https://api.openbrewerydb.org/v1/breweries/${id}`
    );
    setBrewery(data);

    const data2 = await fetchData(`http://localhost:4000/brewery/${id}`);
    updateRatingsAndEditModeList(data2);
  };

  useEffect(() => {
    getDetails();
  }, [id]);

  const handleRatingSubmit = async (event) => {
    event.preventDefault();

    await fetchData(`http://localhost:4000/rating`, {
      method: "POST",
      body: JSON.stringify({
        breweryId: id,
        rating: newRating,
        comment: newComment,
      }),
    });

    const data = await fetchData(`http://localhost:4000/brewery/${id}`);
    updateRatingsAndEditModeList(data);
  };

  const handleRatingEdit = async (index) => {
    const data = await fetchData(`http://localhost:4000/rating`, {
      method: "PUT",
      body: JSON.stringify({ rating: editRating, comment: editComment }),
    });

    if (data.message === "Rating updated successfully") {
      const updatedRatings = [...ratings];
      updatedRatings[index] = {
        ...updatedRatings[index],
        rating: editRating,
        comment: editComment,
      };
      setRatings(updatedRatings);

      const updatedEditModeList = [...editModeList];
      updatedEditModeList[index] = false;
      setEditModeList(updatedEditModeList);

      getDetails();
    } else {
      console.error(data.message);
    }
  };

  const enableEditMode = (index) => {
    const updatedEditModeList = [...editModeList];
    updatedEditModeList[index] = true;
    setEditModeList(updatedEditModeList);
    setEditRating(ratings[index].rating);
    setEditComment(ratings[index].comment);
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

      {ratings
        .sort((a, b) =>
          a.user_email === localStorage.getItem("email") ? -1 : 1
        )
        .map((rating, index) => (
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
