// src/components/Feedbacks.jsx

import React, { useState, useEffect, useRef } from "react";
import { motion, LayoutGroup } from "framer-motion";
import axios from "axios";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, slideIn, textVariant } from "../utils/motion";
import Marquee from "./magic-ui/Marquee";
import ReviewCard from "./magic-ui/ReviewCard";
import { Link } from "react-router-dom";
import Modal from "./Modal";

const Feedbacks = ({ refreshToggle }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isCardAnimating, setIsCardAnimating] = useState(false);
  const [shouldMarqueeAnimate, setShouldMarqueeAnimate] = useState(true);
  const marqueeContainerRef = useRef(null);

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

  useEffect(() => {
    const checkOverflow = () => {
      if (marqueeContainerRef.current) {
        // Check if the content width exceeds the container width
        // This is a simplification; a more robust check might involve children widths.
        const containerWidth = marqueeContainerRef.current.clientWidth;
        const contentWidth = marqueeContainerRef.current.scrollWidth; // This will give the total width of content

        // Since Marquee duplicates content, we need a better way to check for overflow.
        // A simpler approach for Marquee is to assume it animates if there are enough items
        // or if the *actual* content width of a single set of children exceeds the container.
        // For now, let's keep it simple: if there are more than 2-3 items, assume overflow for marquee purposes.
        // A more precise check would involve measuring the combined width of all ReviewCards if they were laid out in one line.

        // For a more accurate check, we need to sum the width of all individual ReviewCards.
        // This might be overly complex given the current structure of Marquee.
        // A pragmatic approach: if there are many testimonials, enable marquee.
        // Or, more accurately, we can try to get the width of the *first* child of the marquee container
        // and multiply by testimonials.length.

        // Let's assume for now that if the number of testimonials is large enough
        // that it's likely to overflow, we animate.
        // A better solution requires more deep diving into Marquee's internal rendering.
        if (testimonials.length > 3) { // Arbitrary number, adjust based on visual testing
          setShouldMarqueeAnimate(true);
        } else {
          setShouldMarqueeAnimate(false);
        }
      }
    };

    // Initial check
    checkOverflow();

    // Re-check on window resize for responsiveness
    window.addEventListener('resize', checkOverflow);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, [testimonials]); // Re-run when testimonials change

  const handleShowMore = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsCardAnimating(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setSelectedTestimonial(null);
      setIsCardAnimating(false);
    }, 300);
  };

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
    <div className="relative max-w-7xl mx-auto">
      {/* Enhanced Section Header */}
      <div className="text-center mb-16">
        <motion.div variants={textVariant()}>
          <p className={`${styles.sectionSubText} text-[#915EFF] mb-4`}>
            What Others Say
          </p>
          <h2 className={`${styles.sectionHeadText} mb-8`}>
            Beyond the Portfolio<span className="text-[#915EFF]">.</span>{" "}
            <Link
              to={"/feedbacks"}
              className="inline-block ml-2 text-2xl hover:scale-110 transition-transform duration-300"
            >
              ✍️
            </Link>
          </h2>
        </motion.div>

        {/* Decorative Line */}
        <div className="w-32 h-1 bg-gradient-to-r from-[#915EFF] to-[#804dee] mx-auto rounded-full" />
      </div>

      {/* Enhanced Testimonials Container */}
      <motion.div
        variants={fadeIn("up", "", 0.1, 1)}
        className="relative"
      >
        {/* Glass Container with Enhanced Effects */}
        <div className="relative glass-primary rounded-3xl p-8 lg:p-12 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-white/8 to-white/5 border border-white/20 shadow-2xl overflow-hidden">

          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#915EFF]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#804dee]/10 to-transparent rounded-full blur-2xl" />

          {/* Content */}
          <div className="relative z-10">
            <LayoutGroup>
              <div ref={marqueeContainerRef} className="space-y-8">
                {testimonials.length > 0 ? (
                  <>
                    {/* First Marquee Row */}
                    <div className="relative">
                      <Marquee
                        pauseOnHover
                        repeat={2}
                        className="[--duration:120s]"
                        shouldAnimate={shouldMarqueeAnimate}
                      >
                        {testimonials.map((review) => (
                          <div key={review.id} className="mx-4">
                            <ReviewCard
                              {...review}
                              onShowMore={handleShowMore}
                              hideOriginal={isCardAnimating && selectedTestimonial?.id === review.id}
                            />
                          </div>
                        ))}
                      </Marquee>
                    </div>

                    {/* Second Marquee Row (Reverse) */}
                    <div className="relative">
                      <Marquee
                        reverse
                        pauseOnHover
                        repeat={2}
                        className="[--duration:120s]"
                        shouldAnimate={shouldMarqueeAnimate}
                      >
                        {[...testimonials].reverse().map((review) => (
                          <div key={`reverse-${review.id}`} className="mx-4">
                            <ReviewCard
                              {...review}
                              onShowMore={handleShowMore}
                              hideOriginal={isCardAnimating && selectedTestimonial?.id === review.id}
                            />
                          </div>
                        ))}
                      </Marquee>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="glass-secondary rounded-2xl p-8 backdrop-blur-md border border-white/20 max-w-md mx-auto">
                      <p className="text-white/80 text-lg">
                        No testimonials available at the moment.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Modal */}
              <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={selectedTestimonial?.name ? `A Word From ${selectedTestimonial.name}` : "Their Thoughts"}
                img={selectedTestimonial?.img}
                name={selectedTestimonial?.name}
                designation={selectedTestimonial?.designation}
                company={selectedTestimonial?.company}
                testimonialId={selectedTestimonial?.id}
              >
                {selectedTestimonial?.message || ""}
              </Modal>
            </LayoutGroup>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-[#915EFF]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-gradient-to-tl from-[#804dee]/5 to-transparent rounded-full blur-2xl" />

        {/* Floating Background Particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
            className={`absolute w-2 h-2 bg-[#915EFF] rounded-full`}
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 20}%`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Feedbacks, "feedbacks");
