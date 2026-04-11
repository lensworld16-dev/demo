import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlinePhotograph, HiOutlineX } from 'react-icons/hi';
import { productAPI, imageAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    compare_price: '',
    category: '',
    tags: '',
    stock: '',
    is_featured: false,
    is_bestseller: false,
    is_active: true
  });

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await productAPI.getById(id);
        const p = data.product;
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: p.price || '',
          compare_price: p.compare_price || '',
          category: p.category || '',
          tags: p.tags ? p.tags.join(', ') : '',
          stock: p.stock || 0,
          is_featured: p.is_featured || false,
          is_bestseller: p.is_bestseller || false,
          is_active: p.is_active !== undefined ? p.is_active : true
        });
        // Convert URLs to objects for consistent preview
        setImages(p.images ? p.images.map(url => ({ secure_url: url })) : []);
      } catch (err) {
        toast.error("Failed to load product");
        navigate('/admin/products');
      } finally {
        setFetching(false);
      }
    }
    loadProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      for (const file of files) {
        const data = await imageAPI.upload(file, 'sajhnaa/products');
        setImages((prev) => [...prev, data.image]);
      }
      toast.success('Image(s) uploaded');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrls = images.map((img) => img.secure_url);
      await productAPI.update(id, {
        ...form,
        price: parseFloat(form.price),
        compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
        stock: parseInt(form.stock) || 0,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
        images: imageUrls,
        thumbnail: imageUrls[0] || null,
      });
      toast.success('Product updated!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8 text-center text-gray-500">Loading product data...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>

          <div className="flex flex-wrap gap-4 mb-4">
            {images.map((img, i) => (
              <div key={i} className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-100 group">
                <img src={img.secure_url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <HiOutlineX className="w-3 h-3" />
                </button>
              </div>
            ))}

            <label className={`w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors ${uploading ? 'opacity-50' : ''}`}>
              {uploading ? (
                <svg className="animate-spin h-6 w-6 text-gray-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  <HiOutlinePhotograph className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-400">Upload</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Compare Price (₹)</label>
              <input
                type="number"
                name="compare_price"
                value={form.compare_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"
              >
                <option value="">Select Category</option>
                <option value="rings">Rings</option>
                <option value="earrings">Earrings</option>
                <option value="necklaces">Necklaces</option>
                <option value="bracelets">Bracelets</option>
                <option value="gifts">Gifts & Combos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma-separated)</label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"
              />
            </div>
            <div className="sm:col-span-2 flex flex-wrap gap-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-[#C41E3A] focus:ring-[#C41E3A]"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Project is Active</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={form.is_featured}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-[#C41E3A] focus:ring-[#C41E3A]"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Expertly Crafted (Show on HomePage)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="is_bestseller"
                  checked={form.is_bestseller}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-[#C41E3A] focus:ring-[#C41E3A]"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Best Seller (Show on HomePage)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={loading} size="lg">Update Product</Button>
          <Button type="button" variant="secondary" size="lg" onClick={() => navigate('/admin/products')}>Cancel</Button>
        </div>
      </form>
    </motion.div>
  );
}
