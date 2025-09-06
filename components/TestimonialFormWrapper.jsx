// src/components/TestimonialFormWrapper.jsx

import React, { useState } from "react";
import Feedbacks from "./Feedbacks";
import TestimonialForm from "./TestimonialForm";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const TestimonialFormWrapper = ({ isHomePage }) => {
  // State to trigger refresh in Feedbacks
  const [refreshToggle, setRefreshToggle] = useState(false);

  // Function to toggle refreshToggle
  const handleSuccess = () => {
    setRefreshToggle(prev => !prev);
  };

  return (
    <>
      {!isHomePage && <Link to={"/"} className="z-40 fixed top-5 left-5">🔙</Link>}
      {!isHomePage && (
        <Helmet>
          <title>Testimonials – DaraBoth</title>
          <meta name="description" content="Read and submit testimonials for Vong Pich Daraboth." />
          <link rel="canonical" href="https://vongpichdaraboth.netlify.app/feedbacks" />

          <meta property="og:site_name" content="DaraBoth" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Testimonials – DaraBoth" />
          <meta property="og:description" content="Read and submit testimonials for Vong Pich Daraboth." />
          <meta property="og:url" content="https://vongpichdaraboth.netlify.app/feedbacks" />
          <meta property="og:image" content="https://vongpichdaraboth.netlify.app/screenshots/screenshot.png" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Testimonials – DaraBoth" />
          <meta name="twitter:description" content="Read and submit testimonials for Vong Pich Daraboth." />
          <meta name="twitter:image" content="https://vongpichdaraboth.netlify.app/screenshots/screenshot.png" />
        </Helmet>
      )}
      {/* Pass refreshToggle to Feedbacks */}
      {isHomePage && <Feedbacks refreshToggle={refreshToggle} />}
      {/* Pass handleSuccess to TestimonialForm */}
      {!isHomePage && <TestimonialForm onSuccess={handleSuccess} />}
    </>
  );
};

export default TestimonialFormWrapper;