import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const BreweryDetails = () => {
  const [brewery, setBrewery] = useState({});
  const [ratings, setRatings] = useState([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [rating, setRating] = useState(0);
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

    const data2 = await fetchData(`/brewery/${id}`);
    updateRatingsAndEditModeList(data2);
  };

  useEffect(() => {
    getDetails();
  }, [id]);

  const handleRatingSubmit = async (event) => {
    event.preventDefault();

    await fetchData(`/rating`, {
      method: "POST",
      body: JSON.stringify({
        breweryId: id,
        rating: newRating,
        comment: newComment,
      }),
    });

    const data = await fetchData(`/brewery/${id}`);
    updateRatingsAndEditModeList(data);
  };

  const handleRatingEdit = async (index) => {
    const data = await fetchData(`/rating/${id}`, {
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
      <div
        className="d-flex justify-content-between ps-5 pe-5 pt-3 pb-3 mb-3"
        style={{
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        }}>
        <div>
          <h3>{brewery.name}</h3>
          <p>{brewery.adress}</p>
          <p>{brewery.phone}</p>
        </div>

        <div>
          <a href={brewery.website}>{brewery.website}</a>
          <p>Rating: {rating}</p>
          <p>
            {brewery.state}, {brewery.city}
          </p>
        </div>
      </div>

      <div className="d-flex flex-column align-items-center">
        {ratings.length > 0 &&
          ratings
            .sort((a, b) =>
              a.user_email === localStorage.getItem("email") ? -1 : 1
            )
            .map((rating, index) => (
              <div
                className="col-md-6 offset-md-3 "
                key={index}
                style={{
                  padding: "1rem",
                  margin: "1rem",
                  borderRadius: "5px",
                  cursor: "pointer",
                  boxShadow:
                    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                }}>
                <p>
                  User:
                  {rating.user_email === localStorage.getItem("email")
                    ? " You"
                    : rating.user_email}
                </p>

                {editModeList[index] ? (
                  <div>
                    <label className="mb-2">Rating:</label>
                    <input
                      className="form-control"
                      type="number"
                      min="1"
                      max="5"
                      step="1"
                      value={editRating}
                      onChange={(e) => setEditRating(e.target.value)}
                    />
                    <br />
                    <label className="mb-2">Comment:</label>
                    <input
                      className="form-control"
                      type="text"
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                    />
                    <br />
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handleRatingEdit(index)}>
                      Save
                    </button>
                    <button
                      className="btn btn-primary me-2"
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
                      <button
                        className="btn btn-primary me-2"
                        onClick={() => enableEditMode(index)}>
                        Edit
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
        {ratings.length == 0 && (
          <div
            style={{
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
            }}
            className="p-5 col-md-6 mt-5">
            No ratings yet
          </div>
        )}

        {!alreadyRated && (
          <form
            onSubmit={handleRatingSubmit}
            style={{
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
            }}
            className="p-5 col-md-6 mt-5">
            <h1 className="text-center">Submit your review</h1>
            <label htmlFor="inputRating" className="mb-1">
              Rating
            </label>
            <input
              id="inputRating"
              className="form-control mb-3"
              type="number"
              min="1"
              max="5"
              step="1"
              required
              onChange={(e) => setNewRating(e.target.value)}
            />
            <label htmlFor="inputComment" className="mb-1">
              Comment
            </label>
            <input
              id="inputComment"
              className="form-control mb-3"
              type="text"
              required
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="btn btn-primary me-2" type="submit">
              Submit Rating
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BreweryDetails;
