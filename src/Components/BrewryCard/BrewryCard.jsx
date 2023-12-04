import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BreweryCard = ({ id, name, adress, phone, website, state, city }) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // Replace 'your-api-url' with the actual API URL
    fetch(`your-api-url/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setRating(data.rating || 0);
      })
      .catch((error) => {
        console.error("Error fetching rating:", error);
        setRating(0);
      });
  }, [id]);

  const handleClick = () => {
    navigate(`/brewerysearch?id=${id}`);
  };
  return (
    <div
      className="brewery-card col-lg-3 m-4 "

      onClick={handleClick}
      style={{
        padding: "1rem",
        margin: "1rem",
        borderRadius: "5px",
        cursor: "pointer",
        boxShadow : "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
      }}>
      <h3>{name}</h3>
      <p>{phone}</p>
      <a href={website}>{website}</a>

      <p>{adress}</p>
      <p>
        {state}, {city}
      </p>

      <p>Rating: {rating}</p>
    </div>
  );
};

export default BreweryCard;
