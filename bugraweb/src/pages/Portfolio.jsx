import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { OrbitProgress } from 'react-loading-indicators';
import API_URL from '../api';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
       <OrbitProgress color="#6D28D9" variant="track-disc" speedPlus="0" easing="ease-in-out" />
    </div>
  );

  return (
    <div className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 bg-light min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-dark">Çalışmalar & Projeler</h1>
            <p className="text-gray-500 text-sm md:text-base max-w-2xl">Markalar ve bireyler için ürettiğim görsel hikayeler.</p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center text-gray-400 py-10">Henüz proje yok.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {projects.map((project) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg md:shadow-none bg-white md:bg-transparent"
              >
                <Link to={`/portfolio/${project._id}`} className="block relative">
                  
                  {/* GÖRSEL ALANI */}
                  {/* Mobilde aspect-square (kare) veya 4/5, masaüstünde video (16/9) */}
                  <div className="aspect-[4/3] md:aspect-video w-full overflow-hidden rounded-t-2xl md:rounded-2xl bg-gray-200 relative">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* MOBİL İÇİN KARARTMA (Yazının okunması için) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 md:opacity-0 transition-opacity"></div>

                    {/* MASAÜSTÜ HOVER BUTONU */}
                    <div className="absolute inset-0 bg-black/40 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="bg-white text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        İncele <ArrowUpRight size={18} />
                      </span>
                    </div>
                  </div>

                  {/* BİLGİ ALANI - MOBİLDE RESMİN ÜSTÜNDE */}
                  <div className="absolute bottom-0 left-0 w-full p-6 md:static md:p-0 md:mt-4 md:bg-transparent">
                    <div className="flex justify-between items-end md:items-start">
                        <div>
                            {/* Mobilde beyaz yazı, masaüstünde siyah */}
                            <h3 className="text-xl md:text-2xl font-bold text-white md:text-dark group-hover:text-primary transition-colors leading-tight">
                                {project.title}
                            </h3>
                            <p className="text-gray-300 md:text-gray-500 text-sm mt-1 font-medium">{project.category}</p>
                        </div>
                        
                        {/* Mobilde gizli, masaüstünde görünür tarih */}
                        <span className="hidden md:inline-block text-sm text-gray-400 border border-gray-200 px-3 py-1 rounded-full whitespace-nowrap">
                            {project.date}
                        </span>
                        
                        {/* Mobilde ok ikonu */}
                        <div className="md:hidden bg-white/20 backdrop-blur-sm p-2 rounded-full text-white">
                            <ArrowUpRight size={20}/>
                        </div>
                    </div>
                  </div>

                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;