import React, { useState, useEffect, useCallback } from 'react';
import StudioCard from './StudioCard';

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
    console.log(data)
  }, [fetchData]);

  return (
    
    <div>
      <h1>Search</h1>
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
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {data.map((item) => (
            <div key={item.UserId} style={{ flex: '50%', padding: '10px' }}>
              <StudioCard
                studioName={item.studioName}
                studioAddress={item.address}
                studioTiming={item.timing}
                studioPrice={item.price}
                studioInstructors={item.instructors}
                studioDanceStyles={item.danceStyles}
                studioContactNumber={item.contactNumber}
                studioId={item.studioId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Trail;
