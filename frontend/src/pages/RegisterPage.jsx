import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Registration failed');
      
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '4rem auto', padding: '2rem', backgroundColor: '#1a235a', borderRadius: '8px', color: 'white' }}>
      <h2 style={{ color: '#36ADA3', textAlign: 'center' }}>Register</h2>
      {error && <p style={{ color: '#ff4d4f' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" placeholder="Name" required className="form-input"
          onChange={e => setFormData({...formData, name: e.target.value})} />
        <input type="email" placeholder="Email" required className="form-input"
          onChange={e => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" required className="form-input"
          onChange={e => setFormData({...formData, password: e.target.value})} />
        <button type="submit" className="submit-btn" style={{ alignSelf: 'center', width: '50%' }}>Register</button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account? <Link to="/login" style={{ color: '#36ADA3' }}>Login</Link>
      </p>
    </div>
  );
};
export default RegisterPage;