import React, { useState, useEffect } from "react";

const BrewerySearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState("by_city"); // Default search type is by city
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(true);

  const breweryTypes = [
    "micro",
    "nano",
    "regional",
    "brewpub",
    "large",
    "planning",
    "bar",
    "contract",
    "proprietor",
    "closed",
  ];

  const searchBreweries = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openbrewerydb.org/v1/breweries?${searchType}=${searchInput}&per_page=5`
      );
      const data = await response.json();
      setBreweries(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load initial data when the page loads
    searchBreweries();
    // eslint-disable-next-line
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <div className="container">
      <h1>Brewery Search App</h1>
      <div>
        <label htmlFor="searchInput">Search:</label>
        {searchType === "by_type" ? (
          <select
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}>
            <option value="">Select Brewery Type</option>
            {breweryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            id="searchInput"
            placeholder={`Enter ${searchType.replace("_", " ")}`}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        )}
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}>
          <option value="by_city">By City</option>
          <option value="by_name">By Name</option>
          <option value="by_type">By Type</option>
        </select>
        <button onClick={searchBreweries}>Search</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {breweries.length > 0 ? (
            <div>
              {breweries.map((brewery) => (
                <div key={brewery.id}>
                  <h2>{brewery.name}</h2>
                  <p>{brewery.city}</p>
                  <p>{brewery.state}</p>
                  <p>{brewery.website_url}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No breweries found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BrewerySearch;
