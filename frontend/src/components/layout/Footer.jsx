import { Link } from 'react-router-dom';
import { HiOutlineSparkles } from 'react-icons/hi';
import { FaInstagram, FaTwitter, FaFacebookF, FaPinterestP } from 'react-icons/fa';

const footerLinks = [
  { label: 'Necklaces', path: '/shop?category=necklaces' },
  { label: 'Rings', path: '/shop?category=rings' },
  { label: 'Earrings', path: '/shop?category=earrings' },
  { label: 'Bracelets', path: '/shop?category=bracelets' },
  { label: 'Anklets', path: '/shop?category=anklets' },
  { label: 'Pendants', path: '/shop?category=pendants' },
  { label: 'Care Guide', path: '/care' },
  { label: 'Shipping & FAQ', path: '/shipping' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms', path: '/terms' },
];

const socialLinks = [
  { icon: FaInstagram, href: 'https://www.instagram.com/arnikaofficial/', label: 'Instagram' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaFacebookF, href: '#', label: 'Facebook' },
  { icon: FaPinterestP, href: '#', label: 'Pinterest' },
];

export default function Footer() {
  return (
    <footer className="bg-white text-gray-600 py-6 sm:py-7 border-t border-pink-100 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Compact Row: Brand + Mini Newsletter + Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 border-b border-gray-100 text-center md:text-left">
          <div>
            <Link to="/" className="inline-block">
              <img
                src="/logo/arnika-logo.png"
                alt="ARNIKA"
                className="h-6 sm:h-7 w-auto object-contain mx-auto md:mx-0"
              />
            </Link>
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#DE5D83] mt-1">
              Demi-Fine Anti-Tarnish Jewellery
            </p>
          </div>

          {/* Mini Inline Newsletter */}
          <form className="flex w-full sm:w-auto max-w-xs gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter email for 10% off"
              className="flex-1 min-w-0 bg-gray-50/80 border border-gray-200 rounded-lg px-3 py-1.5 text-[11px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#DE5D83] focus:bg-white transition-colors"
            />
            <button className="px-3.5 py-1.5 bg-[#DE5D83] hover:bg-[#c94d71] text-white text-[9px] font-bold uppercase tracking-widest rounded-lg transition-colors whitespace-nowrap shadow-xs">
              Join
            </button>
          </form>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-gray-500 hover:text-[#DE5D83] transition-colors p-1.5 rounded-full hover:bg-pink-50"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Middle Quick Links Bar */}
        <div className="py-3.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-b border-gray-100 text-[11px]">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="text-gray-600 hover:text-[#DE5D83] font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Bottom Micro Bar */}
        <div className="pt-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-gray-400">
          <p className="tracking-wider uppercase">© 2026 ARNIKA. Handcrafted in India.</p>
          <div className="flex items-center gap-1.5 text-gray-500 font-medium">
            <HiOutlineSparkles className="text-[#DE5D83] w-3 h-3" />
            <span className="tracking-wider uppercase">100% Certified & Hypoallergenic</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
