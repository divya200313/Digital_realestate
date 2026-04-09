import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome, HiOutlineSearch, HiOutlineUser, HiOutlineLogout,
  HiOutlinePlusSm, HiOutlineViewGrid, HiMenu, HiX
} from 'react-icons/hi';
import { MdApartment } from 'react-icons/md';

export default function Navbar() {
  const { user, logout, isSeller } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <HiOutlineHome /> },
    { to: '/properties', label: 'Properties', icon: <HiOutlineSearch /> },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-xl shadow-black/20 border-b border-slate-800' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center group-hover:bg-amber-400 transition-colors">
              <MdApartment className="text-gray-900 text-lg" />
            </div>
            <span className="font-bold text-lg text-white">
              Estate<span className="text-gradient">Vista</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {isSeller && (
                  <Link to="/add-property" className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5">
                    <HiOutlinePlusSm className="text-lg" /> Add Property
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                    <HiOutlineUser className="text-amber-400 text-sm" />
                  </div>
                  <span className="text-sm text-slate-300">{user.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/5 text-sm"
                >
                  <HiOutlineLogout className="text-base" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary py-2 px-4 text-sm">Login</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900/98 backdrop-blur-lg border-b border-slate-800 animate-slide-up">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive(link.to) ? 'text-amber-400 bg-amber-500/10' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {link.icon} {link.label}
              </Link>
            ))}
            {user ? (
              <>
                {isSeller && (
                  <Link to="/add-property" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-amber-400 bg-amber-500/10">
                    <HiOutlinePlusSm /> Add Property
                  </Link>
                )}
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-slate-300 hover:bg-white/5">
                  <HiOutlineViewGrid /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/5"
                >
                  <HiOutlineLogout /> Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1 btn-secondary py-2 text-sm text-center">Login</Link>
                <Link to="/register" className="flex-1 btn-primary py-2 text-sm text-center">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
