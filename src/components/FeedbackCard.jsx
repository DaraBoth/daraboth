// src/components/FeedbackCard.jsx

import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import PropTypes from 'prop-types'; // Optional: For prop type checking

const FeedbackCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
}) => {

  return (
    <motion.div
      variants={fadeIn("", "spring", index * 0.5, 0.75)}
      className='bg-black-200 p-10 rounded-3xl xs:w-[320px] w-full'
    >
      <p className='text-white font-black text-[48px]'>"</p>

      <div className='mt-1'>
        <p className='text-white tracking-wider text-[18px]'>{testimonial}</p>

        <div className='mt-7 flex justify-between items-center gap-1'>
          <div className='flex-1 flex flex-col'>
            <p className='text-white font-medium text-[16px]'>
              <span className='blue-text-gradient'>@</span> {name}
            </p>
            <p className='mt-1 text-secondary text-[12px]'>
              {designation} of {company}
            </p>
          </div>

          <img
            src={image}
            alt={`Feedback by ${name}`}
            className='w-10 h-10 rounded-full object-cover'
            loading="lazy" // Optional: Improves performance by lazy loading images
            onError={(e) => {
              e.target.onerror = null; // Prevents infinite loop if fallback also fails
              e.target.src = "/9720009.jpg"; // Default avatar
            }}
            aria-label={`Feedback from ${name}`} // Enhances accessibility
          />
        </div>
      </div>
    </motion.div>
  );
};

// Optional: Define prop types for better type checking
FeedbackCard.propTypes = {
  index: PropTypes.number.isRequired,
  testimonial: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  designation: PropTypes.string,
  company: PropTypes.string,
  image: PropTypes.string,
};

export default FeedbackCard;
