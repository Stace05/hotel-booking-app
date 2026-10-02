import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const BookingsPage = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ bookings: [], bonus_points: 0 });
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    fetch(`http://localhost:8000/api/users/${user.id}/bookings`)
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel your booking?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/bookings/${bookingId}/cancel`, {
        method: 'PUT'
      });
      if (res.ok) fetchBookings();
      else alert('Failed to cancel booking.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleExtend = async (bookingId) => {
    const days = window.prompt("How many extra days would you like to stay?", "1");
    if (!days || isNaN(days) || parseInt(days) <= 0) return;

    try {
      const res = await fetch(`http://localhost:8000/api/bookings/${bookingId}/extend`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ additional_days: parseInt(days) })
      });
      if (res.ok) fetchBookings();
      else {
        const errorData = await res.json();
        alert(`Error: ${errorData.detail}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <h2 style={{ color: 'white', textAlign: 'center', marginTop: '3rem' }}>Please login first.</h2>;
  if (loading) return <h2 style={{ color: 'white', textAlign: 'center', marginTop: '3rem' }}>Loading your history...</h2>;

  return (
    <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 1rem', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #EAE0CF', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h2 style={{ color: '#EAE0CF', margin: 0 }}>My Bookings</h2>
        <div style={{ backgroundColor: '#111844', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #EAE0CF' }}>
          My Bonuses: <strong style={{ color: '#AEC4D4', fontSize: '1.2rem' }}>{data.bonus_points.toFixed(2)}</strong>
        </div>
      </div>

      {data.bookings.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>You have no bookings yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {data.bookings.map(booking => {
            const isCancelled = booking.status === 'Cancelled';

            return (
              <div key={booking.id} style={{ 
                backgroundColor: '#111844', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderLeft: isCancelled ? '4px solid #ff4d4f' : '4px solid #EAE0CF',
                opacity: isCancelled ? 0.7 : 1
              }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#EAE0CF' }}>
                    {booking.room_name || `Booking #${booking.id}`}
                  </h3>
                  <p style={{ margin: '0.3rem 0', fontSize: '0.9rem', color: '#94a3b8' }}>Order #{booking.id}</p>
                  <p style={{ margin: '0.3rem 0' }}>Guest: {booking.guest_name}</p>
                  <p style={{ margin: '0.3rem 0' }}>Check-in: {new Date(booking.check_in).toLocaleDateString()}</p>
                  <p style={{ margin: '0.3rem 0' }}>Check-out: {new Date(booking.check_out).toLocaleDateString()}</p>
                </div>
                
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                  <div style={{ 
                    padding: '0.4rem 1rem', 
                    backgroundColor: isCancelled ? 'rgba(255, 77, 79, 0.2)' : '#065f46', 
                    color: isCancelled ? '#ff4d4f' : '#d1fae5', 
                    borderRadius: '4px', 
                    fontWeight: 'bold' 
                  }}>
                    {booking.status}
                  </div>
                  <h3 style={{ margin: 0 }}>${booking.total_price.toFixed(2)}</h3>

                  {!isCancelled && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button 
                        onClick={() => handleExtend(booking.id)}
                        style={{ background: '#EAE0CF', border: 'none', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Extend
                      </button>
                      <button 
                        onClick={() => handleCancel(booking.id)}
                        style={{ background: 'transparent', border: '1px solid #ff4d4f', color: '#ff4d4f', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;