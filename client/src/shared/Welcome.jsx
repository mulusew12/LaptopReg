import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Main container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            backgroundSize: '400% 400%',
          }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Title */}
          <motion.h1
            className="text-5xl sm:text-7xl md:text-8xl font-black mb-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-cyan-200">
              AASTU
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Laptop Registration Portal
          </motion.h2>

          {/* Loading indicator */}
          <motion.div
            className="max-w-md mx-auto mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-blue-400"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            </div>
            <p className="text-white/70 text-sm mt-2">
              Loading application...
            </p>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <motion.div
          className="absolute top-10 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* Global styles for full-screen */}
      <style>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        
        #root {
          height: 100vh;
          width: 100vw;
        }
      `}</style>
    </div>
  );
};

export default Welcome;