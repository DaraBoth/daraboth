// src/components/Feedbacks.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, slideIn, textVariant } from "../utils/motion";
import Marquee from "./magic-ui/Marquee";
import ReviewCard from "./magic-ui/ReviewCard";

const Feedbacks = ({ refreshToggle }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestimonials = async () => {
    try {
      const apiUrl = `https://tinynotie-api.vercel.app/daraboth/testimonials`;
      const response = await axios.get(apiUrl);
      if (response.data.status) {
        setTestimonials(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch testimonials.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching testimonials."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTestimonials();
  }, [refreshToggle]);

  if (loading) {
    return (
      <div className={`mt-12 bg-black-100 rounded-[20px]`}>
        <div
          className={`bg-tertiary rounded-2xl ${styles.padding} min-h-[300px] flex items-center justify-center`}
        >
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          <p className="text-white text-lg ml-4">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`mt-12 bg-black-100 rounded-[20px]`}>
        <div
          className={`bg-tertiary rounded-2xl ${styles.padding} min-h-[300px] flex items-center justify-center`}
        >
          <p className="text-white text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`xl:mt-12  flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}
    >
      <motion.div className="flex-[0.75] bg-black-100 p-8 rounded-2xl">
        <p className={styles.sectionSubText}>What others say</p>
        <h2 className={styles.sectionHeadText}>Testimonials.</h2>
        <div className="mt-20 pb-14 ${styles.paddingX} flex flex-wrap gap-7">
          {testimonials.length > 0 ? (
            <>
              <Marquee pauseOnHover repeat={2} className="[--duration:20s]">
                {testimonials.map((review) => (
                  <ReviewCard key={review.id} {...review} />
                ))}
              </Marquee>
              <Marquee reverse pauseOnHover repeat={2} className="[--duration:20s]">
                {testimonials.reverse().map((review) => (
                  <ReviewCard key={review.id} {...review} />
                ))}
              </Marquee>
            </>
          ) : (
            <p className="text-white">
              No testimonials available at the moment.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Feedbacks, "feedbacks");
