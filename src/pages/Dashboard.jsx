import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyProperties, deleteProperty } from '../api/properties';
import PropertyCard from '../components/PropertyCard';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import {
  HiOutlineHome, HiOutlinePlusSm, HiOutlineUser,
  HiOutlineCurrencyDollar, HiOutlineEye, HiOutlineTrash
} from 'react-icons/hi';
import { MdTrendingUp } from 'react-icons/md';

export default function Dashboard() {
  const { user, isSeller } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProperties = () => {
    if (!isSeller) { setLoading(false); return; }
    getMyProperties()
      .then(({ data }) => setProperties(data.properties || data || []))
      .catch(() => toast.error('Failed to load your listings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMyProperties(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await deleteProperty(id);
      toast.success('Property deleted');
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error('Failed to delete property');
    }
  };

  const totalValue = properties.reduce((sum, p) => sum + (p.price || 0), 0);
  const formatPrice = (p) =>
    new Intl.NumberFormat('en-US', { notation: 'compact', style: 'currency', currency: 'USD', maximumFractionDigits: 1 }).format(p);

  const stats = [
    { icon: <HiOutlineHome />, label: 'Total Listings', value: properties.length, color: 'text-blue-400 bg-blue-500/10' },
    { icon: <MdTrendingUp />, label: 'Active Listings', value: properties.filter((p) => p.status !== 'sold').length, color: 'text-green-400 bg-green-500/10' },
    { icon: <HiOutlineCurrencyDollar />, label: 'Portfolio Value', value: formatPrice(totalValue), color: 'text-amber-400 bg-amber-500/10' },
    { icon: <HiOutlineEye />, label: 'Sold', value: properties.filter((p) => p.status === 'sold').length, color: 'text-purple-400 bg-purple-500/10' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 mt-1">
              Welcome back, <span className="text-amber-400">{user?.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <HiOutlineUser className="text-amber-400 text-sm" />
              <span className="text-amber-400 text-xs font-medium capitalize">{user?.role}</span>
            </div>
            {isSeller && (
              <Link to="/add-property" id="add-property-dashboard-btn" className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
                <HiOutlinePlusSm className="text-lg" /> Add Property
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        {isSeller && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((s) => (
              <div key={s.label} className="card p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.color}`}>
                  {s.icon}
                </div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Buyer view */}
        {!isSeller && (
          <div className="card p-10 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-white mb-2">You're browsing as a Buyer</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Explore thousands of properties and find your dream home.
            </p>
            <Link to="/properties" className="btn-primary py-3 px-8 inline-flex items-center gap-2" id="browse-properties-btn">
              Browse Properties
            </Link>
          </div>
        )}

        {/* My Listings */}
        {isSeller && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">My Listings</h2>
              <span className="text-sm text-slate-500">{properties.length} total</span>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : properties.length === 0 ? (
              <div className="card p-16 text-center">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-white mb-2">No listings yet</h3>
                <p className="text-slate-400 mb-6">Start by adding your first property</p>
                <Link to="/add-property" className="btn-primary py-3 px-8 inline-flex items-center gap-2" id="first-listing-btn">
                  <HiOutlinePlusSm /> Add Your First Property
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {properties.map((p, i) => (
                  <div key={p._id} className="relative group">
                    <PropertyCard property={p} index={i} />
                    {/* Delete overlay */}
                    <button
                      onClick={() => handleDelete(p._id)}
                      id={`delete-listing-${p._id}`}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/90 hover:bg-red-500 text-white p-1.5 rounded-lg"
                      title="Delete listing"
                    >
                      <HiOutlineTrash className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
