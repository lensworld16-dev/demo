import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userAPI } from '../../services/api';
import { HiOutlineUser, HiOutlineMail, HiOutlineCalendar, HiOutlineShieldCheck, HiOutlineUserCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await userAPI.getAll();
        setUsers(data.users || []);
      } catch (err) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 bg-gray-100 rounded animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 w-full bg-white rounded-2xl border border-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
         <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-500 mt-1">Manage your registered user base</p>
         </div>
         <span className="px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-full uppercase tracking-widest">
            {users.length} Total Users
         </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-50">
                {user.photo_url ? (
                  <img src={user.photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <HiOutlineUserCircle className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900">{user.display_name || 'Anonymous User'}</p>
                  {user.role === 'admin' && (
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-full border border-indigo-100">Admin</span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <HiOutlineMail className="w-3.5 h-3.5" /> {user.email}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium tracking-tight">
                    <HiOutlineCalendar className="w-3.5 h-3.5" /> Joined {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               <button className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-50 rounded-full transition-colors">
                  View Orders
               </button>
               {user.role !== 'admin' && (
                 <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" title="Make Admin">
                    <HiOutlineShieldCheck className="w-5 h-5" />
                 </button>
               )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
