import React from 'react';
import { Link } from 'react-router-dom';
import './RoomCard.css';

const RoomCard = ({ room }) => {
  return (
    <div className="room-card">
      <div className="room-info-container">
        <img
          src={room.image}
          alt={room.name}
          className="room-image"
        />
        <div className="room-details">
          <h4 className="room-title">{room.name}</h4>
          <p className="room-detail-text">
            <span className="detail-label">Availability: </span>
            {room.availability}
          </p>
          <p className="room-detail-text">
            <span className="detail-label">Price: </span>
            ${room.price}/hour
          </p>
        </div>
      </div>
      
      <div className="room-actions">
        <Link to={`/rooms/${room.id}`} className="view-btn">
          View Room
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;