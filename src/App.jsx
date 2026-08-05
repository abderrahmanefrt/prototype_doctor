import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MessageProvider } from './context/MessageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import Booking from './pages/Booking';
import About from './pages/About';
import Contact from './pages/Contact';
import Messages from './pages/Messages';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import InstallPrompt from './components/InstallPrompt';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Layout wrapper that hides footer on messages page
function AppLayout() {
  const location = useLocation();
  const isMessagesPage = location.pathname === '/messages';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <AnimatedRoutes />
      </main>
      {!isMessagesPage && <Footer />}
      <InstallPrompt />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const { user } = useAuth();

  const getHomeElement = () => {
    if (!user) return <Home />;
    if (user.role === 'doctor') return <Navigate to="/dashboard" replace />;
    if (user.role === 'patient') return <Navigate to="/patient-dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Home />;
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={getHomeElement()} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Public only routes */}
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
        
        {/* Protected Routes */}
        <Route path="/booking/:id" element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patient-dashboard" element={
          <ProtectedRoute role="patient">
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MessageProvider>
          <Router>
            <ScrollToTop />
            <AppLayout />
          </Router>
        </MessageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
