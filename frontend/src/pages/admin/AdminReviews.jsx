import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineStar, HiOutlineUser, HiOutlineTag, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([
    { id: 1, user: 'Aman Rajbhar', product: 'Eternal Shine Ring', rating: 5, comment: 'Simply stunning! The quality is top-notch.', created_at: '2026-04-10', is_published: true },
    { id: 2, user: 'Priya Sharma', product: 'Gold Hoop Earrings', rating: 4, comment: 'Beautiful design, very fast shipping.', created_at: '2026-04-08', is_published: true },
  ]);
  const [loading, setLoading] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
         <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Reviews</h1>
            <p className="text-gray-500 mt-1">Moderate and view customer feedback</p>
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="text-left px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                <th className="text-left px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating</th>
                <th className="text-left px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Comment</th>
                <th className="text-right px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <HiOutlineUser className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{review.user}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-gray-500">
                      <HiOutlineTag className="w-4 h-4" />
                      <span className="text-xs font-medium">{review.product}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <HiOutlineStar key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-gray-600 line-clamp-2 max-w-sm font-medium leading-relaxed">{review.comment}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                          <HiOutlineCheck className="w-4 h-4" />
                       </button>
                       <button className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                          <HiOutlineX className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {reviews.length === 0 && (
         <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100">
            <p className="text-gray-400 font-medium">No reviews to moderate.</p>
         </div>
      )}
    </motion.div>
  );
}
