import React, { useState, useEffect, useContext } from 'react'; 
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import { FaChevronLeft } from 'react-icons/fa';
import { AuthContext } from '../app/providers/AuthContext.jsx';
import BookingForm from '../features/create-booking/ui/BookingForm.jsx';
import { API_BASE_URL } from '../shared/api/config.js';
import './RoomPage.css';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const { user } = useContext(AuthContext); 
  
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/rooms/${id}`)
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

  const handleDeleteRoom = async () => {
    if (!window.confirm('Are you sure you want to delete this room? ALL bookings for this room will also be deleted!')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('Room deleted successfully.');
        navigate('/'); 
      } else {
        alert('Failed to delete room.');
      }
    } catch (err) {
      console.error(err);
    }
  };

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
                {Array.isArray(room.amenities) ? room.amenities.join(', ') : room.amenities}
                </li>
            </ul>

            {user && user.role === 'admin' && (
              <button onClick={handleDeleteRoom} className="delete-room-btn">
                Delete Room
              </button>
            )}

          </div>
        </div>
      <BookingForm room={room} />
      </div>
    </main>
  );
};

export default RoomDetailsPage;