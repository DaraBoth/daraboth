// src/components/Modal.jsx

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  img,
  name,
  designation,
  company,
  testimonialId,
}) => {
  useEffect(() => {
    // Get the scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`; // Add padding to compensate for scrollbar
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px'; // Remove padding
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px'; // Clean up on unmount
    };
  }, [isOpen]);

  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { opacity: 1, backdropFilter: 'blur(10px)', transition: { duration: 0.3 } },
    exit: { opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        type: "spring",
        duration: 0.5,
        damping: 25,
        stiffness: 500,
      },
    },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            layoutId={testimonialId}
            className="relative max-w-2xl w-full mx-4 max-h-[85vh] overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Enhanced Glass Modal Container */}
            <div className="relative glass-primary rounded-3xl p-8 lg:p-10 backdrop-blur-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 border border-white/30 shadow-2xl overflow-hidden">

              {/* Background Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#915EFF]/15 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#804dee]/15 to-transparent rounded-full blur-xl" />

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-2xl glass-button-secondary backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-xl font-bold hover:bg-white/20 transition-all duration-300"
              >
                &times;
              </motion.button>

              {/* Content Container */}
              <div className="relative z-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Modal Title */}
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-white text-2xl lg:text-3xl font-bold mb-6 text-center leading-tight"
                >
                  {title}
                </motion.h2>

                {/* User Info Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-4 mb-8 p-4 glass-secondary rounded-2xl backdrop-blur-md border border-white/20"
                >
                  <div className="relative">
                    <img
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30"
                      alt={name}
                      src={img || "/9720009.jpg"}
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white/50" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-lg mb-1">
                      {name}
                    </p>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {designation}
                      {designation && company ? ' of ' : ''}
                      <span className="text-[#915EFF] font-medium">{company}</span>
                      {!designation && !company ? 'Customer / Company Info Unavailable' : ''}
                    </p>
                  </div>
                </motion.div>

                {/* Testimonial Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  {/* Quote Icon */}
                  <div className="absolute -top-2 -left-2 text-6xl text-[#915EFF]/20 font-serif">"</div>

                  <div className="text-white/90 text-base lg:text-lg leading-relaxed whitespace-pre-wrap pl-8 pr-4">
                    {children}
                  </div>

                  {/* Quote Icon */}
                  <div className="absolute -bottom-4 -right-2 text-6xl text-[#915EFF]/20 font-serif rotate-180">"</div>
                </motion.div>

                {/* Decorative Bottom Line */}
                <div className="mt-8 w-24 h-1 bg-gradient-to-r from-[#915EFF] to-[#804dee] rounded-full mx-auto" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  img: PropTypes.string,
  name: PropTypes.string,
  designation: PropTypes.string,
  company: PropTypes.string,
  testimonialId: PropTypes.string,
};

export default Modal;
