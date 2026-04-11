import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlineSparkles } from 'react-icons/hi';
import { FaInstagram, FaTwitter, FaFacebookF, FaPinterestP } from 'react-icons/fa';

const footerLinks = {
  Shop: [
    { label: 'Rings', path: '/shop?category=rings' },
    { label: 'Earrings', path: '/shop?category=earrings' },
    { label: 'Necklaces', path: '/shop?category=necklaces' },
    { label: 'New Arrivals', path: '/shop?sort=newest' },
  ],
  JewelleryCare: [
    { label: 'Care Guide', path: '/care' },
    { label: 'Size Guide', path: '/size-guide' },
    { label: 'Warranty', path: '/warranty' },
  ],
  Support: [
    { label: 'FAQ', path: '/faq' },
    { label: 'Shipping', path: '/shipping' },
    { label: 'Returns', path: '/returns' },
    { label: 'Contact Us', path: '/contact' },
  ],
};

const socialLinks = [
  { icon: FaInstagram, href: 'https://www.instagram.com/sajhnaaofficial/', label: 'Instagram' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaFacebookF, href: '#', label: 'Facebook' },
  { icon: FaPinterestP, href: '#', label: 'Pinterest' },
];

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-gray-400 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Brand Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 lg:col-span-1">
             <Link to="/" className="text-3xl font-bold text-white tracking-[0.2em] mb-6 block uppercase">SAJHNAA</Link>
             <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#C41E3A] mb-6">
                ANTI-TARNISH & DEMI FINE JEWELLERY
             </p>
             <p className="text-sm leading-relaxed mb-8 max-w-xs">
                Exquisite demi-fine jewellery designed for the modern woman. Waterproof, ethically sourced, and crafted to last a lifetime.
             </p>
             <div className="flex items-center gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-8">{category.replace(/([A-Z])/g, ' $1').trim()}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm hover:text-[#C41E3A] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="py-16 border-y border-gray-800/50">
           <div className="flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
              <div className="max-w-md">
                 <h3 className="text-2xl font-light text-white italic mb-2">Join the <span className="font-bold not-italic">Inner Circle</span></h3>
                 <p className="text-sm">Subscribe for early access to collection drops and 10% off your first order.</p>
              </div>
              <form className="flex-1 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
                  <div className="relative flex gap-3">
                     <input
                        type="email"
                        placeholder="your@email.com"
                        className="flex-1 bg-transparent border-b border-gray-700 py-3 text-sm text-white focus:outline-none focus:border-[#C41E3A] transition-colors placeholder:text-gray-600"
                     />
                     <button className="text-[10px] font-bold uppercase tracking-widest text-[#C41E3A] hover:text-white transition-colors">
                        Subscribe
                     </button>
                  </div>
              </form>
           </div>
        </div>

        {/* Legal & Bottom */}
        <div className="py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold tracking-widest uppercase">© 2026 SAJHNAA. Handcrafted in India.</p>
          <div className="flex items-center gap-10">
            <Link to="/privacy" className="text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <div className="flex items-center gap-2">
             <HiOutlineSparkles className="text-[#C41E3A]" />
             <span className="text-[10px] font-bold tracking-widest uppercase text-white">Ethically Sourced</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
