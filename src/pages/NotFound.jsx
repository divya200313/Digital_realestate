import { Link } from 'react-router-dom';
import { HiOutlineHome, HiOutlineSearch } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center animate-slide-up">
        <div className="text-8xl font-black text-gradient mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/" id="go-home-btn" className="btn-primary flex items-center gap-2 py-3 px-6">
            <HiOutlineHome /> Go Home
          </Link>
          <Link to="/properties" id="browse-btn" className="btn-secondary flex items-center gap-2 py-3 px-6">
            <HiOutlineSearch /> Browse Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
