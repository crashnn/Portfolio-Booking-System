import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Video, Edit3, MonitorPlay, ChevronDown, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_URL from '../api';

const Home = () => {
  const scrollRef = useRef(null);
  const [faqs, setFaqs] = useState([]); 
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/faqs`)
      .then(res => res.json())
      .then(data => setFaqs(data))
      .catch(err => console.error("FAQ Hatası:", err));
  }, []);

  const handleScrollDown = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">

      {/* --- BÖLÜM 1: HERO --- */}
      <section className="relative min-h-[100dvh] flex items-center justify-center bg-black text-white px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black z-0 pointer-events-none"></div>

        <div className="relative z-10 text-center max-w-5xl mt-[-40px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <span className="text-primary font-bold tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm uppercase mb-4 block">Videographer & Editor</span>
          </motion.div>

          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-8xl font-bold mb-6 leading-tight"
          >
            HİKAYENİZİ <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">SİNEMATİK</span> ANLATIN.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 text-base md:text-2xl max-w-2xl mx-auto mb-8 md:mb-10 font-light"
          >
            Markalar ve bireyler için yaratıcı video prodüksiyon çözümleri.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col md:flex-row gap-4 justify-center items-center w-full"
          >
            <Link to="/portfolio" className="w-full md:w-auto px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/30">
              Projeleri Gör <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="w-full md:w-auto px-8 py-4 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all text-center">
              İletişime Geç
            </Link>
          </motion.div>
        </div>

        {/* --- DÜZELTİLEN OK KISMI --- */}
        {/* left-1/2 ve -translate-x-1/2 ile kesin ortalama sağlandı */}
        <motion.button
          onClick={handleScrollDown}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10   text-gray-400 hover:text-white transition-colors cursor-pointer z-20 p-4"
        >
          <ChevronDown size={32} />
        </motion.button>
      </section>


      {/* --- BÖLÜM 2: MARQUEE --- */}
      <div ref={scrollRef} className="bg-primary py-3 md:py-4 overflow-hidden border-y-4 border-black relative z-10">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="whitespace-nowrap flex gap-6 md:gap-10 text-black font-black text-xl md:text-4xl uppercase tracking-wider"
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="flex items-center gap-4">VIDEO EDITING <span className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></span> PRODUCTION <span className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></span> COLOR GRADING <span className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></span></span>
          ))}
        </motion.div>
      </div>


      {/* --- BÖLÜM 3: HİZMETLER --- */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-light">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-dark mb-4">Neler Yapıyorum?</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">Fikirden finale kadar tüm süreçte profesyonel destek.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: <Video size={32} />, title: "Prodüksiyon", desc: "Tanıtım filmleri ve reklam çekimleri için profesyonel ekipman desteği." },
              { icon: <Edit3 size={32} />, title: "Kurgu & Edit", desc: "Ham görüntülerinizi dinamik ve etkileyici hikayelere dönüştürüyorum." },
              { icon: <MonitorPlay size={32} />, title: "Sosyal Medya", desc: "Reels, TikTok ve Shorts için viral potansiyeli yüksek içerikler." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-primary/30 hover:-translate-y-2 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${idx === 0 ? 'bg-purple-100 text-primary' : idx === 1 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                  {item.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-500 mb-6 leading-relaxed text-sm md:text-base">{item.desc}</p>
                <Link to="/services" className="text-sm font-bold text-dark border-b-2 border-primary pb-1 hover:text-primary transition">DETAYLAR</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* --- BÖLÜM 4: HAKKIMDA --- */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16">
          <motion.div {...fadeInUp} className="w-full lg:w-1/2 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-800 relative">
              <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000" alt="About" className="w-full h-full object-cover opacity-80" />
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-primary rounded-3xl -z-10 hidden md:block"></div>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} className="w-full lg:w-1/2">
            <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm md:text-base">VİZYONUM</h2>
            <h3 className="text-3xl md:text-6xl font-bold mb-6 md:mb-8 leading-tight">Sadece video değil, <br /> <span className="text-gray-500">deneyim tasarlıyorum.</span></h3>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6">Her markanın anlatacak eşsiz bir hikayesi vardır. Benim işim, bu hikayeyi en estetik şekilde izleyiciye aktarmak.</p>

            <div className="flex gap-8 border-t border-gray-800 pt-8">
              <div>
                <h4 className="text-3xl md:text-4xl font-bold text-white">50+</h4>
                <p className="text-gray-500 text-sm">Mutlu Müşteri</p>
              </div>
              <div>
                <h4 className="text-3xl md:text-4xl font-bold text-white">100+</h4>
                <p className="text-gray-500 text-sm">Proje</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* --- BÖLÜM 5: SIKÇA SORULAN SORULAR --- */}
      <section id="faq" className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Sıkça Sorulan Sorular</h2>
            <p className="text-gray-500 text-sm md:text-base">Aklınıza takılan soruların cevapları burada.</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.length > 0 ? (
              faqs.map((faq, index) => (
                <motion.div
                  key={faq._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-start md:items-center justify-between p-5 md:p-6 bg-white hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="font-bold text-base md:text-lg text-dark pr-4 leading-snug">{faq.question}</span>
                    <div className={`p-2 shrink-0 rounded-full ${activeFaq === index ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'} transition-all mt-[-4px] md:mt-0`}>
                      {activeFaq === index ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 md:p-6 text-sm md:text-base text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-10 border-2 border-dashed border-gray-100 rounded-xl">
                Henüz soru eklenmemiş veya yükleniyor...
              </div>
            )}
          </div>
        </div>
      </section>


      {/* --- BÖLÜM 6: CTA --- */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-light text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-primary rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <h2 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6 relative z-10">Birlikte Harika Bir Şey Yaratalım.</h2>
          <p className="text-white/80 text-base md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto relative z-10">Takvimim dolmadan yerinizi ayırtın.</p>

          <Link to="/booking" className="inline-block bg-white text-primary px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-base md:text-lg hover:scale-105 transition-transform shadow-lg relative z-10">
            Hemen Rezervasyon Yap
          </Link>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;