import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineLocationMarker, HiArrowRight, HiOutlineShieldCheck, HiOutlineStar, HiOutlineHome } from 'react-icons/hi';
import { MdApartment, MdVilla, MdLandscape } from 'react-icons/md';
import { getProperties } from '../api/properties';
import PropertyCard from '../components/PropertyCard';
import Spinner from '../components/Spinner';

const STATS = [
  { number: '12,000+', label: 'Properties Listed' },
  { number: '8,500+', label: 'Happy Clients' },
  { number: '150+', label: 'Cities Covered' },
  { number: '98%', label: 'Satisfaction Rate' },
];

const CATEGORIES = [
  { label: 'Apartment', icon: <MdApartment className="text-3xl" />, type: 'apartment', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 hover:border-blue-500/50' },
  { label: 'House', icon: <HiOutlineHome className="text-3xl" />, type: 'house', color: 'from-green-500/20 to-green-600/10 border-green-500/20 hover:border-green-500/50' },
  { label: 'Villa', icon: <MdVilla className="text-3xl" />, type: 'villa', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20 hover:border-purple-500/50' },
  { label: 'Land', icon: <MdLandscape className="text-3xl" />, type: 'land', color: 'from-orange-500/20 to-orange-600/10 border-orange-500/20 hover:border-orange-500/50' },
];

const WHY_US = [
  { icon: <HiOutlineShieldCheck className="text-2xl" />, title: 'Verified Listings', desc: 'Every property is verified by our team before going live.' },
  { icon: <HiOutlineStar className="text-2xl" />, title: 'Premium Quality', desc: 'Curated selection of top-tier properties across the country.' },
  { icon: <HiOutlineLocationMarker className="text-2xl" />, title: 'Prime Locations', desc: 'Find properties in the most sought-after neighbourhoods.' },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProperties({ limit: 6 })
      .then((r) => setFeatured(r.data.properties || r.data || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoadingFeatured(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="max-w-3xl animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-amber-400 text-sm font-medium">New listings added daily</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
              Find Your{' '}
              <span className="text-gradient">Perfect</span>{' '}
              Home Today
            </h1>
            <p className="text-slate-400 text-xl mb-10 max-w-xl leading-relaxed">
              Discover thousands of verified properties — from cozy apartments to luxury villas — all in one place.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3 flex-col sm:flex-row max-w-2xl">
              <div className="flex-1 relative">
                <HiOutlineLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 text-xl" />
                <input
                  id="hero-search"
                  type="text"
                  placeholder="Search by city, state or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-12 py-4 text-base"
                />
              </div>
              <button type="submit" className="btn-primary flex items-center justify-center gap-2 py-4 px-8 text-base" id="hero-search-btn">
                <HiOutlineSearch className="text-xl" />
                Search
              </button>
            </form>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-2 mt-5">
              {['India', 'Los Angeles', 'Chicago', 'Austin'].map((city) => (
                <button
                  key={city}
                  onClick={() => navigate(`/properties?search=${city}`)}
                  className="text-xs text-slate-400 hover:text-amber-400 bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 px-3 py-1.5 rounded-full transition-all"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-slate-600 text-xs">Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
        </div>
      </section>

      {/* ── Stats ── */}



      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">Browse by Category</h2>
          <p className="text-slate-400">Find your ideal property type</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.type}
              to={`/properties?type=${cat.type}`}
              id={`category-${cat.type}`}
              className={`group flex flex-col items-center gap-4 p-8 rounded-2xl border bg-gradient-to-br ${cat.color} transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="text-amber-400 group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <span className="text-white font-semibold">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Listings ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="section-title mb-2">Featured Listings</h2>
            <p className="text-slate-400">Hand-picked premium properties</p>
          </div>
          <Link to="/properties" className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium" id="view-all-link">
            View All <HiArrowRight />
          </Link>
        </div>

        {loadingFeatured ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-slate-400 text-lg">No properties yet.</p>
            <p className="text-slate-500 text-sm mt-2">Be the first to list a property!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
          </div>
        )}
      </section>

      {/* ── Why Us ── */}
      <section className="bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <h2 className="section-title mb-3">Why Choose EstateVista?</h2>
            <p className="text-slate-400 max-w-xl mx-auto">We make finding your dream home simple, transparent, and trustworthy.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_US.map((w) => (
              <div key={w.title} className="card p-8 text-center hover:border-amber-500/30 transition-all duration-300">
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-amber-400">
                  {w.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{w.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
                <MdApartment className="text-gray-900" />
              </div>
              <span className="font-bold text-white">Estate<span className="text-gradient">Vista</span></span>
            </div>
            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} EstateVista. All rights reserved.</p>
            <div className="flex gap-4 text-sm text-slate-500">
              <Link to="/properties" className="hover:text-amber-400 transition-colors">Browse</Link>
              <Link to="/register" className="hover:text-amber-400 transition-colors">Sign Up</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
