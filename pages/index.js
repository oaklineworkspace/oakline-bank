// pages/index.js
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Example: Fetch your data here
    async function fetchData() {
      try {
        const res = await fetch('/api/your-endpoint');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json || []);
      } catch (err) {
        console.error(err);
        setData([]); // Ensure it's never undefined
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to Oakline Bank</h1>
      {data && data.length > 0 ? (
        <ul>
          {data.map((item, index) => (
            <li key={index}>{item.name || 'Unnamed Item'}</li>
          ))}
        </ul>
      ) : (
        <p>No data yet, but your app is running!</p>
      )}
    </div>
  );
}
