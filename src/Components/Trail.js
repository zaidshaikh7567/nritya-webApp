import React, { useState, useEffect, useCallback } from 'react';

function Trail() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define a function to fetch data from your Flask API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/search?query=${query}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  // Fetch data when the component mounts or when the query changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    
    <div>
        <h1>Search</h1>
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item.UserId}>{item.studioName} {item.address}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Trail;
