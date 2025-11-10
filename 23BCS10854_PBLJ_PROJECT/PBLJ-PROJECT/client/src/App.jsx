import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import UserDashboard from './pages/User/UserDashboard';
import RecruiterDashboard from './pages/Recruiter/RecruiterDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';

// Route guards
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';

export default function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <Routes>
          {/* Default landing */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected + role-based routes */}
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <RoleGuard role="USER">
                  <UserDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute>
                <RoleGuard role="RECRUITER">
                  <RecruiterDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleGuard role="ADMIN">
                  <AdminDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* Unknown paths */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
