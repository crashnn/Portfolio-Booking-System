import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Gift, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OrbitProgress } from 'react-loading-indicators';
import API_URL from '../api';

const Services = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback mock packages for when API is not available
  const mockPackages = [
    { _id: '1', title: "Başlangıç", price: "7.500 ₺", description: "Giriş seviyesi.", features: ["Özellik 1", "Hızlı Kurgu"], isPopular: false },
    { _id: '2', title: "Profesyonel", price: "15.000 ₺", description: "İleri seviye.", features: ["Özellik 1", "Özellik 2", "Color Grading", "Özel Müzik"], isPopular: true },
    { _id: '3', title: "Premium", price: "25.000 ₺", description: "Her şey dahil.", features: ["Hepsi", "VFX Effects", "4K Render", "Sınırsız Revizyon"], isPopular: false }
  ];

  useEffect(() => {
    fetch(`${API_URL}/api/packages`)
      .then(res => {
        if (!res.ok) throw new Error('API responded with error');
        return res.json();
      })
      .then(data => {
        setPackages(Array.isArray(data) && data.length > 0 ? data : mockPackages);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Packages API failed, using mock data:", err);
        setPackages(mockPackages);
        setLoading(false);
      });
  }, []);


  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <OrbitProgress color="#6D28D9" variant="track-disc" speedPlus="0" easing="ease-in-out" />
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-4 bg-light min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-dark mb-4">Hizmet Paketleri</h1>
          <p className="text-gray-500">İhtiyacınıza en uygun video çözümünü seçin.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {packages.map((pkg) => (
            <React.Fragment key={pkg._id}>
              
              {/* --- POPÜLER PAKET (HEDİYE KUTUSU) --- */}
              {pkg.isPopular ? (
                <motion.div 
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  className="group relative h-[500px] perspective-1000 cursor-pointer"
                >
                  {/* KAPAK (DÜZELTİLDİ: group-hover:pointer-events-none EKLENDİ) */}
                  {/* Bu sayede kapak görünmez olunca tıklamalar arkaya geçebilecek */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-900 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-white transition-all duration-700 ease-in-out group-hover:translate-y-[200px] group-hover:opacity-0 group-hover:pointer-events-none z-20 overflow-hidden">
                     <Gift size={80} className="mb-6 animate-bounce" />
                     <h3 className="text-3xl font-bold text-center px-4 uppercase">{pkg.title}</h3>
                     <p className="mt-4 text-purple-200 text-sm">İçini görmek için üzerine gel!</p>
                     <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* İÇERİK (DÜZELTİLDİ: group-hover:z-30 EKLENDİ) */}
                  {/* Hover olunca bu katman en öne çıkacak */}
                  <div className="absolute inset-0 bg-white rounded-2xl shadow-[0_0_50px_rgba(109,40,217,0.4)] border-2 border-primary overflow-hidden flex flex-col p-8 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:z-30 transition-all duration-500 delay-100 z-10">
                     <div className="absolute top-0 right-0 p-4">
                         <Star className="text-yellow-400 fill-yellow-400 w-8 h-8 animate-spin-slow" />
                     </div>
                     
                     <h3 className="text-2xl font-bold text-primary mb-1">{pkg.title}</h3>
                     <p className="text-xs text-gray-400 mb-4">{pkg.description}</p>
                     <div className="text-4xl font-bold text-dark mb-6">{pkg.price}</div>
                     
                     <ul className="space-y-2 text-sm text-gray-700 mb-auto overflow-y-auto max-h-[150px] custom-scrollbar">
                         {pkg.features.map((feature, idx) => (
                             <li key={idx} className="flex gap-2 items-start">
                                 <span className="bg-green-100 p-1 rounded text-green-600 mt-0.5"><Check size={12}/></span> 
                                 <span className="leading-tight">{feature}</span>
                             </li>
                         ))}
                     </ul>

                     <Link 
                        to="/booking" 
                        state={{ selectedPackage: pkg.title }} 
                        className="mt-4 w-full py-3 bg-gradient-to-r from-primary to-purple-600 text-white text-center rounded-lg font-bold shadow-lg hover:shadow-primary/50 transition block relative z-50"
                     >
                         Paketi Seç
                     </Link>
                  </div>
                </motion.div>

              ) : (
                
                /* --- STANDART PAKET --- */
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 transition-all hover:-translate-y-2 h-fit min-h-[420px] flex flex-col">
                  <h3 className="text-xl font-bold text-gray-500">{pkg.title}</h3>
                  <div className="text-4xl font-bold text-dark my-4">{pkg.price}</div>
                  <p className="text-sm text-gray-400 mb-6">{pkg.description}</p>
                  
                  <ul className="space-y-3 mb-8 text-gray-600 flex-1">
                    {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                            <Check size={18} className="text-primary mt-1 min-w-[18px]"/> 
                            <span className="text-sm">{feature}</span>
                        </li>
                    ))}
                  </ul>
                  
                  {/* Buton */}
                  <Link 
                    to="/booking" 
                    state={{ selectedPackage: pkg.title }} 
                    className="block w-full py-3 border border-dark text-dark text-center rounded-lg font-bold hover:bg-dark hover:text-white transition"
                  >
                      Paketi Seç
                  </Link>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;