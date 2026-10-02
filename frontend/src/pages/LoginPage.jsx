import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed');
      
      login(data.user, data.access_token); 
      navigate('/'); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '4rem auto', padding: '2rem', backgroundColor: '#1a235a', borderRadius: '8px', color: 'white' }}>
      <h2 style={{ color: '#36ADA3', textAlign: 'center' }}>Login</h2>
      {error && <p style={{ color: '#ff4d4f' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="email" placeholder="Email" required className="form-input"
          onChange={e => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" required className="form-input"
          onChange={e => setFormData({...formData, password: e.target.value})} />
        <button type="submit" className="submit-btn" style={{ alignSelf: 'center', width: '50%' }}>Login</button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Don't have an account? <Link to="/register" style={{ color: '#36ADA3' }}>Register</Link>
      </p>
    </div>
  );
};
export default LoginPage;