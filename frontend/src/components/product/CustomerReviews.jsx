import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiStar, 
  HiOutlineStar, 
  HiCheckCircle, 
  HiOutlinePhotograph, 
  HiX, 
  HiOutlinePlay,
  HiOutlinePlus,
  HiOutlineChatAlt2
} from 'react-icons/hi';
import { getProductReviews, addStoredReview, getProductReviewStats } from '../../data/reviewsData';

export default function CustomerReviews({ product, onStatsUpdate }) {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0 });
  
  // New Review Form State
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const fileInputRef = useRef(null);

  // Load reviews on mount or whenever product changes
  useEffect(() => {
    if (!product?.id) return;
    const prodReviews = getProductReviews(product.id);
    setReviews(prodReviews);

    const calculatedStats = getProductReviewStats(product.id, prodReviews);
    setStats(calculatedStats);

    if (onStatsUpdate) {
      onStatsUpdate(calculatedStats);
    }
  }, [product?.id]);

  // Handle image file selection with instant base64 preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size should be under 5MB.');
      return;
    }

    setFormError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!comment.trim()) {
      setFormError('Please share your thoughts in the review.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    // Randomize aspect ratio for new image so it fits Pinterest masonry aesthetics
    const aspectRatios = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-square', 'aspect-[9/16]'];
    const randomAspect = aspectRatios[Math.floor(Math.random() * aspectRatios.length)];

    const newReview = {
      id: `user-rev-${Date.now()}`,
      author: name.trim(),
      isVerified: true,
      date: formattedDate,
      rating: rating,
      comment: comment.trim(),
      image: imagePreview || null,
      aspectRatio: imagePreview ? randomAspect : '',
    };

    // Save strictly to this product's localStorage
    addStoredReview(product.id, newReview);
    const updatedReviews = getProductReviews(product.id);
    
    setReviews(updatedReviews);

    // Update stats strictly for this product
    const updatedStats = getProductReviewStats(product.id, updatedReviews);
    setStats(updatedStats);
    if (onStatsUpdate) {
      onStatsUpdate(updatedStats);
    }

    setIsSubmitting(false);
    setSubmittedSuccess(true);

    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsModalOpen(false);
      // Reset form
      setName('');
      setRating(5);
      setComment('');
      setImagePreview(null);
    }, 1200);
  };

  return (
    <section id="customer-reviews" className="mt-14 sm:mt-24 pt-10 sm:pt-14 border-t border-pink-100">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-tight mb-2">
            Customer Reviews
          </h2>
          
          {/* Rating Stars and Count */}
          <div className="flex items-center gap-2.5">
            <div className="flex text-amber-400 text-lg">
              {[1, 2, 3, 4, 5].map((star) => (
                <HiStar 
                  key={star} 
                  className={`w-5 h-5 ${stats.totalReviews > 0 && star <= Math.round(stats.averageRating) ? 'fill-current text-amber-400' : 'text-gray-200'}`} 
                />
              ))}
            </div>
            <span className="text-sm sm:text-base font-semibold text-gray-800">
              {stats.totalReviews > 0 ? (
                <>{stats.averageRating} • {stats.totalReviews} {stats.totalReviews === 1 ? 'Review' : 'Reviews'}</>
              ) : (
                <>0 Reviews</>
              )}
            </span>
          </div>
        </div>

        {/* Write a Review Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 hover:border-pink-300 bg-white hover:bg-pink-50/60 text-gray-800 font-semibold text-sm shadow-2xs hover:shadow-xs transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <HiOutlinePlus className="w-4 h-4 text-[#DE5D83]" />
          Write a review
        </button>
      </div>

      {/* Conditional Rendering: Reviews Masonry or Empty State */}
      {reviews.length > 0 ? (
        /* Pinterest-Style Masonry Grid - Exactly 2 Columns on Mobile, 3 on Tablet, 4 on Desktop */
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="break-inside-avoid bg-white rounded-xl sm:rounded-2xl border border-gray-100/90 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Customer Photo with dynamic variable aspect ratio */}
              {rev.image && (
                <div className={`relative w-full ${rev.aspectRatio || 'aspect-[4/5]'} bg-gray-100 overflow-hidden`}>
                  <img
                    src={rev.image}
                    alt={`Review by ${rev.author}`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Optional Video Play Icon overlay if specified */}
                  {rev.hasVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none">
                      <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center shadow-lg">
                        <HiOutlinePlay className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 translate-x-0.5" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Review Content */}
              <div className="p-2.5 sm:p-4 flex flex-col justify-between flex-grow">
                <div>
                  {/* Author & Verified Badge */}
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5">
                    <h4 className="font-bold text-xs sm:text-base text-gray-900 leading-tight truncate">
                      {rev.author}
                    </h4>
                    {rev.isVerified && (
                      <span title="Verified Buyer" className="inline-flex text-gray-900 shrink-0">
                        <HiCheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <p className="text-[9px] sm:text-[11px] text-gray-400 font-medium mb-1.5 sm:mb-2.5">
                    {rev.date}
                  </p>

                  {/* Star Rating */}
                  <div className="flex text-amber-400 text-xs sm:text-sm mb-1.5 sm:mb-2.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <HiStar
                        key={star}
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${star <= rev.rating ? 'fill-current' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>

                  {/* Comment Text */}
                  <p className="text-[11px] sm:text-sm text-gray-700 leading-snug sm:leading-relaxed font-normal">
                    {rev.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State for Products with No Reviews Yet */
        <div className="bg-white/80 backdrop-blur-xs rounded-3xl p-8 sm:p-12 text-center border border-pink-100/80 shadow-xs max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-pink-50 text-[#DE5D83] flex items-center justify-center mx-auto mb-3.5 border border-pink-200/90 shadow-2xs">
            <HiOutlineChatAlt2 className="w-7 h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
            No Customer Reviews Yet
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-5 max-w-xs mx-auto leading-relaxed">
            Be the first verified customer to share your thoughts and photo wearing this piece!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#E05A75] hover:bg-[#D44E6A] text-white font-bold text-xs sm:text-sm shadow-md shadow-pink-200/80 hover:shadow-lg hover:shadow-pink-300 transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Write the First Review
          </button>
        </div>
      )}

      {/* Write Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-100 z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <HiX className="w-5 h-5" />
              </button>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                Write a Customer Review
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-6">
                Share your experience and photo wearing {product?.name || 'this piece'}.
              </p>

              {submittedSuccess ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-pink-50 text-[#DE5D83] rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-200">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    Thank You for Your Review!
                  </h4>
                  <p className="text-xs text-gray-500">
                    Your review has been published with verified status.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Overall Rating *
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <HiStar
                            className={`w-7 h-7 ${(hoverRating || rating) >= star ? 'fill-current' : 'text-gray-200'}`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-semibold text-gray-500 ml-2">
                        {rating} of 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sakshi, Saba, Pooja..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#DE5D83] focus:ring-2 focus:ring-pink-100 outline-none text-sm transition-all"
                      required
                    />
                  </div>

                  {/* Comment Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Your Review *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="How does it look and feel? Would you recommend it?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#DE5D83] focus:ring-2 focus:ring-pink-100 outline-none text-sm transition-all resize-none"
                      required
                    />
                  </div>

                  {/* Photo Upload Section */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Add a Photo (Optional)
                    </label>
                    
                    {imagePreview ? (
                      <div className="relative rounded-2xl overflow-hidden border border-pink-200 w-32 h-32 group">
                        <img
                          src={imagePreview}
                          alt="Review preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImagePreview(null)}
                          className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
                        >
                          <HiX className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-pink-200 hover:border-[#DE5D83] rounded-2xl p-4 text-center cursor-pointer transition-colors bg-pink-50/30 hover:bg-pink-50/60 flex flex-col items-center justify-center gap-1.5"
                      >
                        <HiOutlinePhotograph className="w-8 h-8 text-[#DE5D83]" />
                        <span className="text-xs font-semibold text-gray-700">
                          Upload Photo
                        </span>
                        <span className="text-[10px] text-gray-400">
                          PNG, JPG, or WebP up to 5MB
                        </span>
                      </div>
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Error Alert */}
                  {formError && (
                    <p className="text-xs font-semibold text-rose-500 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                      {formError}
                    </p>
                  )}

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-[#E05A75] hover:bg-[#D44E6A] text-white font-bold text-sm tracking-wide shadow-md shadow-pink-200/80 hover:shadow-lg hover:shadow-pink-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSubmitting ? 'Posting Review...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
