import React, { Suspense, lazy } from "react";
import Head from 'next/head';
import { Toaster } from "sonner";
import { Navbar, Hero, StarsCanvas } from "../components"; // Keep critical above-fold components
import VisitorTracker from "../components/VisitorTracker";
import NotificationPrompt from "../components/NotificationPrompt";
import PerformanceMonitor from "../components/PerformanceMonitor";
import { SimpleLoader } from "../components/Loader";

// Lazy load below-fold components for better performance
const About = lazy(() => import("../components/About"));
const Experience = lazy(() => import("../components/Experience"));
const Tech = lazy(() => import("../components/Tech"));
const Works = lazy(() => import("../components/Works"));
const Contact = lazy(() => import("../components/Contact"));
const TestimonialFormWrapper = lazy(() => import("../components/TestimonialFormWrapper"));
const FloatingChatButton = lazy(() => import("../components/FloatingChatButton"));
const ChatPopup = lazy(() => import("../components/ChatPopup"));

const HomePage = () => {

  return (
    <>
      <Head>
        <title>DaraBoth | Software Engineer – Portfolio</title>
        <meta name="description" content="Portfolio of Vong Pich Daraboth – Full‑Stack Engineer specializing in React, Three.js, and modern web apps." />
        <link rel="canonical" href="https://vongpichdaraboth.netlify.app/" />

        <meta property="og:site_name" content="DaraBoth" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="DaraBoth | Software Engineer – Portfolio" />
        <meta property="og:description" content="Portfolio of Vong Pich Daraboth – Full‑Stack Engineer specializing in React, Three.js, and modern web apps." />
        <meta property="og:url" content="https://vongpichdaraboth.netlify.app/" />
        <meta property="og:image" content="https://vongpichdaraboth.netlify.app/screenshots/screenshot.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DaraBoth | Software Engineer – Portfolio" />
        <meta name="twitter:description" content="Portfolio of Vong Pich Daraboth – Full‑Stack Engineer specializing in React, Three.js, and modern web apps." />
        <meta name="twitter:image" content="https://vongpichdaraboth.netlify.app/screenshots/screenshot.png" />
      </Head>
      <VisitorTracker />
      <PerformanceMonitor />
      <Toaster
        richColors
        expand
        visibleToasts={9}
        position="top-right"
        closeButton
      />
      <NotificationPrompt />
      <div className="relative z-0 bg-primary overflow-hidden">
        {/* Hero Section with Enhanced Background */}
        <div className="relative min-h-screen">
          <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
            <div className="relative">
              <Navbar />
              <Hero />
              <StarsCanvas />
            </div>
          </div>
        </div>

        {/* Main Content with Enhanced Spacing */}
        <div className="relative z-10">
          {/* About Section with Enhanced Container */}
          <div className="relative py-20 lg:py-32">
            <Suspense fallback={<SimpleLoader />}>
              <About />
            </Suspense>
          </div>

          {/* Experience Section with Background Accent */}
          <div className="relative py-20 lg:py-32 bg-gradient-to-b from-transparent via-black-200/20 to-transparent">
            <Suspense fallback={<SimpleLoader />}>
              <Experience />
            </Suspense>
          </div>

          {/* Tech Section with Enhanced Layout */}
          <div className="relative py-20 lg:py-32">
            <Suspense fallback={<SimpleLoader />}>
              <Tech />
            </Suspense>
          </div>

          {/* Works Section with Background Accent */}
          <div className="relative py-20 lg:py-32 bg-gradient-to-b from-transparent via-tertiary/30 to-transparent">
            <Suspense fallback={<SimpleLoader />}>
              <Works />
            </Suspense>
          </div>

          {/* Testimonials Section */}
          <div className="relative py-20 lg:py-32">
            <Suspense fallback={<SimpleLoader />}>
              <TestimonialFormWrapper isHomePage={true} />
            </Suspense>
          </div>

          {/* Contact Section with Enhanced Background */}
          <div className="relative z-0 py-20 lg:py-32">
            <Suspense fallback={<SimpleLoader />}>
              <Contact />
            </Suspense>
            <StarsCanvas />
            <Suspense fallback={<div className="flex justify-center items-center h-8"><div className="text-secondary text-sm">Loading chat...</div></div>}>
              <FloatingChatButton>
                <ChatPopup />
              </FloatingChatButton>
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
