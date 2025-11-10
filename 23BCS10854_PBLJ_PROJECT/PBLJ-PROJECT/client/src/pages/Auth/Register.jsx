import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = existingUsers.some((u) => u.email === email);

    if (userExists) {
      alert('Email already registered! Please login.');
      navigate('/login');
      return;
    }

    const newUser = { email, password, role };
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    alert('Registration successful! Now you can login.');
    navigate('/login');
  };

  return (
    <div className="container">
        <div className='card'>
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 border"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-2 border"
        >
          <option value="USER">User</option>
          <option value="RECRUITER">Recruiter</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit" className="bg-green-600 text-white p-2">
          Register
        </button>
      </form>
    </div>
    </div>
  );
};

export default Register;
