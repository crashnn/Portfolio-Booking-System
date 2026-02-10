import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Tekrar eden link stili için yardımcı bileşen
  const FooterLink = ({ to, children, isExternal = false }) => {
    const commonClass = "group flex items-center justify-center md:justify-start gap-2 hover:text-primary transition-all duration-300 hover:translate-x-2";
    
    if (isExternal) return <a href={to} className={commonClass}>{children}</a>;
    return <Link to={to} onClick={scrollToTop} className={commonClass}>{children}</Link>;
  };

  const Bullet = () => <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>;

  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* IZGARA: Mobilde 1, Tablette 2, Masaüstünde 3 Sütun */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20 text-center md:text-left">

          {/* 1. SÜTUN: MARKA */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <Link to="/" onClick={scrollToTop} className="text-4xl font-bold tracking-tighter group">
              BUĞRA<span className="text-primary group-hover:text-white transition-colors">ŞENGÜL</span>.
            </Link>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm">
              Markanızın hikayesini sinematik bir dille, en yüksek kalitede anlatıyoruz. <br />
              <span className="text-gray-600 text-sm mt-2 block">Prodüksiyon • Kurgu • Görsel Sanatlar</span>
            </p>
          </div>

          {/* 2. SÜTUN: KEŞFET */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-xl mb-8 text-white inline-block border-b-2 border-primary pb-2">Keşfet</h4>
            <ul className="space-y-4 text-base text-gray-300 w-full md:w-auto">
              <li><FooterLink to="/portfolio"><Bullet/> Portfolyo <ArrowUpRight size={16} className="opacity-50 group-hover:opacity-100" /></FooterLink></li>
              <li><FooterLink to="/services"><Bullet/> Hizmetler & Paketler</FooterLink></li>
              <li><FooterLink to="/booking"><Bullet/> Rezervasyon</FooterLink></li>
              <li><FooterLink to="/#faq" isExternal><Bullet/> Sık Sorulan Sorular</FooterLink></li>
              <li><FooterLink to="/contact"><Bullet/> İletişim</FooterLink></li>
            </ul>
          </div>

          {/* 3. SÜTUN: İLETİŞİM */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-xl mb-8 text-white inline-block border-b-2 border-primary pb-2">Bana Ulaşın</h4>
            <ul className="space-y-6 text-base text-gray-300">
              <li>
                <a href="mailto:iletisim@bugrasengul.com" className="group flex items-center justify-center md:justify-start gap-4 hover:text-white transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors"><Mail size={18} /></div>
                  <span>iletisim@bugrasengul.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+905555555555" className="group flex items-center justify-center md:justify-start gap-4 hover:text-white transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors"><Phone size={18} /></div>
                  <span>+90 555 555 55 55</span>
                </a>
              </li>
              <li className="pt-2">
                <a href="https://www.instagram.com/bugraasengull/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-white/10 hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-red-500 hover:to-purple-600 px-6 py-3 rounded-full text-white font-bold transition-all hover:scale-105">
                  <Instagram size={20} />
                  <span>Instagram'da Takip Et</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ALT BİLGİ */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Buğra Şengül. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;