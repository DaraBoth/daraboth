import React from "react";
import Head from 'next/head';
import TestimonialFormWrapper from "../components/TestimonialFormWrapper";

const FeedbacksPage = () => {
  return (
    <>
      <Head>
        <title>Feedbacks | DaraBoth</title>
        <meta name="description" content="Share your feedback and testimonials" />
      </Head>
      <TestimonialFormWrapper isHomePage={false} />
    </>
  );
};

export default FeedbacksPage;
