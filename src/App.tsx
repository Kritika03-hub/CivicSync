import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import LandingPage from './components/Landing/LandingPage';
import LoginPage from './components/Auth/LoginPage';
import AdminLoginPage from './components/Auth/AdminLoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import Dashboard from './components/Dashboard/Dashboard';
import IssueList from './components/Issues/IssueList';
import ReportIssue from './components/Issues/ReportIssue';
import EventList from './components/Events/EventList';
import MapView from './components/Issues/MapView';
import CommunityChat from './components/Community/CommunityChat';
import TicketList from './components/Tickets/TicketList';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminTickets from './components/Admin/AdminTickets';
import CreateEvent from './components/Events/CreateEvent';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  return isAuthenticated && user?.role === 'admin' ? <>{children}</> : <Navigate to="/admin/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={
              !isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" />
            } />
            
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            
            <Route path="/admin/login" element={
              <AdminLoginPage />
            } />
            
            <Route path="/register" element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/issues" element={
              <ProtectedRoute>
                <IssueList />
              </ProtectedRoute>
            } />
            
            <Route path="/report-issue" element={
              <ProtectedRoute>
                <ReportIssue />
              </ProtectedRoute>
            } />
            
            <Route path="/events" element={
              <ProtectedRoute>
                <EventList />
              </ProtectedRoute>
            } />
            
            <Route path="/create-event" element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            } />
            
            <Route path="/map" element={
              <ProtectedRoute>
                <MapView />
              </ProtectedRoute>
            } />
            
            <Route path="/community" element={
              <ProtectedRoute>
                <CommunityChat />
              </ProtectedRoute>
            } />
            
            <Route path="/tickets" element={
              <ProtectedRoute>
                <TicketList />
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            <Route path="/admin/all-tickets" element={
              <AdminRoute>
                <AdminTickets />
              </AdminRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        {!isAuthenticated && <Footer />}
      </div>
    </Router>
  );
}

export default App;