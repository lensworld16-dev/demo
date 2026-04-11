import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSave, HiOutlineTrash, HiOutlinePencil, HiOutlineStar } from 'react-icons/hi';
import { productAPI, settingAPI, imageAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/helpers';
import { Link } from 'react-router-dom';

export default function AdminHomePage() {
  const [loading, setLoading] = useState(true);
  const [bestSellers, setBestSellers] = useState([]);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [homepageConfig, setHomepageConfig] = useState({
    hero_title: "The Art of",
    hero_title_bold: "Adornment",
    hero_tagline: "ANTI-TARNISH & DEMI FINE JEWELLERY",
    hero_image: "/images/hero_banner.png",
    hero_cta: "Shop Now",
    expertly_crafted_title: "",
    expertly_crafted_subtitle: "",
    expertly_crafted_description: "",
    best_sellers_title: "",
    best_sellers_subtitle: ""
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [bestSellersData, settingsData] = await Promise.all([
          productAPI.getAll({ bestseller: true, limit: 20 }),
          settingAPI.get('homepage')
        ]);
        setBestSellers(bestSellersData.products || []);
        if (settingsData.settings) {
          setHomepageConfig(prev => ({ ...prev, ...settingsData.settings }));
        }
      } catch (err) {
        toast.error("Failed to load homepage data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setHomepageConfig(prev => ({ ...prev, [name]: value }));
  };

  const saveConfig = async () => {
    try {
      await settingAPI.update('homepage', homepageConfig);
      toast.success("Home page content updated!");
    } catch (err) {
      toast.error("Failed to save changes");
    }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingHero(true);
    try {
      const data = await imageAPI.upload(file, 'sajhnaa/homepage');
      setHomepageConfig(prev => ({ ...prev, hero_image: data.image.secure_url }));
      toast.success('Hero image updated');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploadingHero(false);
    }
  };

  const removeFromBestSeller = async (id) => {
    try {
      if (!window.confirm("Remove this product from Best Sellers?")) return;
      await productAPI.update(id, { is_bestseller: false });
      setBestSellers(prev => prev.filter(p => p.id !== id));
      toast.success("Removed from Best Sellers");
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Content Management...</div>;

  return (
    <div className="space-y-8">
      {/* 0. Hero Section Control */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
            Hero Section Management
          </h2>
          <button
            onClick={saveConfig}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-black transition-all shadow-md"
          >
            <HiOutlineSave className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Top Tagline</label>
              <input
                type="text"
                name="hero_tagline"
                value={homepageConfig.hero_tagline}
                onChange={handleConfigChange}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. ANTI-TARNISH & DEMI FINE JEWELLERY"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Title Part 1 (Light)</label>
                <input
                  type="text"
                  name="hero_title"
                  value={homepageConfig.hero_title}
                  onChange={handleConfigChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. The Art of"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Title Part 2 (Bold)</label>
                <input
                  type="text"
                  name="hero_title_bold"
                  value={homepageConfig.hero_title_bold}
                  onChange={handleConfigChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. Adornment"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Button Text (CTA)</label>
              <input
                type="text"
                name="hero_cta"
                value={homepageConfig.hero_cta}
                onChange={handleConfigChange}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. Shop Now"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-500 uppercase">Hero Background Image</label>
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 group">
              <img
                src={homepageConfig.hero_image}
                alt="Hero Preview"
                className="w-full h-full object-cover"
              />
              <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                {uploadingHero ? (
                  <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    <HiOutlinePencil className="w-8 h-8 mb-2" />
                    <span className="font-bold text-sm uppercase tracking-widest">Change Banner Image</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  disabled={uploadingHero}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center">Recommended size: 1920x1080px</p>
          </div>
        </div>
      </section>

      {/* 1. Expertly Crafted Control */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#C41E3A] rounded-full" />
            Expertly Crafted Section
          </h2>
          <button
            onClick={saveConfig}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-black transition-all shadow-md"
          >
            <HiOutlineSave className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Tagline (Small Text)</label>
            <input
              type="text"
              name="expertly_crafted_subtitle"
              value={homepageConfig.expertly_crafted_subtitle}
              onChange={handleConfigChange}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#C41E3A] outline-none transition-all"
              placeholder="e.g. Expertly Crafted"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Section Title</label>
            <input
              type="text"
              name="expertly_crafted_title"
              value={homepageConfig.expertly_crafted_title}
              onChange={handleConfigChange}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#C41E3A] outline-none transition-all"
              placeholder="e.g. The Art of Adornment"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
            <textarea
              rows={4}
              name="expertly_crafted_description"
              value={homepageConfig.expertly_crafted_description}
              onChange={handleConfigChange}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#C41E3A] outline-none transition-all resize-none"
              placeholder="Tell your brand story here..."
            />
          </div>
        </div>
      </section>

      {/* 2. Best Sellers Control */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <span className="w-1.5 h-6 bg-amber-500 rounded-full" />
          Best Sellers Management
        </h2>

        {bestSellers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
            <HiOutlineStar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No best sellers selected yet.</p>
            <Link to="/admin/products" className="text-[#C41E3A] font-bold text-sm mt-2 block hover:underline">
              Add products to Best Sellers from Products list
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <th className="pb-4">Product</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bestSellers.map((item) => (
                  <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-bold text-gray-900 group-hover:text-[#C41E3A] transition-colors">{item.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-500 uppercase tracking-tighter">{item.category}</td>
                    <td className="py-4 text-sm font-bold text-gray-900">{formatPrice(item.price)}</td>
                    <td className="py-4">
                      <div className="flex items-center justify-end gap-2">
                         <Link
                          to={`/admin/products/edit/${item.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit Product"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => removeFromBestSeller(item.id)}
                          className="p-2 text-gray-400 hover:text-[#C41E3A] transition-colors"
                          title="Remove from Best Sellers"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
