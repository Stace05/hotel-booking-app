import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './BookingForm.css';

const BookingForm = ({ room }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    guest_name: '',
    check_in: '',
    check_out: '',
    add_meals: false,
    add_transfer: false,
    add_spa: false
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [bookingResult, setBookingResult] = useState(null); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Processing your booking...' });
    setBookingResult(null);

    const payload = {
      room_id: room.id,
      user_id: user.id, 
      guest_name: formData.guest_name,
      check_in: `${formData.check_in}T14:00:00`,
      check_out: `${formData.check_out}T12:00:00`,
      extras: {
        meals: formData.add_meals,
        transfer: formData.add_transfer,
        spa: formData.add_spa
      }
    };
    

    try {
      const response = await fetch('http://localhost:8000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong');
      }

      setStatus({ type: 'success', message: 'Booking confirmed' });
      setBookingResult({
        nights: data.nights,
        total_price: data.total_price
      });
      setFormData({ guest_name: '', check_in: '', check_out: '', add_meals: false, add_transfer: false, add_spa: false });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };
  
  if (!user) {
    return (
      <div className="booking-form-container" style={{ textAlign: 'center' }}>
        <h2 className="booking-title">Book this Room</h2>
        <p style={{ color: 'white', fontSize: '1.2rem' }}>
          Please <Link to="/login" style={{ color: '#EAE0CF' }}>Login</Link> or <Link to="/register" style={{ color: '#EAE0CF' }}>Register</Link> to book a room.
        </p>
      </div>
    );
  }

  return (
    <div className="booking-form-container">
      <h2 className="booking-title">Book this Room</h2>
      
      {status.message && (
        <div className={`status-message ${status.type}`}>
          <p>{status.message}</p>
          
          {bookingResult && (
            <div className="booking-receipt">
              <p>Total Nights: <strong>{bookingResult.nights}</strong></p>
              <p>Total Price: <strong>${bookingResult.total_price.toFixed(2)}</strong></p>
              {bookingResult.nights >= 3 && (
                <p className="discount-text">10% long-stay discount applied</p>
              )}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="booking-form-layout">
        
        <div className="form-left-col">
          <div className="form-group">
            <label htmlFor="guest_name">Full Name</label>
            <input type="text" id="guest_name" name="guest_name" required
              value={formData.guest_name} onChange={handleChange}
              className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="check_in">Check-in Date</label>
            <input type="date" id="check_in" name="check_in" required
              value={formData.check_in} onChange={handleChange}
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              onFocus={(e) => e.target.showPicker && e.target.showPicker()}
              className="form-input date-input" />
          </div>

          <div className="form-group">
            <label htmlFor="check_out">Check-out Date</label>
            <input type="date" id="check_out" name="check_out" required
              value={formData.check_out} onChange={handleChange}
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              onFocus={(e) => e.target.showPicker && e.target.showPicker()}
              className="form-input date-input" />
          </div>
        </div>

        <div className="form-right-col">
          <div className="extras-group">
            <h3 className="extras-title">Additional Services</h3>
            <label className="checkbox-label">
              <input type="checkbox" name="add_meals" checked={formData.add_meals} onChange={handleChange} />
              Include Dinner (+$30/day)
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="add_transfer" checked={formData.add_transfer} onChange={handleChange} />
              Airport Transfer (+$50 flat)
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="add_spa" checked={formData.add_spa} onChange={handleChange} />
              SPA Access (+$100 flat)
            </label>
          </div>

          <button type="submit" className="submit-btn" disabled={status.type === 'loading'} style={{ alignSelf: 'center', width: '50%' }}>
            {status.type === 'loading' ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;