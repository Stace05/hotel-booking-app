import React, { useState, useEffect } from 'react';
import RoomCard from '../components/RoomCard';
import './HomePage.css';

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [bedsFilter, setBedsFilter] = useState("All");
  const [amenityFilter, setAmenityFilter] = useState("All");
  const [maxPrice, setMaxPrice] = useState(200);

  useEffect(() => {
    fetch("http://localhost:8000/api/rooms")
      .then((response) => response.json())
      .then((data) => {
        setRooms(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Could not fetch rooms:", error);
        setIsLoading(false);
      });
  }, []);

  const filteredRooms = rooms.filter(room => {
    const matchCategory = categoryFilter === "All" || room.category === categoryFilter;
    const matchPrice = room.price <= maxPrice;
    const matchBeds = bedsFilter === "All" || room.beds === Number(bedsFilter);
    const matchAmenity = amenityFilter === "All" || room.amenities.includes(amenityFilter);
    return matchCategory && matchPrice && matchBeds && matchAmenity;
  });

  return (
    <main className="home-main">
      <section className="home-header-section">
        <h1 className="home-title">Available Rooms</h1>
      </section>

      <section className="filters-container">
        <div className="filter-group">
          <label>Category:</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="filter-input">
            <option value="All">All</option>
            <option value="Economy">Economy</option>
            <option value="Standard">Standard</option>
            <option value="Luxury">Luxury</option>
          </select>
        </div>

        <div className="filter-group">
          <label>People:</label>
          <select value={bedsFilter} onChange={(e) => setBedsFilter(e.target.value)} className="filter-input">
            <option value="All">Any</option>
            <option value="1">1 Person</option>
            <option value="2">2 People</option>
            <option value="4">4 People</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Amenity:</label>
          <select value={amenityFilter} onChange={(e) => setAmenityFilter(e.target.value)} className="filter-input">
            <option value="All">Any</option>
            <option value="Wi-Fi">Wi-Fi</option>
            <option value="Air Conditioning">Air Conditioning</option>
            <option value="Patio">Patio</option>
            <option value="Mini-bar">Mini-bar</option>
            <option value="TV">TV</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Max Price (${maxPrice}):</label>
          <input 
            type="range" min="20" max="300" step="10"
            value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="filter-range"
          />
        </div>
      </section>
      
      <div className="rooms-container">
        {isLoading ? (
          <p className="no-rooms-text">Loading rooms from server...</p>
        ) : filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))
        ) : (
          <p className="no-rooms-text">No rooms found matching your criteria.</p>
        )}
      </div>
    </main>
  );
};

export default HomePage;




 
