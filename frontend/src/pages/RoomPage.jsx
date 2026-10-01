import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import './RoomPage.css';

const RoomDetailsPage = () => {
  const { id } = useParams();
  
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/rooms/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Room not found");
        }
        return response.json();
      })
      .then((data) => {
        setRoom(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <main className="room-details-main">
        <h1 className="details-title">Loading room details...</h1>
      </main>
    );
  }

  if (error || !room) {
    return (
      <main className="room-details-main">
        <h1 className="details-title">Room Not Found</h1>
        <Link to="/" className="back-link">Return to Home</Link>
      </main>
    );
  }

  return (
    <main className="room-details-main">
      <div className="room-details-card">
        <Link to="/" className="back-link">
          <FaChevronLeft className="back-icon" /> Back to Rooms
        </Link>

        <div className="room-content-wrapper">
          <img
            src={room.image}
            alt={room.name}
            className="room-details-image"
          />

          <div className="room-info-block">
            <h1 className="details-title">{room.name}</h1>
            <p className="details-description">{room.description}</p>

            <ul className="details-list">
              <li className="details-list-item">
                <span className="details-list-label">Category:</span>
                {room.category}
              </li>
              <li className="details-list-item">
                <span className="details-list-label">Capacity:</span>
                {room.beds} {room.beds === 1 ? 'person' : 'people'}
              </li>
              <li className="details-list-item">
                <span className="details-list-label">Price:</span>
                ${room.price}/night
              </li>
              <li className="details-list-item">
                <span className="details-list-label">Amenities:</span>
                {room.amenities.join(', ')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RoomDetailsPage;