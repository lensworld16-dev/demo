import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineSave, 
  HiOutlineTrash, 
  HiOutlinePencil, 
  HiOutlineStar, 
  HiOutlinePlus,
  HiOutlineCloudUpload,
  HiOutlineEye,
  HiOutlineDeviceMobile,
  HiOutlineDesktopComputer,
  HiOutlineSparkles
} from 'react-icons/hi';
import { productAPI, settingAPI, imageAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/helpers';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const defaultHeroSlides = [
  {
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=2000",
    tagline: "ANTI-TARNISH & WATERPROOF",
    titlePart1: "Timeless",
    titlePart2: "Elegance",
    cta: "Shop Jewelry",
    link: "/shop",
    align: "center"
  },
  {
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2000",
    tagline: "18K GOLD PLATED",
    titlePart1: "Bold &",
    titlePart2: "Sophisticated",
    cta: "Best Sellers",
    link: "/shop",
    align: "left"
  },
  {
    image: "https://images.unsplash.com/photo-1611085583191-a3b1ae84fd9b?auto=format&fit=crop&q=80&w=2000",
    tagline: "LUXURY ESSENTIALS",
    titlePart1: "Adorn",
    titlePart2: "Yourself",
    cta: "Summer Collection",
    link: "/shop",
    align: "right"
  }
];

