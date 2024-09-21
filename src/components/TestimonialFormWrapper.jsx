// src/components/TestimonialFormWrapper.jsx

import React, { useState } from "react";
import Feedbacks from "./Feedbacks";
import TestimonialForm from "./TestimonialForm";

const TestimonialFormWrapper = () => {
  // State to trigger refresh in Feedbacks
  const [refreshToggle, setRefreshToggle] = useState(false);

  // Function to toggle refreshToggle
  const handleSuccess = () => {
    setRefreshToggle(prev => !prev);
  };

  return (
    <>
      {/* Pass refreshToggle to Feedbacks */}
      <Feedbacks refreshToggle={refreshToggle} />
      {/* Pass handleSuccess to TestimonialForm */}
      <TestimonialForm onSuccess={handleSuccess} />
    </>
  );
};

export default TestimonialFormWrapper;
