import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProperty, deleteProperty } from '../api/properties';
import { useAuth } from '../context/AuthContext';
import ImageGallery from '../components/ImageGallery';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import {
  HiOutlineLocationMarker, HiOutlinePencil, HiOutlineTrash,
  HiOutlinePhone, HiOutlineMail, HiOutlineShare,
  HiArrowLeft, HiOutlineCheckCircle
} from 'react-icons/hi';
import { MdKingBed, MdBathtub } from 'react-icons/md';
import { BiArea } from 'react-icons/bi';

const TYPE_LABELS = { apartment: 'Apartment', house: 'House', villa: 'Villa', land: 'Land' };

export default function PropertyDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProperty(id)
      .then(({ data }) => setProperty(data))
      .catch(() => toast.error('Property not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    setDeleting(true);
    try {
      await deleteProperty(id);
      toast.success('Property deleted');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete property');
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center pt-20 gap-4">
        <div className="text-6xl">🏚️</div>
        <h2 className="text-2xl font-bold text-white">Property not found</h2>
        <Link to="/properties" className="btn-secondary py-2 px-6 text-sm">Browse Properties</Link>
      </div>
    );
  }

  const isOwner = user && property.seller?._id === user._id || user && property.seller === user._id;

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link to="/properties" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-6 text-sm" id="back-to-properties">
          <HiArrowLeft /> Back to Properties
        </Link>

        {/* Image Gallery */}
        <ImageGallery images={property.images || []} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title bar */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500/30 capitalize">
                    {TYPE_LABELS[property.type] || property.type}
                  </span>
                  {property.status === 'sold' && (
                    <span className="badge bg-red-500/20 text-red-400 border border-red-500/30">Sold</span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white">{property.title}</h1>
                <div className="flex items-center gap-1.5 mt-2 text-slate-400">
                  <HiOutlineLocationMarker className="text-amber-500" />
                  <span>{property.location?.address && `${property.location.address}, `}{property.location?.city}{property.location?.state ? `, ${property.location.state}` : ''}</span>
                </div>
              </div>
              <button
                onClick={handleShare}
                id="share-btn"
                className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                title="Share"
              >
                <HiOutlineShare className="text-xl" />
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 p-5 card">
              {property.bedrooms != null && (
                <div className="flex items-center gap-2 text-slate-300">
                  <MdKingBed className="text-amber-500 text-xl" />
                  <div>
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-xs text-slate-500">Bedroom{property.bedrooms !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              )}
              {property.bathrooms != null && (
                <div className="flex items-center gap-2 text-slate-300">
                  <MdBathtub className="text-amber-500 text-xl" />
                  <div>
                    <div className="font-semibold">{property.bathrooms}</div>
                    <div className="text-xs text-slate-500">Bathroom{property.bathrooms !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              )}
              {property.area != null && (
                <div className="flex items-center gap-2 text-slate-300">
                  <BiArea className="text-amber-500 text-xl" />
                  <div>
                    <div className="font-semibold">{property.area?.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">sq ft</div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white mb-3">About This Property</h2>
              <p className="text-slate-400 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-slate-300 text-sm">
                      <HiOutlineCheckCircle className="text-amber-500 flex-shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seller Owner Actions */}
            {isOwner && (
              <div className="card p-5 border-amber-500/20">
                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">Owner Actions</h3>
                <div className="flex gap-3">
                  <Link
                    to={`/edit-property/${id}`}
                    id="edit-property-btn"
                    className="flex items-center gap-2 btn-secondary py-2 px-4 text-sm"
                  >
                    <HiOutlinePencil /> Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    id="delete-property-btn"
                    disabled={deleting}
                    className="btn-danger flex items-center gap-2 text-sm disabled:opacity-60"
                  >
                    {deleting ? 'Deleting...' : <><HiOutlineTrash /> Delete</>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Price + Contact */}
          <div className="space-y-5">
            {/* Price Card */}
            <div className="card p-6 sticky top-24">
              <div className="text-3xl font-bold text-amber-400 mb-1">
                {formatPrice(property.price)}
              </div>
              <p className="text-slate-500 text-sm mb-6">Listed price</p>

              {/* Contact Seller */}
              {!isOwner && (
                <>
                  <div className="pb-5 border-b border-slate-700 mb-5">
                    <div className="text-sm font-semibold text-white mb-1">Listed by</div>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                        {property.seller?.name?.[0]?.toUpperCase() || 'S'}
                      </div>
                      <div>
                        <div className="text-sm text-white font-medium">{property.seller?.name || 'Seller'}</div>
                        <div className="text-xs text-slate-500">Property Seller</div>
                      </div>
                    </div>
                  </div>

                  {user ? (
                    <div className="space-y-3">
                      <a
                        href={`mailto:${property.seller?.email}`}
                        id="contact-email-btn"
                        className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                      >
                        <HiOutlineMail /> Email Seller
                      </a>
                      <a
                        href="tel:+1234567890"
                        id="contact-phone-btn"
                        className="btn-secondary w-full flex items-center justify-center gap-2 py-3"
                      >
                        <HiOutlinePhone /> Call Seller
                      </a>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-slate-400 text-sm mb-4">Sign in to contact the seller</p>
                      <Link to="/login" className="btn-primary w-full flex items-center justify-center py-3" id="login-to-contact">
                        Sign In
                      </Link>
                    </div>
                  )}
                </>
              )}

              {/* Date */}
              <p className="text-xs text-slate-600 mt-5 text-center">
                Listed {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'recently'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
