import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminReportsPage = () => {
  const { user } = useContext(AuthContext);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetch('http://localhost:8000/api/admin/reports')
        .then(res => res.json())
        .then(data => {
          setReport(data);
          setLoading(false);
        })
        .catch(err => console.error(err));
    }
  }, [user]);

  if (!user || user.role !== 'admin') return <h2 style={{ textAlign: 'center', marginTop: '3rem' }}>Access Denied. Admins only.</h2>;
  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '3rem' }}>Generating Reports...</h2>;

  return (
    <div style={{ maxWidth: '1000px', margin: '3rem auto', padding: '0 1rem' }}>
      <h2 style={{ borderBottom: '2px solid #EAE0CF', paddingBottom: '1rem', marginBottom: '2rem', color: '#EAE0CF' }}>
        Hotel Administration Reports
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        
        <div style={{ backgroundColor: '#111844', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: '#EAE0CF' }}>Room Occupancy & Popularity</h3>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #EAE0CF' }}>
                <th style={{ padding: '0.5rem 0' }}>Room Category</th>
                <th>Bookings</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {report.room_stats.map((room, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(234, 224, 207, 0.1)' }}>
                  <td style={{ padding: '0.5rem 0' }}>{room.name}</td>
                  <td>{room.bookings} times</td>
                  <td>${room.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ backgroundColor: '#111844', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: '#EAE0CF' }}>Financials (Monthly Revenue)</h3>
          {report.monthly_revenue.length === 0 ? <p>No revenue data yet.</p> : (
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #EAE0CF' }}>
                  <th style={{ padding: '0.5rem 0' }}>Month (YYYY-MM)</th>
                  <th>Income</th>
                </tr>
              </thead>
              <tbody>
                {report.monthly_revenue.map((month, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(234, 224, 207, 0.1)' }}>
                    <td style={{ padding: '0.5rem 0' }}>{month.month}</td>
                    <td style={{ fontWeight: 'bold', color: '#d1fae5' }}>${month.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: '#111844', padding: '1.5rem', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0, color: '#EAE0CF' }}>Loyal Clients (Top 5)</h3>
        {report.top_clients.length === 0 ? <p>No client data yet.</p> : (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #EAE0CF' }}>
                <th style={{ padding: '0.5rem 0' }}>Client Name</th>
                <th>Email</th>
                <th>Total Bookings</th>
                <th>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {report.top_clients.map((client, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(234, 224, 207, 0.1)' }}>
                  <td style={{ padding: '0.5rem 0' }}>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.bookings_count} stays</td>
                  <td style={{ color: '#AEC4D4' }}>${client.total_spent.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;