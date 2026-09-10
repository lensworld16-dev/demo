import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlinePhotograph,
  HiOutlineTrash,
  HiOutlineStar,
  HiStar,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlinePlus,
  HiOutlineLink,
  HiOutlineCheck,
  HiOutlineX,
} from 'react-icons/hi';
import { imageAPI } from '../../services/api';
import toast from 'react-hot-toast';

// Curated library of all authentic store product photos
export const STORE_LIBRARY_IMAGES = [
  { url: '/images/products/img_3404.webp', name: 'Temple Mango Mala Set' },
  { url: '/images/products/img_3403.webp', name: 'Kasu Mala Ruby Choker Set' },
  { url: '/images/products/img_3234.webp', name: 'Lakshmi Temple Collar Choker' },
  { url: '/images/products/img_3241.webp', name: 'Lakshmi Kasu Coin Mala' },
  { url: '/images/products/img_3249.webp', name: 'Chandramukhi Crescent Choker' },
  { url: '/images/products/img_3465.webp', name: 'Chandramukhi Choker (Box View)' },
  { url: '/images/products/img_3242.webp', name: 'Mandala Ruby Emerald Choker' },
  { url: '/images/products/img_3408.webp', name: 'Antique Mango Bud Choker' },
  { url: '/images/products/img_3414.webp', name: 'Mesh Floral Choker Set' },
  { url: '/images/products/img_3430.webp', name: 'Ghungroo Peacock Crescent Choker' },
  { url: '/images/products/img_3441.webp', name: 'Lakshmi Coin Long Haram' },
  { url: '/images/products/img_3453.webp', name: 'Hasli Choker & Grand Jhumkas' },
  { url: '/images/products/img_3457.webp', name: 'Mango Paisley Mala Necklace' },
  { url: '/images/products/img_3459.webp', name: 'Kasu Choker with Ghungroo' },
  { url: '/images/products/img_3467.webp', name: 'Shell Fan Petal Choker' },
  { url: '/images/products/img_3221.webp', name: 'Floral Pearl Cluster Choker' },
  { url: '/images/products/img_3201.webp', name: 'Pearl Mala Crescent Pendant' },
  { url: '/images/products/img_3132.webp', name: 'Elephant Motif Chain Necklace' },
  { url: '/images/products/img_3155.webp', name: 'Elephant Necklace (Close-up)' },
  { url: '/images/products/img_3172.webp', name: 'Emerald Filigree Pendant Necklace' },
  { url: '/images/products/img_3182.webp', name: 'Medallion Hasli Choker' },
  { url: '/images/products/img_3231.webp', name: 'Medallion Hasli (Angle 2)' },
  { url: '/images/products/img_3193.webp', name: 'Paisley Motif Drop Necklace' },
  { url: '/images/products/img_3426.webp', name: 'Royal Jadau Teardrop Pendant' },
  { url: '/images/products/img_3148.webp', name: 'Peacock Pearl Drop Earrings' },
  { url: '/images/products/img_3214.webp', name: 'Temple Gold Floral Kadas Pair' },
];

