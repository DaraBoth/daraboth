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
    <div
      className={`xl:mt-12 ${styles.paddingX} flex xl:flex-row flex-col-reverse gap-10`}
    >
      <motion.div className="flex-[0.75] bg-black-100 rounded-2xl p-8">
        <p className={styles.sectionSubText}>What others say </p>
        <h2 className={styles.sectionHeadText}>Beyond the Portfolio. <Link to={"/feedbacks"}>✍️</Link></h2>

        <LayoutGroup>
          <div ref={marqueeContainerRef} className="mt-20 pb-14 flex flex-wrap gap-7">
            {testimonials.length > 0 ? (
              <>
                <Marquee pauseOnHover repeat={2} className="[--duration:100s]" shouldAnimate={shouldMarqueeAnimate}>
                  {testimonials.map((review) => (
                    <ReviewCard
                      key={review.id}
                      {...review}
                      onShowMore={handleShowMore}
                      hideOriginal={isCardAnimating && selectedTestimonial?.id === review.id}
                    />
                  ))}
                </Marquee>
                <Marquee
                  reverse
                  pauseOnHover
                  repeat={2}
                  className="[--duration:100s]"
                  shouldAnimate={shouldMarqueeAnimate}
                >
                  {testimonials.reverse().map((review) => (
                    <ReviewCard
                      key={review.id}
                      {...review}
                      onShowMore={handleShowMore}
                      hideOriginal={isCardAnimating && selectedTestimonial?.id === review.id}
                    />
                  ))}
                </Marquee>
              </>
            ) : (
              <p className="text-white">
                No testimonials available at the moment.
              </p>
            )}
          </div>

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
            {selectedTestimonial?.message}
          </Modal>
        </LayoutGroup>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Feedbacks, "feedbacks");
