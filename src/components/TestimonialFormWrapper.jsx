// src/components/TestimonialFormWrapper.jsx
"use client"
import React, { useState } from "react";
import Feedbacks from "./Feedbacks";
import TestimonialForm from "./TestimonialForm";
import Link from "next/link";
// import { Link } from "react-router-dom";

const TestimonialFormWrapper = ({ isHomePage }) => {
  // State to trigger refresh in Feedbacks
  const [refreshToggle, setRefreshToggle] = useState(false);

  // Function to toggle refreshToggle
  const handleSuccess = () => {
    setRefreshToggle(prev => !prev);
  };

  return (
    <>
      {!isHomePage && <Link href={"/"}  className="z-40 fixed top-5 left-5" >👈</Link>}
      {/* Pass refreshToggle to Feedbacks */}
      {isHomePage && <Feedbacks refreshToggle={refreshToggle} />}
      {/* Pass handleSuccess to TestimonialForm */}
      {!isHomePage && <TestimonialForm onSuccess={handleSuccess} />}
    </>
  );
};

export default TestimonialFormWrapper;
