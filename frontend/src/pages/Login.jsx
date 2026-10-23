import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Compass, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BG = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&h=900&fit=crop';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm({ email: 'demo@voyentra.com', password: 'demo12345' });

  return (
    <div className="min-h-screen flex">
      {/* Left panel — image */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${BG})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/90 to-teal-900/60" />
        <div className="relative z-10 flex flex-col justify-center px-12">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Compass size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Voyen<span className="text-teal-400">tra</span></span>
          </Link>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Welcome back, <br />
            <span className="gradient-text">Explorer.</span>
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Your trips, favorites, and itineraries are waiting for you.
          </p>
          <div className="flex flex-col gap-4">
            {['🏝️ Bali, Indonesia — Saved', '🏔️ Manali trip — Day 3 planned', '🗼 Paris package — 7 nights'].map((item) => (
              <div key={item} className="glass px-4 py-3 rounded-xl text-slate-200 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 justify-center lg:hidden mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Compass size={19} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Voyen<span className="text-teal-500">tra</span></span>
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in to your account</h1>
            <p className="text-slate-500 text-sm mb-6">Don't have an account? <Link to="/register" className="text-teal-600 font-medium hover:underline">Sign up</Link></p>

            {/* Demo credentials hint */}
            <button
              type="button"
              onClick={fillDemo}
              className="w-full mb-4 py-2.5 px-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-700 text-sm hover:bg-teal-100 transition-all font-medium"
            >
              🎯 Fill Demo Credentials
            </button>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base"
              >
                {loading ? <span className="spinner !w-5 !h-5 border-2" /> : <>Sign In <ArrowRight size={18} /></>}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            This is a demo application. No real bookings or payments occur.
          </p>
        </div>
      </div>
    </div>
  );
}
