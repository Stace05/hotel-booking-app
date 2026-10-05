import React from 'react';
import { Link } from 'react-router-dom';
import './RoomCard.css';

const RoomCard = ({ room }) => {
  return (
    <div className="room-card">
      <div className="room-info-container">
        <img src={room.image} alt={room.name} className="room-image" />
        <div className="room-details">
          <h4 className="room-title">{room.name}</h4>
          
          <div className="room-badges">
            <span className="badge category-badge">{room.category}</span>
            <span className="badge beds-badge">{room.beds} {room.beds === 1 ? 'person' : 'people'}</span>
          </div>

          <p className="room-description">{room.description}</p>
          
          <div className="room-meta">
            <div className="room-amenities">
              <span className="detail-label">Amenities: </span> 
              {room.amenities.join(', ')}
            </div>
            <div className="room-price">
              <span className="detail-label">Price: </span>
              ${room.price}/night
            </div>
          </div>
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