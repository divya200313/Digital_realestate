import { Link } from 'react-router-dom';
import { HiOutlineLocationMarker, HiOutlineHome, HiOutlineCurrencyDollar } from 'react-icons/hi';
import { MdKingBed, MdBathtub } from 'react-icons/md';
import { BiArea } from 'react-icons/bi';

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
];

const TYPE_COLORS = {
  apartment: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  house: 'bg-green-500/20 text-green-400 border-green-500/30',
  villa: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  land: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

export default function PropertyCard({ property, index = 0 }) {
  const {
    _id, title, price, location, type, bedrooms, bathrooms, area, images, status
  } = property;

  const imgSrc = images?.[0] || PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
  const typeColor = TYPE_COLORS[type] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p);

  return (
    <Link
      to={`/properties/${_id}`}
      id={`property-card-${_id}`}
      className="card card-hover group block overflow-hidden"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => { e.target.src = PLACEHOLDER_IMAGES[0]; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`badge border ${typeColor} capitalize`}>
            {type}
          </span>
          {status === 'sold' && (
            <span className="badge bg-red-500/20 text-red-400 border border-red-500/30">Sold</span>
          )}
        </div>

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xl font-bold text-white drop-shadow-lg">{formatPrice(price)}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-4">
          <HiOutlineLocationMarker className="text-amber-500 flex-shrink-0" />
          <span className="line-clamp-1">{location?.city}{location?.state ? `, ${location.state}` : ''}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-slate-400 text-sm pt-4 border-t border-slate-700/50">
          {bedrooms != null && (
            <div className="flex items-center gap-1.5">
              <MdKingBed className="text-base text-slate-500" />
              <span>{bedrooms} Bed{bedrooms !== 1 ? 's' : ''}</span>
            </div>
          )}
          {bathrooms != null && (
            <div className="flex items-center gap-1.5">
              <MdBathtub className="text-base text-slate-500" />
              <span>{bathrooms} Bath{bathrooms !== 1 ? 's' : ''}</span>
            </div>
          )}
          {area != null && (
            <div className="flex items-center gap-1.5 ml-auto">
              <BiArea className="text-base text-slate-500" />
              <span>{area.toLocaleString()} ft²</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
