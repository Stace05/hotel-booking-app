import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AddRoomPage.css';

const AddRoomPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: 1,
    price: 0,
    description: '',
    amenities: '',
    image: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Room added');
        navigate('/'); 
      } else {
        alert('Failed to add room.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'admin') {
    return <h2 className="access-denied">Access Denied. Admins only.</h2>;
  }

  return (
    <div className="add-room-container">
      <h2 className="add-room-title">Add New Room</h2>
      
      <form onSubmit={handleSubmit} className="add-room-form">
        <div className="form-grid">
          <div className="form-column">
            <div className="form-group">
              <label>Room Name</label>
              <input required name="name" type="text" value={formData.name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Type / Category</label>
              <input required name="type" type="text" value={formData.type} onChange={handleChange}  />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Capacity</label>
                <input required name="capacity" type="number" min="1" value={formData.capacity} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Price / Night ($)</label>
                <input required name="price" type="number" step="0.01" min="1" value={formData.price} onChange={handleChange} />
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: '2rem' }}>
              <button type="submit" className="save-btn">
                Save Room
              </button>
            </div>
          </div>

          <div className="form-column">
            <div className="form-group">
              <label>Amenities</label>
              <input required name="amenities" type="text" value={formData.amenities} onChange={handleChange}  />
            </div>

            <div className="form-group">
              <label>Image Filename</label>
              <input required name="image" type="text" value={formData.image} onChange={handleChange} />
            </div>

            <div className="form-group description-group">
              <label>Description</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRoomPage;