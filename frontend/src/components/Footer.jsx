import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Globe, Share2, Camera } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <Compass size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Voyen<span className="text-teal-400">tra</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Your journey, beautifully planned. Discover destinations, compare hotels, and build perfect itineraries.
            </p>
            <div className="flex gap-3">
              {[Globe, Share2, Camera].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal-500/30 hover:text-teal-400 transition-all">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/destinations', label: 'Destinations' },
                { to: '/hotels', label: 'Hotels' },
                { to: '/packages', label: 'Holiday Packages' },
                { to: '/experiences', label: 'Local Experiences' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-teal-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/register', label: 'Sign Up' },
                { to: '/login', label: 'Sign In' },
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/trips', label: 'My Trips' },
                { to: '/favorites', label: 'Saved Favorites' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-teal-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Mail size={14} className="text-teal-400" /> support@voyentra.demo</li>
              <li className="flex items-center gap-2"><Phone size={14} className="text-teal-400" /> +91 98765 43210</li>
              <li className="flex items-start gap-2"><MapPin size={14} className="text-teal-400 mt-0.5" /> Travel Tower, Hyderabad, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <p>© 2024 Voyentra. All rights reserved. <span className="text-orange-400">Demo Application.</span></p>
          <p className="text-slate-500">All bookings are simulated. No real transactions occur.</p>
        </div>
      </div>
    </footer>
  );
}
