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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            layoutId={testimonialId}
            className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto relative"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-white text-2xl mb-4 text-center">{title}</h2>
            <div className="flex flex-row items-center gap-2 mb-4">
              <img className="rounded-full" width="48" height="48" alt={name} src={img || "/9720009.jpg"} />
              <div className="flex flex-col">
                <p className="text-white font-medium text-lg">
                  {name} says:
                </p>
                <p className="text-sm text-gray-400">
                  {designation}
                  {designation && company ? ' of ' : ''}
                  {company}
                  {!designation && !company ? 'Customer / Company Info Unavailable' : ''}
                </p>
              </div>
            </div>
            <div className="text-white text-base leading-relaxed whitespace-pre-wrap">
              {children}
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
