import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sayfa değişince menüyü kapat
  useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0); // Sayfa değişince en üste at
  }, [location]);

  // Menü açıkken arkaplanı kilitle (Scroll yapılamasın)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const isHome = location.pathname === '/';
  const isSolid = !isHome || scrolled || isOpen;
  
  const textColor = isSolid ? 'text-dark' : 'text-white';
  const hoverColor = isSolid ? 'hover:text-primary' : 'hover:text-gray-200';
  const activeClass = "font-bold border-b-2 border-primary";

  const navLinks = [
    { path: '/', label: 'ANA SAYFA' },
    { path: '/portfolio', label: 'PORTFOLYO' },
    { path: '/services', label: 'PAKETLER' },
    { path: '/booking', label: 'KİRALAMA' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isSolid ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className={`text-2xl font-bold tracking-tighter flex items-center gap-1 z-50 relative ${textColor}`}>
            BUĞRA<span className={!isSolid ? 'text-white' : 'text-primary'}>ŞENGÜL</span>
            <div className="w-2 h-2 rounded-full bg-primary mt-3"></div>
          </Link>
          {/* MASAÜSTÜ MENÜ */}
          <div className={`hidden md:flex items-center space-x-8 font-semibold text-sm tracking-wide ${textColor}`}>
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`${location.pathname === link.path ? activeClass : ''} ${hoverColor} transition-colors`}>
                {link.label}
              </Link>
            ))}
            <Link to="/contact" className={`px-6 py-2.5 rounded-full font-semibold transition-all hover:scale-105 ${!isSolid ? 'bg-white text-dark hover:bg-gray-200' : 'bg-dark text-white hover:bg-primary'}`}>
              İLETİŞİM
            </Link>
          </div>

          {/* MOBİL MENÜ BUTONU */}
          <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden z-50 p-2 ${textColor} transition-transform active:scale-95`}>
             {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* MOBİL MENÜ OVERLAY */}
      <div className={`fixed inset-0 w-full h-screen bg-white z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         {navLinks.map((link) => (
           <Link key={link.path} to={link.path} className="text-3xl font-black text-dark tracking-tight hover:text-primary transition-colors">
             {link.label}
           </Link>
         ))}
         <Link to="/contact" className="px-10 py-4 bg-dark text-white text-lg rounded-full font-bold shadow-xl hover:bg-primary transition mt-4">
           İLETİŞİM
         </Link>
      </div>
    </>
  );
};

export default Navbar;