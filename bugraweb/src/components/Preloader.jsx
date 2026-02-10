import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Preloader = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="text-center relative">
        {/* İsim Animasyonu */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-dark"
        >
          BUĞRA <span className="text-primary">ŞENGÜL</span>
        </motion.h1>

   
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="h-1.5 bg-primary mt-2 mx-auto rounded-full"
        />

     
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="mt-3 text-gray-500 font-semibold tracking-widest text-sm uppercase"
        >
          VİDEOGRAPHER & EDİTÖR
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Preloader;