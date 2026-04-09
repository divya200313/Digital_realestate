import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProperties } from '../api/properties';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';
import Spinner from '../components/Spinner';
import { HiOutlineAdjustments, HiOutlineX } from 'react-icons/hi';

const DEFAULT_FILTERS = {
  search: '', type: '', minPrice: '', maxPrice: '', bedrooms: '', amenities: [],
};

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilterMobile, setShowFilterMobile] = useState(false);
  const LIMIT = 9;

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    amenities: [],
  });

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: LIMIT,
        ...(filters.search && { search: filters.search }),
        ...(filters.type && { type: filters.type }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.bedrooms && { bedrooms: filters.bedrooms }),
        ...(filters.amenities?.length && { amenities: filters.amenities.join(',') }),
      };
      const { data } = await getProperties(params);
      setProperties(data.properties || data || []);
      setTotal(data.total || (data.properties || data || []).length);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleFilterChange = (update) => {
    setFilters((prev) => ({ ...prev, ...update }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    setSearchParams({});
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Properties</h1>
            <p className="text-slate-400 mt-1">
              {loading ? 'Searching...' : `${total.toLocaleString()} propert${total !== 1 ? 'ies' : 'y'} found`}
            </p>
          </div>
          {/* Mobile filter toggle */}
          <button
            id="mobile-filter-toggle"
            className="md:hidden btn-secondary flex items-center gap-2 py-2 px-4 text-sm"
            onClick={() => setShowFilterMobile(!showFilterMobile)}
          >
            {showFilterMobile ? <HiOutlineX /> : <HiOutlineAdjustments />}
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar — desktop always visible, mobile toggled */}
          <div className={`${showFilterMobile ? 'block' : 'hidden'} md:block w-full md:w-72 flex-shrink-0`}>
            <FilterSidebar filters={filters} onChange={handleFilterChange} onReset={resetFilters} />
          </div>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex justify-center py-32"><Spinner size="lg" /></div>
            ) : properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="text-7xl mb-4">🏚️</div>
                <h3 className="text-xl font-semibold text-white mb-2">No properties found</h3>
                <p className="text-slate-400 mb-6">Try adjusting your filters or search term</p>
                <button onClick={resetFilters} className="btn-secondary py-2 px-6 text-sm" id="empty-reset-btn">
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {properties.map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      id="prev-page-btn"
                      className="btn-secondary py-2 px-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const p = i + 1;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          id={`page-btn-${p}`}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                            page === p ? 'bg-amber-500 text-gray-900' : 'text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      id="next-page-btn"
                      className="btn-secondary py-2 px-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
