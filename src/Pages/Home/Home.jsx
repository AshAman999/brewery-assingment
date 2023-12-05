import React, { useState, useEffect } from "react";
import BreweryCard from "../../Components/BrewryCard/BrewryCard";

const BrewerySearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState("by_city"); // Default search type is by city
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // New state for current page
  const [totalPages, setTotalPages] = useState(null); // New state for total pages

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
        `https://api.openbrewerydb.org/v1/breweries?${searchType}=${searchInput}&page=${page}&per_page=5`
      );
      const data = await response.json();
      setBreweries(data);
      setTotalPages(Math.ceil(data.length / 5)); // Update total pages
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchBreweries();
    // eslint-disable-next-line
  }, [page]); // Add page to dependency array

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
            <div className="row justify-content-center">
              {breweries.map((brewery) => (
                <BreweryCard
                  key={brewery.id}
                  id={brewery.id}
                  name={brewery.name}
                  phone={brewery.phone}
                  website={brewery.website_url}
                  adress={brewery.street}
                  city={brewery.city}
                  state={brewery.state}></BreweryCard>
              ))}
            </div>
          ) : (
            <p>No breweries found</p>
          )}
        </div>
      )}

      {/* <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Previous
      </button>
      <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
        Next
      </button> */}
    </div>
  );
};

export default BrewerySearch;
