import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Dashboard from './pages/Dashboard';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />

          {/* Protected – any authenticated user */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected – seller only */}
          <Route
            path="/add-property"
            element={
              <ProtectedRoute requiredRole="seller">
                <AddProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-property/:id"
            element={
              <ProtectedRoute requiredRole="seller">
                <EditProperty />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a2235',
              color: '#e8edf5',
              border: '1px solid #1f2d45',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#c9a84c', secondary: '#1a2235' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#1a2235' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
