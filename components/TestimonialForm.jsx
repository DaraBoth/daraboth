// src/components/TestimonialForm.jsx

import React, { useState } from "react";
import axios from "axios";
import PropTypes from 'prop-types'; // For prop type checking
import { SectionWrapper } from "../hoc";

const TestimonialForm = ({ onSuccess=()=>{} }) => { // Accept onSuccess as a prop
  const [formData, setFormData] = useState({
    name: "",
    email: "", // Added email field
    title: "",
    company: "",
    message: "",
    photo_url: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Success message state

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
          email: "", // Reset email field
          title: "",
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
    <div className="mt-12 bg-black-100 rounded-[20px] p-8">
      <h2 className="text-white text-2xl mb-4 text-center">Submit Your Testimonial</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          <span className="text-white font-medium mb-2">Your Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-white font-medium mb-2">Your Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-white font-medium mb-2">Your Title</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Your Title"
            className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-white font-medium mb-2">Your Company</span>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Your Company"
            className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-white font-medium mb-2">Your Testimonial</span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Testimonial"
            required
            className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium resize-none h-32"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-white font-medium mb-2">Photo URL (optional)</span>
          <input
            type="url"
            name="photo_url"
            value={formData.photo_url}
            onChange={handleChange}
            placeholder="Photo URL (optional)"
            className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
          />
        </label>
        {error && <p className="text-red-500 text-center flex items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{error}</p>}
        {successMessage && <p className="text-green-500 text-center flex items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>{successMessage}</p>}
        <button
          type="submit"
          disabled={submitting || successMessage} // Disable button after success too
          className={`bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary hover:bg-tertiary-dark transition duration-200 ${
            submitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : successMessage ? (
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Submitted!
            </span>
          ) : error ? (
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Try Again
            </span>
          ) : (
            "Share Your Story"
          )}
        </button>
      </form>
    </div>
  );
};

// Define prop types for better type checking
TestimonialForm.propTypes = {
  onSuccess: PropTypes.func, // Made onSuccess optional
};

export default SectionWrapper(TestimonialForm, "testimonial");
