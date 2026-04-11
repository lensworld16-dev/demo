import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiPencil, HiTrash, HiPhotograph, HiX } from 'react-icons/hi';
import { categoryAPI, imageAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: '', image: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getAll();
      setCategories(data.categories || []);
    } catch (err) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory.id, form);
        toast.success('Category updated');
      } else {
        await categoryAPI.create(form);
        toast.success('Category created');
      }
      setModalOpen(false);
      setEditingCategory(null);
      setForm({ name: '', image: '' });
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryAPI.delete(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await imageAPI.upload(file, 'categories');
      setForm({ ...form, image: res.image.secure_url });
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
          <p className="text-gray-500">Add, edit or delete product categories</p>
        </div>
        <Button onClick={() => { setEditingCategory(null); setForm({ name: '', image: '' }); setModalOpen(true); }}>
          <HiPlus className="w-5 h-5 mr-2" /> Add Category
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={cat.image} className="w-12 h-12 rounded-lg object-cover" alt={cat.name} />
                    <span className="font-semibold text-gray-900">{cat.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 font-mono text-sm">{cat.slug}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => { setEditingCategory(cat); setForm({ name: cat.name, image: cat.image }); setModalOpen(true); }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <HiPencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="p-10 text-center text-gray-500">Loading categories...</div>}
        {!loading && categories.length === 0 && <div className="p-10 text-center text-gray-500">No categories found.</div>}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{editingCategory ? 'Edit' : 'Add'} Category</h2>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <HiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#C41E3A] outline-none"
                    placeholder="e.g. Rings"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category Image</label>
                  <div className="space-y-4">
                    {form.image && (
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100">
                        <img src={form.image} className="w-full h-full object-cover" alt="Preview" />
                      </div>
                    )}
                    <label className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#C41E3A] transition-colors cursor-pointer text-gray-500 hover:text-[#C41E3A]">
                      <HiPhotograph className="w-5 h-5" />
                      {uploading ? 'Uploading...' : 'Upload Image'}
                      <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>

                <Button type="submit" loading={uploading} className="w-full">
                  {editingCategory ? 'Update' : 'Create'} Category
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
