import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass, User, Heart, MapPin, Menu, X, LogOut,
  LayoutDashboard, Package, Star, ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/destinations', label: 'Destinations', icon: MapPin },
    { to: '/hotels', label: 'Hotels', icon: Star },
    { to: '/packages', label: 'Packages', icon: Package },
    { to: '/experiences', label: 'Experiences', icon: Compass },
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Compass size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Voyen<span className="text-teal-400">tra</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(to)
                    ? 'text-teal-400 bg-teal-400/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/trips"
                  className="px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  My Trips
                </Link>
                <Link
                  to="/favorites"
                  className="p-2 text-slate-300 hover:text-orange-400 hover:bg-white/10 rounded-lg transition-all"
                  title="Favorites"
                >
                  <Heart size={18} />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 rounded-lg transition-all text-sm font-medium"
                  >
                    <User size={16} />
                    {user.name.split(' ')[0]}
                    <ChevronDown size={14} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#0d1f3c] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                      >
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      <Link
                        to="/favorites"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                      >
                        <Heart size={15} /> Saved Favorites
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-teal-500 to-teal-400 text-white rounded-lg hover:shadow-lg hover:shadow-teal-500/30 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d1f3c] border-t border-white/10 px-4 py-4 space-y-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-sm font-medium transition-all"
            >
              <Icon size={16} /> {label}
            </Link>
          ))}
          <div className="border-t border-white/10 mt-2 pt-2">
            {user ? (
              <>
                <Link to="/trips" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-all">
                  <MapPin size={16} /> My Trips
                </Link>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-all">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <Link to="/favorites" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-all">
                  <Heart size={16} /> Favorites
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg text-sm transition-all">
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-slate-300 hover:text-white text-sm">Sign In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-3 bg-teal-500 text-white rounded-lg text-sm font-medium text-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
