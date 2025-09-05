import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SimpleLoader } from "@/components/Loader";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/homePage"));
const TestimonialFormWrapper = lazy(() => import("@/components/TestimonialFormWrapper"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<SimpleLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/feedbacks" element={<TestimonialFormWrapper isHomePage={false} />} />
          {/* <Redirect from="*" to="/" /> */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;