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
        {error && <p className="text-red-500 text-center">{error}</p>}
        {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
        <button
          type="submit"
          disabled={submitting}
          className={`bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary hover:bg-tertiary-dark transition duration-200 ${
            submitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
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

export default SectionWrapper(TestimonialForm, "testimonial");
