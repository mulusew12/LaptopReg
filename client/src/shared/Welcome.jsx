import React, { useEffect, useState } from 'react';
import { FaHandshake } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [redirectProgress, setRedirectProgress] = useState(0);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Redirect to dashboard after 3 seconds with progress tracking
  useEffect(() => {
    let startTime = Date.now();
    const duration = 3000; // 3 seconds
    let animationFrame;
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setRedirectProgress(progress * 100);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        navigate('/'); // Adjust this to your dashboard route
      }
    };
    
    animationFrame = requestAnimationFrame(updateProgress);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [navigate]);

  // Mouse move effect for subtle parallax (desktop only)
  useEffect(() => {
    if (isMobile) return; // Disable on mobile for performance
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) * 0.005,
        y: (e.clientY - window.innerHeight / 2) * 0.005,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // Responsive text sizes
  const getResponsiveTextSize = () => {
    if (isMobile) {
      return {
        welcome: 'text-3xl',
        title: 'text-5xl',
        subtitle: 'text-xl',
        icon: 'w-32 h-32'
      };
    }
    if (isTablet) {
      return {
        welcome: 'text-4xl',
        title: 'text-7xl',
        subtitle: 'text-2xl',
        icon: 'w-48 h-48'
      };
    }
    return {
      welcome: 'text-5xl md:text-6xl',
      title: 'text-8xl md:text-9xl',
      subtitle: 'text-3xl md:text-4xl',
      icon: 'w-64 h-64'
    };
  };

  const textSizes = getResponsiveTextSize();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Faster on mobile
        delayChildren: 0.1,
      },
    },
  };

  const textVariants = {
    hidden: { y: isMobile ? 20 : 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: isMobile ? 80 : 100,
        damping: isMobile ? 8 : 10,
        mass: isMobile ? 0.8 : 1,
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0, rotate: isMobile ? -90 : -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: isMobile ? 40 : 50,
        damping: isMobile ? 6 : 8,
        delay: isMobile ? 0.5 : 0.8,
      },
    },
    pulse: {
      scale: [1, isMobile ? 1.05 : 1.1, 1],
      transition: {
        duration: isMobile ? 1.5 : 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      {/* Optimized background for different devices */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          backgroundImage: isMobile 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' // Simpler gradient for mobile
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #667eea 100%)',
        }}
      >
        {/* Subtle grid pattern for larger screens */}
        {!isMobile && (
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        )}
      </div>

      {/* Mouse parallax effect (desktop only) */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0"
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 15,
          }}
        />
      )}

      {/* Main content with responsive padding */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <motion.div
          className="flex flex-col items-center text-center w-full max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome text */}
          <motion.div
            className="mb-4 sm:mb-6"
            variants={textVariants}
          >
            <motion.span
              className={`${textSizes.welcome} font-light text-white/90 tracking-wider`}
            >
              Welcome to
            </motion.span>
          </motion.div>

          {/* AASTU title with responsive sizing */}
          <motion.div
            className="relative mb-8 sm:mb-12"
            variants={textVariants}
          >
            <div className="relative">
              <motion.h1
                className={`${textSizes.title} font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-cyan-200 px-2`}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: isMobile ? 3 : 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                AASTU
              </motion.h1>
              
              {/* Glow effect (reduced on mobile) */}
              <div className={`absolute inset-0 -z-10 ${isMobile ? 'blur-xl opacity-30' : 'blur-3xl opacity-40'}`}>
                <motion.div
                  className="w-full h-full bg-gradient-to-r from-blue-500/50 to-cyan-500/50 rounded-full"
                  animate={{
                    scale: [1, isMobile ? 1.05 : 1.1, 1],
                  }}
                  transition={{
                    duration: isMobile ? 2 : 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Subtitle with responsive spacing */}
          <motion.div
            className="mb-10 sm:mb-16 max-w-2xl px-4"
            variants={textVariants}
          >
            <motion.h2
              className={`${textSizes.subtitle} font-semibold text-white ${isMobile ? 'mb-2' : 'mb-4'}`}
            >
              Laptop Registration Portal
            </motion.h2>
            
            {/* Additional text for larger screens */}
            {!isMobile && (
              <motion.p
                className="text-lg text-white/70 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Streamlining device management for the digital campus
              </motion.p>
            )}
          </motion.div>

          {/* Animated handshake icon with responsive sizing */}
          <motion.div
            className="relative"
            variants={iconVariants}
            animate={["visible", "pulse"]}
          >
            <div className="relative">
              {/* Glowing rings (reduced on mobile) */}
              <motion.div
                className={`absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-blue-400/20 ${
                  isMobile ? '-m-4 blur-lg' : '-m-8 blur-xl'
                }`}
                animate={{
                  scale: [1, isMobile ? 1.2 : 1.3, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: isMobile ? 1.5 : 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Main icon */}
              <FaHandshake className={`${textSizes.icon} text-white ${isMobile ? 'drop-shadow-lg' : 'drop-shadow-2xl'}`} />
            </div>
          </motion.div>

          {/* Loading/Redirect indicator */}
          <motion.div
            className={`mt-8 sm:mt-12 ${isMobile ? 'w-11/12' : 'w-2/3 md:w-1/2 lg:w-1/3'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: isMobile ? 0.3 : 0.5 }}
          >
            <div className="flex flex-col items-center">
              {/* Progress bar container */}
              <div className="w-full h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"
                  initial={{ width: "0%" }}
                  animate={{ width: `${redirectProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              
              {/* Progress text */}
              <div className="flex justify-between items-center w-full mt-2">
                <p className="text-white/70 text-xs sm:text-sm">
                  Redirecting to dashboard...
                </p>
                <p className="text-white/70 text-xs sm:text-sm font-medium">
                  {Math.round(redirectProgress)}%
                </p>
              </div>
              
              {/* Skip button for mobile (optional) */}
              {isMobile && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
                >
                  Skip
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Add gradient animation to global styles */}
      <style>
        {`
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          
          /* Optimize animations for mobile */
          @media (max-width: 768px) {
            * {
              -webkit-tap-highlight-color: transparent;
            }
          }
          
          /* Prevent overscroll on mobile */
          body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            height: 100vh;
            touch-action: none;
          }
          
          /* Smooth transitions */
          * {
            transition: background-color 0.3s ease;
          }
        `}
      </style>
    </div>
  );
};

export default Welcome;