export default function AdminHomePage() {
  const [loading, setLoading] = useState(true);
  const [bestSellers, setBestSellers] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [heroSlides, setHeroSlides] = useState(defaultHeroSlides);
  const [expertlyCrafted, setExpertlyCrafted] = useState({
    title: "",
    subtitle: "",
    description: ""
  });

  const [editingSlideIndex, setEditingSlideIndex] = useState(null);
  const [slideForm, setSlideForm] = useState({
    image: "",
    tagline: "",
    titlePart1: "",
    titlePart2: "",
    cta: "",
    link: "/shop",
    align: "center",
    textColor: "light",
    // New Studio Controls
    titleSize: 80,
    taglineSize: 14,
    customTextColor: "#ffffff",
    buttonBg: "#ffffff",
    buttonText: "#000000",
    top: 50, // Top %
    left: 50  // Left %
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [bestSellersData, heroData, craftData] = await Promise.all([
          productAPI.getAll({ bestseller: true, limit: 20 }),
          settingAPI.get('hero_slides'),
          settingAPI.get('expertly_crafted')
        ]);
        
        const ensureArray = (val) => {
          if (!val) return [];
          if (Array.isArray(val)) return val;
          try {
            const parsed = typeof val === 'string' ? JSON.parse(val) : val;
            return Array.isArray(parsed) ? parsed : (parsed.value || []);
          } catch { return []; }
        };
        
        setBestSellers(bestSellersData.products || []);
        
        const slides = ensureArray(heroData?.settings);
        if (slides.length > 0) {
          setHeroSlides(slides);
        }
        
        if (craftData?.settings) {
          const rawCraft = craftData.settings;
          try {
            const parsedCraft = typeof rawCraft === 'string' ? JSON.parse(rawCraft) : rawCraft;
            setExpertlyCrafted(prev => ({ ...prev, ...(parsedCraft.value || parsedCraft) }));
          } catch {
            setExpertlyCrafted(prev => ({ ...prev, ...(rawCraft.value || rawCraft) }));
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load homepage data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const saveHeroSlides = async (slides) => {
    try {
      await settingAPI.update('hero_slides', slides);
      toast.success("Hero sequence updated!");
    } catch (err) {
      toast.error("Failed to save sequence");
    }
  };

  const saveExpertlyCrafted = async () => {
    try {
      await settingAPI.update('expertly_crafted', expertlyCrafted);
      toast.success("Curation module updated!");
    } catch (err) {
      toast.error("Process failed");
    }
  };

  const handleSlideFormChange = (e) => {
    const { name, value, type } = e.target;
    setSlideForm(prev => ({ 
      ...prev, 
      [name]: type === 'range' ? parseFloat(value) : value 
    }));
  };

  const addOrUpdateSlide = () => {
    if (!slideForm.image) {
      return toast.error("Visual backdrop is mandatory");
    }

    let newSlides;
    if (editingSlideIndex !== null) {
      newSlides = [...heroSlides];
      newSlides[editingSlideIndex] = slideForm;
      setEditingSlideIndex(null);
    } else {
      newSlides = [...heroSlides, slideForm];
    }

    setHeroSlides(newSlides);
    saveHeroSlides(newSlides);
    setSlideForm({ 
      image: "", tagline: "", titlePart1: "", titlePart2: "", cta: "", link: "/shop", align: "center", textColor: "light",
      titleSize: 80, taglineSize: 14, customTextColor: "#ffffff", buttonBg: "#ffffff", buttonText: "#000000", top: 50, left: 50
    });
  };

  const deleteSlide = async (index) => {
    if (!window.confirm("Purge this visual fragment from the sequence?")) return;
    
    const slideToDelete = heroSlides[index];
    const newSlides = heroSlides.filter((_, i) => i !== index);
    
    setHeroSlides(newSlides);
    await saveHeroSlides(newSlides);

    // After saving, try to purge from Cloudinary if publicId exists
    if (slideToDelete?.publicId) {
      try {
        await imageAPI.purgeByPublicId(slideToDelete.publicId);
      } catch (err) {
        console.error("Purge failed:", err);
      }
    }
  };

  const editSlide = (index) => {
    setSlideForm(heroSlides[index]);
    setEditingSlideIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const data = await imageAPI.upload(file, 'arnika/homepage');
      setSlideForm(prev => ({ 
        ...prev, 
        image: data.image.secure_url,
        publicId: data.image.public_id 
      }));
      toast.success('Visual fragment uploaded');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeFromBestSeller = async (id) => {
    try {
      if (!window.confirm("Discharge from Elite Pool?")) return;
      await productAPI.update(id, { is_bestseller: false });
      setBestSellers(prev => prev.filter(p => p.id !== id));
      toast.success("Asset discharged");
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  if (loading) return (
    <div className="p-20 text-center space-y-4">
      <div className="w-12 h-12 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin mx-auto" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Calibrating Core Modules...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 px-4 sm:px-0">
      {/* Header Infographic */}
      <div className="bg-gray-900 rounded-[3rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl shadow-gray-900/40">
         <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-emerald-400 border border-white/10">Engine Active</span>
                 <HiOutlineSparkles className="text-amber-400 w-5 h-5 animate-pulse" />
               </div>
               <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none uppercase">Central Home<br/><span className="text-white/40">Nexus Control</span></h1>
               <p className="text-white/50 text-xs font-medium max-w-md uppercase tracking-wider leading-relaxed">Modify the visual choreography of your main storefront. Manage sequence slides, curation narratives, and elite assets.</p>
            </div>
            <div className="flex gap-4">
               <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] text-center min-w-[120px]">
                  <p className="text-[8px] font-black text-white/40 uppercase mb-1">Active Slides</p>
                  <p className="text-4xl font-black">{heroSlides.length}</p>
               </div>
               <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] text-center min-w-[120px]">
                  <p className="text-[8px] font-black text-white/40 uppercase mb-1">Elite units</p>
                  <p className="text-4xl font-black">{bestSellers.length}</p>
               </div>
            </div>
         </div>
      </div>

      {/* Hero Engine */}
      <section className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-500/5 overflow-hidden">
        <div className="p-8 sm:p-12 border-b border-gray-50 flex items-center justify-between">
           <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Hero Sequence Engine</h2>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configure multi-dimensional storefront visuals</p>
           </div>
           <HiOutlineDesktopComputer className="w-8 h-8 text-gray-100" />
        </div>

        <div className="p-8 sm:p-12 bg-gray-50/50">
           {/* Form Module */}
           <motion.div 
             layout
             className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm mb-12"
           >
              <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-gray-900 flex items-center justify-center text-white">
                  {editingSlideIndex !== null ? <HiOutlinePencil className="w-3.5 h-3.5" /> : <HiOutlinePlus className="w-3.5 h-3.5" />}
                </div>
                {editingSlideIndex !== null ? 'Modify Sequence Fragment' : 'Initialize New Fragment'}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Fragment Tagline</label>
                          <input 
                            name="tagline" 
                            value={slideForm.tagline} 
                            onChange={handleSlideFormChange}
                            placeholder="e.g. 18K GOLD PLATED"
                            className="w-full px-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-gray-900 rounded-2xl transition-all text-xs font-bold uppercase tracking-widest outline-none"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Text Alignment</label>
                          <div className="flex bg-gray-50 rounded-2xl p-1 gap-1">
                            {['left', 'center', 'right'].map((a) => (
                              <button
                                key={a}
                                onClick={() => setSlideForm(prev => ({ ...prev, align: a }))}
                                className={cn(
                                  "flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all",
                                  slideForm.align === a ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                )}
                              >
                                {a}
                              </button>
                            ))}
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Color Preset</label>
                          <select 
                            name="textColor" 
                            value={slideForm.textColor || 'light'} 
                            onChange={handleSlideFormChange}
                            className="w-full px-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-gray-900 rounded-2xl transition-all text-xs font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer"
                          >
                            <option value="light">Light Mode (Default)</option>
                            <option value="dark">Dark Mode (Default)</option>
                            <option value="custom">Custom RGB Studio</option>
                          </select>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Title (Light)</label>
                          <input 
                            name="titlePart1" 
                            value={slideForm.titlePart1} 
                            onChange={handleSlideFormChange}
                            placeholder="e.g. Timeless"
                            className="w-full px-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-gray-900 rounded-2xl transition-all text-xs font-medium outline-none"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Emphasis Title (Bold)</label>
                          <input 
                            name="titlePart2" 
                            value={slideForm.titlePart2} 
                            onChange={handleSlideFormChange}
                            placeholder="e.g. Elegance"
                            className="w-full px-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-gray-900 rounded-2xl transition-all text-xs font-black uppercase outline-none"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Action Button Text</label>
                          <input 
                            name="cta" 
                            value={slideForm.cta} 
                            onChange={handleSlideFormChange}
                            placeholder="e.g. Shop Collection"
                            className="w-full px-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-gray-900 rounded-2xl transition-all text-xs font-black uppercase tracking-widest outline-none"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Nexus Link</label>
                          <input 
                            name="link" 
                            value={slideForm.link} 
                            onChange={handleSlideFormChange}
                            placeholder="/shop"
                            className="w-full px-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-gray-900 rounded-2xl transition-all text-xs font-medium outline-none"
                          />
                       </div>
                    </div>

                    {/* Studio Advanced Controls */}
                    <AnimatePresence>
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-gray-950 rounded-[2rem] p-6 space-y-8"
                      >
                         <h4 className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em] flex items-center gap-2">
                           Visual Studio Engine <div className="h-px flex-1 bg-white/10" />
                         </h4>
                         
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                               <div className="flex justify-between">
                                  <label className="text-[8px] font-black text-white/60 uppercase tracking-widest">Title Size</label>
                                  <span className="text-[8px] font-mono text-emerald-400">{slideForm.titleSize}px</span>
                               </div>
                               <input type="range" name="titleSize" min="20" max="150" value={slideForm.titleSize} onChange={handleSlideFormChange} className="w-full accent-white" />
                            </div>
                            <div className="space-y-3">
                               <div className="flex justify-between">
                                  <label className="text-[8px] font-black text-white/60 uppercase tracking-widest">Tagline Size</label>
                                  <span className="text-[8px] font-mono text-emerald-400">{slideForm.taglineSize}px</span>
                               </div>
                               <input type="range" name="taglineSize" min="8" max="40" value={slideForm.taglineSize} onChange={handleSlideFormChange} className="w-full accent-white" />
                            </div>
                         </div>

                         <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                               <label className="text-[8px] font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
                                 Text RGB <div className="w-2 h-2 rounded-full" style={{ background: slideForm.customTextColor }} />
                               </label>
                               <input type="color" name="customTextColor" value={slideForm.customTextColor} onChange={handleSlideFormChange} className="w-full h-10 bg-white/5 border-none rounded-lg cursor-pointer" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[8px] font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
                                 Btn Bg <div className="w-2 h-2 rounded-full" style={{ background: slideForm.buttonBg }} />
                               </label>
                               <input type="color" name="buttonBg" value={slideForm.buttonBg} onChange={handleSlideFormChange} className="w-full h-10 bg-white/5 border-none rounded-lg cursor-pointer" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[8px] font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
                                 Btn Text <div className="w-2 h-2 rounded-full" style={{ background: slideForm.buttonText }} />
                               </label>
                               <input type="color" name="buttonText" value={slideForm.buttonText} onChange={handleSlideFormChange} className="w-full h-10 bg-white/5 border-none rounded-lg cursor-pointer" />
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                               <div className="flex justify-between">
                                  <label className="text-[8px] font-black text-white/60 uppercase tracking-widest">Vertical Position (Top %)</label>
                                  <span className="text-[8px] font-mono text-amber-400">{slideForm.top}%</span>
                               </div>
                               <input type="range" name="top" min="0" max="100" step="1" value={slideForm.top} onChange={handleSlideFormChange} className="w-full accent-amber-400" />
                            </div>
                            <div className="space-y-3">
                               <div className="flex justify-between">
                                  <label className="text-[8px] font-black text-white/60 uppercase tracking-widest">Horizontal Position (Left %)</label>
                                  <span className="text-[8px] font-mono text-amber-400">{slideForm.left}%</span>
                               </div>
                               <input type="range" name="left" min="0" max="100" step="1" value={slideForm.left} onChange={handleSlideFormChange} className="w-full accent-amber-400" />
                            </div>
                         </div>
                      </motion.div>
                    </AnimatePresence>
                 </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex justify-between">
                      Visual Backdrop & Dynamic Preview
                      <span className="text-[8px] font-black text-emerald-500 animate-pulse">Live Tracking Active</span>
                    </label>
                    <div className="group relative aspect-video rounded-[2.5rem] overflow-hidden bg-gray-900 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center transition-all hover:border-gray-900 shadow-2xl">
                       {slideForm.image ? (
                         <>
                           <img src={slideForm.image} alt="Preview" className="w-full h-full object-cover opacity-60" />
                           
                           <div className="absolute inset-0 pointer-events-none">
                              <div 
                                className="absolute flex flex-col gap-2 w-full transition-all duration-300"
                                style={{ 
                                  top: `${slideForm.top}%`,
                                  left: `${slideForm.left}%`,
                                  transform: 'translate(-50%, -50%)', // Anchor to center of text box
                                  alignItems: slideForm.align === 'center' ? 'center' : slideForm.align === 'right' ? 'flex-end' : 'flex-start',
                                  textAlign: slideForm.align,
                                  width: 'fit-content',
                                  padding: '1rem'
                                }}
                              >
                                 {slideForm.tagline && (
                                   <div className="flex items-center gap-2" style={{ color: slideForm.textColor === 'custom' ? slideForm.customTextColor : (slideForm.textColor === 'dark' ? '#000000' : '#ffffff') }}>
                                      <div className="h-px w-4 bg-current opacity-40" />
                                      <span className="font-bold uppercase tracking-widest" style={{ fontSize: `${slideForm.taglineSize / 2}px` }}>{slideForm.tagline}</span>
                                      <div className="h-px w-4 bg-current opacity-40" />
                                   </div>
                                 )}
                                 <h4 className="font-black uppercase leading-tight" style={{ 
                                   fontSize: `${slideForm.titleSize / 2}px`,
                                   color: slideForm.textColor === 'custom' ? slideForm.customTextColor : (slideForm.textColor === 'dark' ? '#000000' : '#ffffff') 
                                 }}>
                                   {slideForm.titlePart1} {slideForm.titlePart2}
                                 </h4>
                                 {slideForm.cta && (
                                   <div 
                                     className="px-4 py-2 mt-2 rounded-[4px] text-[8px] font-black uppercase tracking-widest shadow-lg"
                                     style={{ 
                                       background: slideForm.textColor === 'custom' ? slideForm.buttonBg : (slideForm.textColor === 'dark' ? '#000000' : '#ffffff'),
                                       color: slideForm.textColor === 'custom' ? slideForm.buttonText : (slideForm.textColor === 'dark' ? '#ffffff' : '#000000')
                                     }}
                                   >
                                     {slideForm.cta}
                                   </div>
                                 )}
                              </div>
                           </div>

                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 pointer-events-auto">
                              <label className="bg-white text-gray-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-xl active:scale-95 transition-transform translate-y-2 group-hover:translate-y-0 duration-300">
                                Update Visual
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                              </label>
                           </div>
                         </>
                       ) : (
                         <label className="flex flex-col items-center gap-4 cursor-pointer p-10 text-center pointer-events-auto">
                            <div className="w-16 h-16 rounded-3xl bg-gray-900 text-white flex items-center justify-center shadow-lg shadow-gray-900/20">
                               <HiOutlineCloudUpload className="w-8 h-8" />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-1">
                                 {uploadingImage ? 'Synching Files...' : 'Inject Visual Data'}
                               </p>
                               <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">Minimalism: 2000x1200 recommended</p>
                            </div>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                         </label>
                       )}
                    </div>
                 </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-4 pt-10 border-t border-gray-50">
                 <button 
                   onClick={addOrUpdateSlide}
                   className="flex-1 bg-gray-900 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-gray-900/20 hover:bg-black transition-all active:scale-[0.98]"
                 >
                   {editingSlideIndex !== null ? 'EXECUTE RE-CALIBRATION' : 'LAUNCH NEW SEQUENCE'}
                 </button>
                 {editingSlideIndex !== null && (
                   <button 
                     onClick={() => {
                        setEditingSlideIndex(null);
                        setSlideForm({ image: "", tagline: "", titlePart1: "", titlePart2: "", cta: "", link: "/shop", align: "center" });
                     }}
                     className="px-10 bg-white border border-gray-100 text-gray-400 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-gray-900 transition-all active:scale-95"
                   >
                     ABORT
                   </button>
                 )}
              </div>
           </motion.div>

           {/* List Module */}
           <div>
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Active Sequence Sequence</h3>
                 <span className="text-[10px] font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{heroSlides.length} UNIT(S)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {heroSlides.map((slide, index) => (
                    <motion.div
                      key={`${index}-${slide.titlePart1}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all p-4"
                    >
                       <div className="relative aspect-video rounded-[2rem] overflow-hidden mb-6 bg-gray-100">
                          <img src={slide.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                             <button 
                               onClick={() => editSlide(index)}
                               className="p-3 bg-white/95 backdrop-blur-md text-gray-900 rounded-2xl shadow-xl hover:bg-white active:scale-90"
                             >
                                <HiOutlinePencil className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => deleteSlide(index)}
                               className="p-3 bg-red-500 text-white rounded-2xl shadow-xl hover:bg-red-600 active:scale-90"
                             >
                                <HiOutlineTrash className="w-4 h-4" />
                             </button>
                          </div>
                          <div className="absolute bottom-4 left-4">
                             <span className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-xl text-[8px] font-black text-white uppercase tracking-widest">
                               {slide.align} Aligned
                             </span>
                          </div>
                       </div>
                       <div className="px-3 pb-2">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{slide.tagline || 'NO TAGLINE'}</p>
                          <h4 className="text-sm font-black text-gray-900 tracking-tight leading-tight uppercase truncate">
                            {slide.titlePart1} <span className="text-gray-300">{slide.titlePart2}</span>
                          </h4>
                       </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {heroSlides.length === 0 && (
                  <div className="col-span-full py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
                     <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                        <HiOutlineStar className="w-10 h-10 text-gray-200" />
                     </div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Zero Fragments Loaded. Start the Engine.</p>
                  </div>
                )}
              </div>
           </div>
        </div>
      </section>

      {/* Curation Module */}
      <section className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-500/5 overflow-hidden">
         <div className="p-8 sm:p-12 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
               <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Curation Module</h2>
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Narrative storytelling control</p>
            </div>
            <button 
              onClick={saveExpertlyCrafted}
              className="px-10 py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-xl shadow-gray-900/20 hover:bg-black active:scale-95 transition-all"
            >
              <HiOutlineSave className="w-4 h-4" /> COMMIT CONFIGURATION
            </button>
         </div>

         <div className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Contextual Subtitle</label>
                  <input 
                    value={expertlyCrafted.subtitle}
                    onChange={(e) => setExpertlyCrafted({...expertlyCrafted, subtitle: e.target.value})}
                    placeholder="e.g. Expertly Crafted"
                    className="w-full px-8 py-5 bg-gray-50 border-transparent rounded-[2rem] focus:bg-white focus:border-gray-900 outline-none text-xs font-bold uppercase tracking-widest transition-all"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Main Narrative Title</label>
                  <input 
                    value={expertlyCrafted.title}
                    onChange={(e) => setExpertlyCrafted({...expertlyCrafted, title: e.target.value})}
                    placeholder="e.g. THE ART OF ADORNMENT"
                    className="w-full px-8 py-5 bg-gray-50 border-transparent rounded-[2rem] focus:bg-white focus:border-gray-900 outline-none text-xs font-black uppercase tracking-tight transition-all"
                  />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Brand Lore / Description</label>
               <textarea 
                 rows={6}
                 value={expertlyCrafted.description}
                 onChange={(e) => setExpertlyCrafted({...expertlyCrafted, description: e.target.value})}
                 placeholder="Tell your story..."
                 className="w-full px-8 py-6 bg-gray-50 border-transparent rounded-[2.5rem] focus:bg-white focus:border-gray-900 outline-none text-xs font-medium leading-relaxed resize-none transition-all h-full"
               />
            </div>
         </div>
      </section>

      {/* Elite Pool */}
      <section className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-500/5 overflow-hidden">
         <div className="p-8 sm:p-12 border-b border-gray-50 flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Elite Best Sellers</h2>
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage top-performing curated assets</p>
            </div>
            <HiOutlineStar className="w-8 h-8 text-amber-400" />
         </div>

         <div className="p-8 sm:p-12">
            {bestSellers.length === 0 ? (
              <div className="py-20 text-center space-y-6">
                 <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mx-auto">
                    <HiOutlineSparkles className="w-10 h-10" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">No assets currently prioritized.</p>
                    <Link to="/admin/products" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-900/10">
                       Source Inventory Nexus <HiArrowRight className="w-3 h-3" />
                    </Link>
                 </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                 {bestSellers.map((item) => (
                   <div key={item.id} className="group relative bg-gray-50 rounded-[2.5rem] p-3 border border-transparent hover:border-gray-200 hover:bg-white transition-all shadow-sm hover:shadow-xl hover:shadow-gray-200/50">
                      <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-4">
                         <img src={item.thumbnail} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                         <div className="absolute top-2 right-2">
                            <button 
                              onClick={() => removeFromBestSeller(item.id)}
                              className="p-2.5 bg-red-500 text-white rounded-2xl shadow-xl hover:bg-red-600 active:scale-90 opacity-0 group-hover:opacity-100 transition-all font-bold"
                            >
                               <HiOutlineTrash className="w-3.5 h-3.5" />
                            </button>
                         </div>
                      </div>
                      <div className="px-2 pb-2">
                         <h5 className="text-[10px] font-bold text-gray-900 truncate mb-1 uppercase tracking-tight">{item.name}</h5>
                         <div className="flex items-center justify-between">
                            <span className="text-[8px] font-bold text-[#C5A059] uppercase tracking-widest">{item.category}</span>
                            <span className="text-[9px] font-black text-gray-900">{formatPrice(item.price)}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
            )}
         </div>
      </section>
    </div>
  );
}

const HiArrowRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);
