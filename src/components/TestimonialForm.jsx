// src/components/TestimonialForm.jsx

import React, { useState } from "react";
import axios from "axios";
import PropTypes from 'prop-types'; // Optional: For prop type checking

const TestimonialForm = ({ onSuccess }) => { // Accept onSuccess as a prop
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    company: "",
    message: "",
    photo_url: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Added success message

  // Handle input changes
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null); // Reset success message
    try {
      // Replace with your actual POST endpoint
      const response = await axios.post("https://tinynotie-api.vercel.app/daraboth/testimonials", formData);
      if (response.data.status) {
        // Call onSuccess callback to notify the wrapper
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
        // Optionally, reset the form
        setFormData({
          name: "",
          designation: "",
          company: "",
          message: "",
          photo_url: "",
        });
        setSuccessMessage("Your testimonial has been submitted successfully!");
      } else {
        // Handle API errors
        setError(response.data.message || "Failed to submit testimonial.");
      }
    } catch (err) {
      // Handle network or other errors
      setError(err.response?.data?.message || "An error occurred while submitting the testimonial.");
      console.error("Submit Testimonial Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 bg-black-100 rounded-[20px] p-8 mx-12">
      <h2 className="text-white text-2xl mb-4">Submit Your Testimonial</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Your Designation"
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Your Company"
          className="p-2 rounded bg-gray-800 text-white"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Testimonial"
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          type="url"
          name="photo_url"
          value={formData.photo_url}
          onChange={handleChange}
          placeholder="Photo URL (optional)"
          className="p-2 rounded bg-gray-800 text-white"
        />
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {submitting ? "Submitting..." : "Submit Testimonial"}
        </button>
      </form>
    </div>
  );
};

// Define prop types for better type checking
TestimonialForm.propTypes = {
  onSuccess: PropTypes.func, // Made onSuccess optional
};

// Define default props to prevent "onSuccess is not a function" error
TestimonialForm.defaultProps = {
  onSuccess: () => {}, // Default to a no-operation function
};

export default TestimonialForm;
