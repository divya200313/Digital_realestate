import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProperty, updateProperty } from '../api/properties';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiOutlinePhotograph, HiOutlineX } from 'react-icons/hi';
import Spinner from '../components/Spinner';

const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'land'];
const AMENITIES_LIST = ['Pool', 'Gym', 'Parking', 'Garden', 'Security', 'Elevator', 'Balcony', 'Pet Friendly', 'Furnished', 'Air Conditioning', 'Heating', 'Internet'];
const STATUSES = ['active', 'sold'];

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProperty(id)
      .then(({ data }) => {
        setForm({
          title: data.title || '',
          description: data.description || '',
          price: data.price || '',
          type: data.type || 'apartment',
          bedrooms: data.bedrooms ?? '',
          bathrooms: data.bathrooms ?? '',
          area: data.area ?? '',
          status: data.status || 'active',
          location: {
            address: data.location?.address || '',
            city: data.location?.city || '',
            state: data.location?.state || '',
          },
          amenities: data.amenities || [],
          existingImages: data.images || [],
        });
      })
      .catch(() => toast.error('Failed to load property'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const key = name.split('.')[1];
      setForm((p) => ({ ...p, location: { ...p.location, [key]: value } }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const toggleAmenity = (a) => {
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(a) ? p.amenities.filter((x) => x !== a) : [...p.amenities, a],
    }));
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files].slice(0, 10));
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))].slice(0, 10));
  };

  const removeExistingImage = (i) => {
    setForm((p) => ({ ...p, existingImages: p.existingImages.filter((_, idx) => idx !== i) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      const { existingImages, amenities, location, ...rest } = form;
      Object.entries(rest).forEach(([k, v]) => fd.append(k, v));
      fd.append('location', JSON.stringify(location));
      fd.append('amenities', JSON.stringify(amenities));
      fd.append('existingImages', JSON.stringify(existingImages));
      newImages.forEach((img) => fd.append('images', img));
      await updateProperty(id, fd);
      toast.success('Property updated!');
      navigate(`/properties/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 pt-20"><Spinner size="lg" /></div>;
  if (!form) return null;

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-6 text-sm">
          <HiArrowLeft /> Back to Dashboard
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Edit Property</h1>
          <p className="text-slate-400 mt-1">Update your listing details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="card p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white border-b border-slate-700 pb-3">Basic Information</h2>
            <div>
              <label htmlFor="edit-title" className="label">Title <span className="text-red-400">*</span></label>
              <input id="edit-title" name="title" type="text" required value={form.title} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="edit-description" className="label">Description</label>
              <textarea id="edit-description" name="description" rows={4} value={form.description} onChange={handleChange} className="input-field resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Property Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {PROPERTY_TYPES.map((t) => (
                    <button key={t} type="button" onClick={() => setForm((p) => ({ ...p, type: t }))}
                      className={`py-2 rounded-lg text-sm capitalize transition-all ${form.type === t ? 'bg-amber-500 text-gray-900 font-semibold' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'}`}
                    >{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUSES.map((s) => (
                    <button key={s} type="button" onClick={() => setForm((p) => ({ ...p, status: s }))}
                      className={`py-2 rounded-lg text-sm capitalize transition-all ${form.status === s ? 'bg-amber-500 text-gray-900 font-semibold' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'}`}
                    >{s}</button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="edit-price" className="label">Price (USD) <span className="text-red-400">*</span></label>
              <input id="edit-price" name="price" type="number" required value={form.price} onChange={handleChange} className="input-field" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="edit-beds" className="label">Bedrooms</label>
                <input id="edit-beds" name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label htmlFor="edit-baths" className="label">Bathrooms</label>
                <input id="edit-baths" name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label htmlFor="edit-area" className="label">Area (ft²)</label>
                <input id="edit-area" name="area" type="number" value={form.area} onChange={handleChange} className="input-field" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white border-b border-slate-700 pb-3">Location</h2>
            <input name="location.address" type="text" placeholder="Street Address" value={form.location.address} onChange={handleChange} className="input-field" />
            <div className="grid grid-cols-2 gap-4">
              <input name="location.city" type="text" placeholder="City *" required value={form.location.city} onChange={handleChange} className="input-field" />
              <input name="location.state" type="text" placeholder="State" value={form.location.state} onChange={handleChange} className="input-field" />
            </div>
          </div>

          {/* Amenities */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white border-b border-slate-700 pb-3 mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_LIST.map((a) => (
                <button key={a} type="button" onClick={() => toggleAmenity(a)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.amenities.includes(a) ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'border-slate-700 text-slate-500 hover:border-slate-600'}`}
                >{a}</button>
              ))}
            </div>
          </div>

          {/* Existing Images */}
          {form.existingImages?.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-white border-b border-slate-700 pb-3 mb-4">Current Photos</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {form.existingImages.map((src, i) => (
                  <div key={i} className="relative group/img aspect-square rounded-lg overflow-hidden">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExistingImage(i)}
                      className="absolute top-1 right-1 bg-black/70 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/img:opacity-100 transition-all"
                    ><HiOutlineX className="text-xs" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-white border-b border-slate-700 pb-3 mb-4">Add More Photos</h2>
            <label htmlFor="edit-images" className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl p-6 flex items-center gap-3 cursor-pointer transition-colors">
              <HiOutlinePhotograph className="text-3xl text-slate-500" />
              <div>
                <p className="text-slate-300 text-sm font-medium">Upload new images</p>
                <p className="text-slate-500 text-xs">PNG, JPG, WEBP up to 5MB</p>
              </div>
              <input id="edit-images" type="file" accept="image/*" multiple className="hidden" onChange={handleNewImages} />
            </label>
            {newPreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {newPreviews.map((src, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" id="save-property-btn" disabled={saving}
            className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? <><span className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /> Saving...</> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
