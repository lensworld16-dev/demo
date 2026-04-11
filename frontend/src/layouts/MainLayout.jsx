import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/layout/ScrollToTop';

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 }
};

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <motion.main
        className="flex-1 pt-28 sm:pt-32 pb-20"
        {...pageTransition}
      >
        <div className="min-h-[60vh] flex flex-col">
          <Outlet />
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}
