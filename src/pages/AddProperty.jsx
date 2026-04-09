import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../api/properties';
import toast from 'react-hot-toast';
import {
  HiOutlinePhotograph, HiOutlineX, HiOutlinePlusSm, HiArrowLeft
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'land'];
const AMENITIES_LIST = ['Pool', 'Gym', 'Parking', 'Garden', 'Security', 'Elevator', 'Balcony', 'Pet Friendly', 'Furnished', 'Air Conditioning', 'Heating', 'Internet'];
const STATUSES = ['active', 'sold'];

const INITIAL_FORM = {
  title: '', description: '', price: '', type: 'apartment',
  bedrooms: '', bathrooms: '', area: '', status: 'active',
  location: { address: '', city: '', state: '' },
  amenities: [],
};

export default function AddProperty() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({ ...prev, location: { ...prev.location, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleAmenity = (a) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024;
    const valid = files.filter((f) => f.size <= maxSize);
    if (valid.length < files.length) toast.error('Some files exceed 5MB and were skipped');
    setImages((prev) => [...prev, ...valid].slice(0, 10));
    const newPreviews = valid.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews].slice(0, 10));
  };

  const removeImage = (i) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.location.city) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'location') {
          fd.append('location', JSON.stringify(v));
        } else if (k === 'amenities') {
          fd.append('amenities', JSON.stringify(v));
        } else {
          fd.append(k, v);
        }
      });
      images.forEach((img) => fd.append('images', img));
      await createProperty(fd);
      toast.success('Property listed successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-6 text-sm" id="back-to-dashboard">
          <HiArrowLeft /> Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Add New Property</h1>
          <p className="text-slate-400 mt-1">Fill in the details to list your property</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="card p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white border-b border-slate-700 pb-3">Basic Information</h2>

            <div>
              <label htmlFor="add-title" className="label">Property Title <span className="text-red-400">*</span></label>
              <input id="add-title" name="title" type="text" placeholder="e.g. Modern 2BR Apartment in Downtown" required value={form.title} onChange={handleChange} className="input-field" />
            </div>

            <div>
              <label htmlFor="add-description" className="label">Description</label>
              <textarea id="add-description" name="description" rows={4} placeholder="Describe the property, neighbourhood, nearby amenities..." value={form.description} onChange={handleChange} className="input-field resize-none" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Type */}
              <div>
                <label className="label">Property Type <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-2 gap-2">
                  {PROPERTY_TYPES.map((t) => (
                    <button key={t} type="button" id={`type-${t}`}
                      onClick={() => setForm((p) => ({ ...p, type: t }))}
                      className={`py-2 px-3 rounded-lg text-sm capitalize transition-all ${form.type === t ? 'bg-amber-500 text-gray-900 font-semibold' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'}`}
                    >{t}</button>
                  ))}
                </div>
              </div>
              {/* Status */}
              <div>
                <label className="label">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUSES.map((s) => (
                    <button key={s} type="button"
                      onClick={() => setForm((p) => ({ ...p, status: s }))}
                      className={`py-2 px-3 rounded-lg text-sm capitalize transition-all ${form.status === s ? 'bg-amber-500 text-gray-900 font-semibold' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'}`}
                    >{s}</button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="add-price" className="label">Price (USD) <span className="text-red-400">*</span></label>
              <input id="add-price" name="price" type="number" min="0" placeholder="500000" required value={form.price} onChange={handleChange} className="input-field" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="add-beds" className="label">Bedrooms</label>
                <input id="add-beds" name="bedrooms" type="number" min="0" placeholder="2" value={form.bedrooms} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label htmlFor="add-baths" className="label">Bathrooms</label>
                <input id="add-baths" name="bathrooms" type="number" min="0" placeholder="2" value={form.bathrooms} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label htmlFor="add-area" className="label">Area (ft²)</label>
                <input id="add-area" name="area" type="number" min="0" placeholder="1200" value={form.area} onChange={handleChange} className="input-field" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="card p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white border-b border-slate-700 pb-3">Location</h2>
            <div>
              <label htmlFor="add-address" className="label">Street Address</label>
              <input id="add-address" name="location.address" type="text" placeholder="123 Main St" value={form.location.address} onChange={handleChange} className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="add-city" className="label">City <span className="text-red-400">*</span></label>
                <input id="add-city" name="location.city" type="text" placeholder="New York" required value={form.location.city} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label htmlFor="add-state" className="label">State</label>
                <input id="add-state" name="location.state" type="text" placeholder="NY" value={form.location.state} onChange={handleChange} className="input-field" />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white border-b border-slate-700 pb-3 mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_LIST.map((a) => {
                const active = form.amenities.includes(a);
                return (
                  <button key={a} type="button" id={`amenity-${a.toLowerCase().replace(' ', '-')}`}
                    onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'border-slate-700 text-slate-500 hover:border-slate-600'}`}
                  >{a}</button>
                );
              })}
            </div>
          </div>

          {/* Images */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white border-b border-slate-700 pb-3 mb-4">Photos</h2>
            <label
              htmlFor="add-images"
              className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors group"
            >
              <HiOutlinePhotograph className="text-4xl text-slate-500 group-hover:text-amber-500 transition-colors" />
              <div className="text-center">
                <p className="text-slate-300 font-medium">Click to upload photos</p>
                <p className="text-slate-500 text-sm mt-1">PNG, JPG, WEBP up to 5MB each (max 10)</p>
              </div>
              <input id="add-images" type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative group/img aspect-square rounded-lg overflow-hidden">
                    <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/70 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/img:opacity-100 transition-all"
                      id={`remove-image-${i}`}
                    >
                      <HiOutlineX className="text-xs" />
                    </button>
                    {i === 0 && (
                      <div className="absolute bottom-1 left-1 bg-amber-500 text-gray-900 text-[10px] font-bold rounded px-1">COVER</div>
                    )}
                  </div>
                ))}
                {previews.length < 10 && (
                  <label htmlFor="add-images" className="aspect-square rounded-lg border-2 border-dashed border-slate-700 hover:border-amber-500/50 flex items-center justify-center cursor-pointer transition-colors">
                    <HiOutlinePlusSm className="text-2xl text-slate-600" />
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="submit-property-btn"
            disabled={loading}
            className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                Uploading & Publishing...
              </span>
            ) : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
