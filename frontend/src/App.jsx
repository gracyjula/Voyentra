import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import HotelCompare from './pages/HotelCompare';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Experiences from './pages/Experiences';
import ExperienceDetail from './pages/ExperienceDetail';
import Trips from './pages/Trips';
import TripDetail from './pages/TripDetail';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';

// Pages that use their own full-screen layout (no shared navbar/footer)
const AUTH_ROUTES = ['/login', '/register'];

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <Routes>
            {/* Auth pages — standalone layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Main app with shared navbar + footer */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/destinations" element={<Layout><Destinations /></Layout>} />
            <Route path="/destinations/:id" element={<Layout><DestinationDetail /></Layout>} />
            <Route path="/hotels" element={<Layout><Hotels /></Layout>} />
            <Route path="/hotels/compare" element={<Layout><HotelCompare /></Layout>} />
            <Route path="/hotels/:id" element={<Layout><HotelDetail /></Layout>} />
            <Route path="/packages" element={<Layout><Packages /></Layout>} />
            <Route path="/packages/:id" element={<Layout><PackageDetail /></Layout>} />
            <Route path="/experiences" element={<Layout><Experiences /></Layout>} />
            <Route path="/experiences/:id" element={<Layout><ExperienceDetail /></Layout>} />
            <Route path="/trips" element={<Layout><Trips /></Layout>} />
            <Route path="/trips/:id" element={<Layout><TripDetail /></Layout>} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/favorites" element={<Layout><Favorites /></Layout>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
