// src/components/Feedbacks.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import FeedbackCard from "./FeedbackCard"; // Ensure FeedbackCard is correctly imported

const Feedbacks = ({ refreshToggle }) => { // Accept refreshToggle as a prop
  // State to hold fetched testimonials
  const [testimonials, setTestimonials] = useState([]);
  // State to handle loading status
  const [loading, setLoading] = useState(true);
  // State to handle error messages
  const [error, setError] = useState(null);

  // Function to fetch testimonials from the API
  const fetchTestimonials = async () => {
    try {
      // Use the provided API URL directly
      const apiUrl = `https://tinynotie-api.vercel.app/daraboth/testimonials`;
      // console.log("Fetching testimonials from:", apiUrl); // Debugging

      const response = await axios.get(apiUrl);

      // console.log("API Response:", response.data); // Debugging

      // Check if the response status is true
      if (response.data.status) {
        setTestimonials(response.data.data);
        // console.log("Testimonials State Updated:", response.data.data); // Debugging
      } else {
        // If the API returns status false, set the error message
        setError(response.data.message || "Failed to fetch testimonials.");
        // console.log("API returned an error:", response.data.message); // Debugging
      }
    } catch (err) {
      // Handle errors such as network issues
      setError(
        err.response?.data?.message ||
          "An error occurred while fetching testimonials."
      );
      // console.error("Fetch Testimonials Error:", err); // Debugging
    } finally {
      // Set loading to false after the request is complete
      setLoading(false);
    }
  };

  // useEffect to fetch testimonials when the component mounts or refreshToggle changes
  useEffect(() => {
    setLoading(true); // Reset loading state before fetching
    fetchTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToggle]); // Dependency array includes refreshToggle

  // Conditional rendering based on loading and error states
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
    <div className={`mt-12 bg-black-100 rounded-[20px]`}>
      <div
        className={`bg-tertiary rounded-2xl ${styles.padding} min-h-[300px]`}
      >
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>What others say</p>
          <h2 className={styles.sectionHeadText}>Testimonials.</h2>
        </motion.div>
      </div>
      <div className={`-mt-20 pb-14 ${styles.paddingX} flex flex-wrap gap-7`}>
        {testimonials.length > 0 ? (
          testimonials.map((testimonial, index) => (
            <FeedbackCard
              key={testimonial.id || index} // Ensure 'id' is unique
              index={index}
              testimonial={testimonial.message}
              name={testimonial.name}
              designation={testimonial.title || "Customer"}
              company={testimonial.company || "Our Company"}
              image={testimonial.photo_url || "/9720009.jpg"} // Provide a default image if none
            />
          ))
        ) : (
          <p className="text-white">No testimonials available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default SectionWrapper(Feedbacks, "feedbacks");
