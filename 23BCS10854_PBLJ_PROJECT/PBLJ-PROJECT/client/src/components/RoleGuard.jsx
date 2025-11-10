import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleGuard = ({ role, children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleGuard;
