import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find((u) => u.email === email && u.password === password);

    if (foundUser) {
      localStorage.setItem('user', JSON.stringify({ email: foundUser.email, role: foundUser.role }));
      navigate(`/${foundUser.role.toLowerCase()}`);
    } else {
      alert('Invalid email or password!');
    }
  };

  return (
    <div className="container">
        <div className='card'>
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
        <button type="submit" className="bg-blue-600 text-white p-2">Login</button>
      </form>

      <p className="mt-4 text-center">
        New user?{' '}
        <Link to="/register" className="text-blue-600 underline">
          Register now
        </Link>
      </p>
      </div>
    </div>
  );
};

export default Login;
