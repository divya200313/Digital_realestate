import { useState } from 'react';
import { HiOutlineFilter, HiOutlineX, HiOutlineSearch } from 'react-icons/hi';

const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'land'];
const AMENITIES_LIST = ['Pool', 'Gym', 'Parking', 'Garden', 'Security', 'Elevator', 'Balcony', 'Pet Friendly'];
const BEDROOMS_OPTIONS = [1, 2, 3, 4, 5];

export default function FilterSidebar({ filters, onChange, onReset }) {
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onChange({ search: localSearch });
  };

  const toggleAmenity = (amenity) => {
    const current = filters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    onChange({ amenities: updated });
  };

  const hasActiveFilters = filters.search || filters.type || filters.minPrice ||
    filters.maxPrice || filters.bedrooms || (filters.amenities?.length);

  return (
    <aside className="card p-6 space-y-6 sticky top-24 self-start">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-semibold">
          <HiOutlineFilter className="text-amber-500" />
          Filters
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
            id="reset-filters-btn"
          >
            <HiOutlineX /> Reset
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="label">Location / Keyword</label>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            id="filter-search"
            type="text"
            placeholder="City, state..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="input-field flex-1 py-2"
          />
          <button type="submit" className="btn-primary px-3 py-2">
            <HiOutlineSearch />
          </button>
        </form>
      </div>

      {/* Property Type */}
      <div>
        <label className="label">Property Type</label>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t}
              id={`filter-type-${t}`}
              onClick={() => onChange({ type: filters.type === t ? '' : t })}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                filters.type === t
                  ? 'bg-amber-500 text-gray-900'
                  : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="label">Price Range (USD)</label>
        <div className="flex gap-2 items-center">
          <input
            id="filter-min-price"
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onChange({ minPrice: e.target.value })}
            className="input-field py-2 w-full"
          />
          <span className="text-slate-500 text-xs flex-shrink-0">to</span>
          <input
            id="filter-max-price"
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            className="input-field py-2 w-full"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="label">Min. Bedrooms</label>
        <div className="flex gap-2 flex-wrap">
          {BEDROOMS_OPTIONS.map((n) => (
            <button
              key={n}
              id={`filter-beds-${n}`}
              onClick={() => onChange({ bedrooms: filters.bedrooms === String(n) ? '' : String(n) })}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                filters.bedrooms === String(n)
                  ? 'bg-amber-500 text-gray-900'
                  : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {n}+
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="label">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES_LIST.map((a) => {
            const active = (filters.amenities || []).includes(a);
            return (
              <button
                key={a}
                id={`filter-amenity-${a.toLowerCase().replace(' ', '-')}`}
                onClick={() => toggleAmenity(a)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                  active
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                    : 'border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600'
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
