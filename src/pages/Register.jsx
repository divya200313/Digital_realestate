import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/auth';
import {
  HiOutlineMail, HiOutlineLockClosed, HiOutlineUser,
  HiOutlineEye, HiOutlineEyeOff
} from 'react-icons/hi';
import { MdApartment } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data.user, data.token);
      toast.success(`Account created! Welcome, ${data.user.name}!`);
      navigate(data.user.role === 'seller' ? '/dashboard' : '/properties');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4 pt-16 pb-10">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
              <MdApartment className="text-gray-900 text-xl" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-slate-400">Join thousands of property seekers</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector */}
            <div>
              <label className="label">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'buyer', label: '🔍 Browse & Buy', desc: 'Find properties' },
                  { value: 'seller', label: '🏠 List & Sell', desc: 'Post properties' },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    id={`role-${r.value}`}
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                      form.role === r.value
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                    }`}
                  >
                    <div className="text-sm font-semibold text-white mb-0.5">{r.label}</div>
                    <div className="text-xs text-slate-500">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="reg-name" className="label">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="input-field pl-11"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="label">Email address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="input-field pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="label">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                <input
                  id="reg-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="input-field pl-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  id="reg-toggle-password"
                >
                  {showPass ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="register-submit-btn"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
