import React from 'react';
import { FaHandshake, FaKiss } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Welcome = () => {
  // Define animation variants for coordinated entry
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Delay between child animations
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // Variant for the handshake icon to make it spin/scale dramatically
  const iconVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 8,
        delay: 0.8, // Make the icon appear last
      },
    },
  };

  // The 'Welcome To' text split into individual motion components
  const welcomeText = "Welcome To".split(" ");

  return (
    // Main container with full screen size and centering
    <div className='items-center flex flex-col justify-center h-screen w-full bg-blue-50 overflow-hidden'>
      
      {/* Framer Motion container to coordinate animations */}
      <motion.div
        className="flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated 'Welcome To' Title */}
        <motion.h1 
          className='text-6xl sm:text-7xl md:text-8xl text-blue-900 font-extrabold mb-4 overflow-hidden'
          variants={itemVariants}
        >
          {/* Mapping over words to create an animating text effect */}
          {welcomeText.map((word, index) => (
            <motion.span 
              key={index} 
              className="inline-block mr-3" // Adds space between words
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Animated 'AASTU' Subtitle */}
        <motion.span 
          className='text-4xl sm:text-5xl md:text-6xl text-blue-700 font-extrabold tracking-widest'
          variants={itemVariants}
        >
          AASTU
        </motion.span>
        
        {/* Highly Animated Icon */}
        <motion.div
          variants={iconVariants}
          initial="hidden"
          animate="visible"
          // Continuous animation loop for a heartbeat/pulse effect
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.5 }}
        >
          {/* Custom sizing for the icon to be large and highly visible */}
          <FaHandshake className='mt-10 w-48 h-48 sm:w-64 sm:h-64 text-green-600' />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Welcome;