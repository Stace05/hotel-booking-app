import React, { useState } from 'react';
import RoomCard from '../components/RoomCard';
import './HomePage.css';

const initialRooms = [
  {
    id: 1,
    name: "Luxury Suite",
    category: "Luxury",
    beds: 2,
    amenities: ["Wi-Fi", "Mini-bar", "Patio", "TV", "Air Conditioning"],
    description: "Large room with a view.",
    price: 150,
    image: "https://media.istockphoto.com/id/1266155634/uk/%D1%84%D0%BE%D1%82%D0%BE/%D1%80%D0%BE%D0%B7%D0%BA%D1%96%D1%88%D0%BD%D1%96-%D1%82%D0%B0-%D0%B5%D0%BB%D0%B5%D0%B3%D0%B0%D0%BD%D1%82%D0%BD%D1%96-%D1%96%D0%BD%D1%82%D0%B5%D1%80%D1%94%D1%80%D0%B8-%D1%81%D0%BF%D0%B0%D0%BB%D1%8C%D0%BD%D1%96.jpg?s=612x612&w=0&k=20&c=n4PxtcBlW2ybX3Cml-C5xcou6qsAkOVUtdoqsWTggVc="
  },
  {
    id: 2,
    name: "Standard Double Room",
    category: "Standard",
    beds: 2,
    amenities: ["Wi-Fi", "TV", "Air Conditioning"],
    description: "Standard room for two.",
    price: 100,
    image: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3AtMzEyLXRlZDY2OTYtY2hpbS5qcGc.jpg"
  },
  {
    id: 3,
    name: "Single Room",
    category: "Economy",
    beds: 1,
    amenities: ["Wi-Fi", "Air Conditioning"],
    description: "Budget option for a single person",
    price: 80,
    image: "https://media.istockphoto.com/id/1153225644/photo/3d-render-of-luxury-hotel-room.jpg?s=612x612&w=0&k=20&c=RlWB-SdsgfF3k4cIRv-kqcc1mNuAmxyNjST7ajvK7PI="
  },
  {
    id: 4,
    name: "Family Suite",
    category: "Standard",
    beds: 4,
    amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini-bar"],
    description: "Large room for a family of four.",
    price: 120,
    image: "https://media.istockphoto.com/id/2093684615/uk/%D1%84%D0%BE%D1%82%D0%BE/%D0%BF%D1%80%D0%BE%D1%81%D1%82%D0%BE%D1%80%D0%B0-%D1%81%D1%83%D1%87%D0%B0%D1%81%D0%BD%D0%B0-%D0%B2%D1%96%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D1%8F-%D0%B7%D0%B0-%D0%B4%D0%BE%D0%BF%D0%BE%D0%BC%D0%BE%D0%B3%D0%BE%D1%8E-%D1%86%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%B8%D1%85-%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D0%B9.jpg?s=612x612&w=0&k=20&c=U5Tgpz89IAN-Ex7oiYq_iZ6JFDVreJSb7RHUwzz7llk="
  }
];

const HomePage = () => {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [bedsFilter, setBedsFilter] = useState("All");
  const [amenityFilter, setAmenityFilter] = useState("All");
  const [maxPrice, setMaxPrice] = useState(200);

  const filteredRooms = initialRooms.filter(room => {
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
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-input"
          >
            <option value="All">All</option>
            <option value="Economy">Economy</option>
            <option value="Standard">Standard</option>
            <option value="Luxury">Luxury</option>
          </select>
        </div>

        <div className="filter-group">
          <label>People:</label>
          <select 
            value={bedsFilter} 
            onChange={(e) => setBedsFilter(e.target.value)}
            className="filter-input"
          >
            <option value="All">Any</option>
            <option value="1">1 Person</option>
            <option value="2">2 People</option>
            <option value="4">4 People</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Amenity:</label>
          <select 
            value={amenityFilter} 
            onChange={(e) => setAmenityFilter(e.target.value)}
            className="filter-input"
          >
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
            type="range" 
            min="20" 
            max="300" 
            step="10"
            value={maxPrice} 
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="filter-range"
          />
        </div>
      </section>
      
      <div className="rooms-container">
        {filteredRooms.length > 0 ? (
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