export default function ProductImageManager({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // Helper to ensure uniform format { secure_url: string }
  const normalizedImages = images.map((img) =>
    typeof img === 'string' ? { secure_url: img } : img
  );

  const updateImages = (newImgs) => {
    onChange(newImgs);
  };

  // Upload handler with base64 persistence
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    const toastId = toast.loading('Processing image(s)...');
    try {
      const added = [];
      for (const file of files) {
        const res = await imageAPI.upload(file);
        if (res?.secure_url) {
          added.push({ secure_url: res.secure_url });
        }
      }
      if (added.length) {
        updateImages([...normalizedImages, ...added]);
        toast.success(`${added.length} image(s) added!`, { id: toastId });
      } else {
        toast.error('Failed to process image', { id: toastId });
      }
    } catch (err) {
      toast.error('Upload failed: ' + err.message, { id: toastId });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Add by URL
  const handleAddUrl = (e) => {
    e.preventDefault();
    const cleanUrl = urlInput.trim();
    if (!cleanUrl) return;
    updateImages([...normalizedImages, { secure_url: cleanUrl }]);
    setUrlInput('');
    setShowUrlInput(false);
    toast.success('Image URL added');
  };

  // Toggle from library
  const handleToggleLibraryImage = (url) => {
    const exists = normalizedImages.some((img) => img.secure_url === url);
    if (exists) {
      updateImages(normalizedImages.filter((img) => img.secure_url !== url));
      toast('Image removed', { icon: '🗑️' });
    } else {
      updateImages([...normalizedImages, { secure_url: url }]);
      toast.success('Photo added from gallery!');
    }
  };

  // Set as Primary Thumbnail (move to index 0)
  const handleSetPrimary = (index) => {
    if (index === 0) return;
    const target = normalizedImages[index];
    const rest = normalizedImages.filter((_, i) => i !== index);
    updateImages([target, ...rest]);
    toast.success('Set as Main Thumbnail! ⭐');
  };

  // Move left
  const handleMoveLeft = (index) => {
    if (index <= 0) return;
    const copy = [...normalizedImages];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    updateImages(copy);
  };

  // Move right
  const handleMoveRight = (index) => {
    if (index >= normalizedImages.length - 1) return;
    const copy = [...normalizedImages];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    updateImages(copy);
  };

  // Delete image
  const handleRemove = (index) => {
    updateImages(normalizedImages.filter((_, i) => i !== index));
    toast.success('Image removed');
  };

  return (
    <div className="space-y-4">
      {/* Header with info and quick actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <span>Product Photos</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-semibold">
              {normalizedImages.length} {normalizedImages.length === 1 ? 'photo' : 'photos'}
            </span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            The first photo is the <strong>Main Thumbnail</strong> shown on cards. You can reorder or click &ldquo;Set as Main&rdquo;.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Pick from Store Gallery Button */}
          <button
            type="button"
            onClick={() => setShowGalleryModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors shadow-xs"
          >
            <HiOutlinePhotograph className="w-4 h-4 text-amber-600" />
            Pick from Store Gallery
          </button>

          {/* Paste URL Button */}
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors shadow-xs"
          >
            <HiOutlineLink className="w-4 h-4 text-gray-500" />
            Add URL
          </button>
        </div>
      </div>

      {/* URL Input Bar (Collapsible) */}
      <AnimatePresence>
        {showUrlInput && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddUrl}
            className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200"
          >
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste image URL (e.g. /images/products/img_3404.webp or https://...)"
              className="flex-1 px-3 py-2 text-xs bg-white rounded-lg border border-gray-300 focus:outline-hidden focus:border-pink-500"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <HiOutlineX className="w-4 h-4" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Image Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {normalizedImages.map((img, idx) => {
          const isPrimary = idx === 0;
          return (
            <motion.div
              layout
              key={img.secure_url || idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`group relative rounded-2xl overflow-hidden border-2 bg-gray-50 transition-all ${
                isPrimary
                  ? 'border-amber-400 shadow-md ring-2 ring-amber-400/20'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              {/* Image Preview */}
              <div className="aspect-square w-full relative overflow-hidden bg-white">
                <img
                  src={img.secure_url}
                  alt={`Product view ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/images/products/img_3404.webp';
                  }}
                />

                {/* Primary / Thumbnail Badge */}
                {isPrimary ? (
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-md tracking-wider uppercase">
                    <HiStar className="w-3 h-3" />
                    Main Thumbnail
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    title="Set as Main Thumbnail"
                    className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 hover:bg-amber-600 text-white text-[10px] font-semibold backdrop-blur-xs shadow-md"
                  >
                    <HiOutlineStar className="w-3 h-3" />
                    Make Main
                  </button>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  title="Remove image"
                  className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
                >
                  <HiOutlineTrash className="w-3.5 h-3.5" />
                </button>

                {/* Bottom Overlay Controls (Reordering) */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 pt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-white/80 font-medium">#{idx + 1}</span>

                  <div className="flex items-center gap-1">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMoveLeft(idx)}
                        title="Move left"
                        className="w-6 h-6 rounded-md bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                      >
                        <HiOutlineArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {idx < normalizedImages.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMoveRight(idx)}
                        title="Move right"
                        className="w-6 h-6 rounded-md bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                      >
                        <HiOutlineArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Upload Button Tile */}
        <label
          className={`aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-pink-500 bg-gray-50/60 hover:bg-pink-50/30 flex flex-col items-center justify-center cursor-pointer transition-all p-4 text-center group ${
            uploading ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-6 w-6 text-pink-600 mb-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-[11px] font-semibold text-gray-500">Uploading...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <HiOutlinePlus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-800">Upload Photo</span>
              <span className="text-[10px] text-gray-400 mt-0.5">Device or Phone</span>
            </>
          )}
        </label>
      </div>

      {/* Store Gallery Modal */}
      <AnimatePresence>
        {showGalleryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-gray-100"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#FFF5F7] to-white">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <span>Store Jewellery Photo Gallery</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-semibold">
                      {STORE_LIBRARY_IMAGES.length} Available Photos
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Click any photo to attach or detach it from this product.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGalleryModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                >
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>

              {/* Photos Grid */}
              <div className="p-5 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {STORE_LIBRARY_IMAGES.map((item) => {
                  const isSelected = normalizedImages.some((img) => img.secure_url === item.url);
                  return (
                    <div
                      key={item.url}
                      onClick={() => handleToggleLibraryImage(item.url)}
                      className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-pink-600 shadow-md ring-2 ring-pink-500/20'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <div className="aspect-square bg-gray-50">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-md">
                          <HiOutlineCheck className="w-4 h-4 stroke-2" />
                        </div>
                      )}

                      <div className="p-2 bg-white border-t border-gray-100">
                        <p className="text-[11px] font-semibold text-gray-800 truncate">{item.name}</p>
                        <p className="text-[9px] text-gray-400 truncate">{item.url}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {normalizedImages.length} total image(s) selected for this product
                </span>
                <button
                  type="button"
                  onClick={() => setShowGalleryModal(false)}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-gray-900 hover:bg-black text-white transition-colors shadow-xs"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
