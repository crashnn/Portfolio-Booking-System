import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Instagram, MapPin, Send, ArrowRight, Video, Youtube } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Burada Backend'e istek atacağız (Şimdilik simülasyon)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      // 5 saniye sonra başarı mesajını kapat
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="pt-32 pb-20 px-6 bg-light min-h-screen relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-dark mb-4"
          >
            Projenizi Konuşalım.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto"
          >
            Bir fikriniz mi var? Veya markanızı bir üst seviyeye mi taşımak istiyorsunuz? 
            Aşağıdaki kanallardan bana ulaşabilirsiniz.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1 space-y-6"
          >
            
            <motion.a 
              variants={itemVariants}
              href="tel:+905555555555"
              className="group flex items-center gap-5 p-6 bg-white rounded-3xl shadow-lg border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <Phone size={28} />
              </div>
              <div>
                <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-1">Telefon / WhatsApp</h3>
                <p className="text-xl font-bold text-dark group-hover:text-green-600 transition-colors">+90 555 555 55 55</p>
              </div>
            </motion.a>

            <motion.a 
              variants={itemVariants}
              href="https://www.instagram.com/bugraasengull/"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-5 p-6 bg-white rounded-3xl shadow-lg border border-gray-100 hover:border-pink-300 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-red-500 group-hover:to-purple-600 group-hover:text-white transition-all">
                <Instagram size={28} />
              </div>
              <div>
                <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-1">Instagram</h3>
                <p className="text-xl font-bold text-dark group-hover:text-pink-600 transition-colors">@bugraasengull</p>
              </div>
            </motion.a>

            <motion.a 
              variants={itemVariants}
              href="mailto:iletisim@bugrasengul.com"
              className="group flex items-center gap-5 p-6 bg-white rounded-3xl shadow-lg border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-1">E-Posta</h3>
                <p className="text-lg font-bold text-dark group-hover:text-blue-600 transition-colors">iletisim@bugrasengul.com</p>
              </div>
            </motion.a>

             <motion.div 
              variants={itemVariants}
              className="flex items-center gap-5 p-6 bg-white rounded-3xl shadow-lg border border-gray-100"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-1">Stüdyo</h3>
                <p className="text-lg font-bold text-dark">İstanbul, Türkiye</p>
              </div>
            </motion.div>

          </motion.div>


          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 h-full relative overflow-hidden">
              
              {success ? (
                <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100/50">
                    <Send size={40} className="ml-1" />
                  </div>
                  <h3 className="text-3xl font-bold text-dark mb-4">Mesajınız İletildi!</h3>
                  <p className="text-gray-500 max-w-md">
                    En kısa sürede (genellikle 24 saat içinde) size dönüş yapacağım. İlginiz için teşekkürler.
                  </p>
                  <button onClick={() => setSuccess(false)} className="mt-8 text-primary font-bold hover:underline">Yeni mesaj gönder</button>
                </div>
              ) : null}

              <h2 className="text-2xl font-bold text-dark mb-8 flex items-center gap-2">
                Hemen Mesaj Gönder <ArrowRight className="text-primary"/>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Ad Soyad</label>
                    <input 
                      type="text" 
                      name="name" 
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-light border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      placeholder="İsminiz"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">E-posta</label>
                    <input 
                      type="email" 
                      name="email" 
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-light border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      placeholder="mail@ornek.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Konu</label>
                  <input 
                    type="text" 
                    name="subject" 
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-light border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="Proje hakkında..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Mesajınız</label>
                  <textarea 
                    name="message" 
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-light border border-gray-200 rounded-xl p-4 h-40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                    placeholder="Detaylardan bahsedin..."
                  ></textarea>
                </div>

                <button 
                  disabled={loading}
                  className="w-full py-5 bg-dark text-white font-bold rounded-2xl hover:bg-primary transition-all shadow-xl hover:shadow-primary/30 hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <span className="animate-pulse">Gönderiliyor...</span>
                  ) : (
                    <>
                      Mesajı Gönder <Send size={20} />
                    </>
                  )}
                </button>

              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;