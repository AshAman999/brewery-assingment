import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const BreweryCard = ({ id, name, address, phone, website, state, city }) => {
  const history = useHistory();
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
    history.push(`/brewery/${id}`);
  };

  return (
    <div className="brewery-card" onClick={handleClick}>
      <h3>{name}</h3>
      <p>{address}</p>
      <p>{phone}</p>
      <a href={website}>{website}</a>
      <p>Rating: {rating}</p>
      <p>
        {state}, {city}
      </p>
    </div>
  );
};

export default BreweryCard;
