import {
  About,
  Contact,
  Experience,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
} from "@/components";
import { Toaster } from "sonner";
import FloatingChatButton from "@/components/FloatingChatButton"; // New Component
import NotificationPrompt from "@/components/NotificationPrompt";
import TestimonialFormWrapper from "@/components/TestimonialFormWrapper";
import VisitorTracker from "@/components/VisitorTracker";
import ChatPopup from "../components/ChatPopup";
import { Helmet } from 'react-helmet-async';

const HomePage = () => {

  return (
    <>
      <Helmet>
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
      </Helmet>
      <VisitorTracker />
      <Toaster
        richColors
        expand
        visibleToasts={9}
        position="top-right"
        closeButton
      />
      <NotificationPrompt />
      <div className="relative z-0 bg-primary">
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <div className="relative">
            <Navbar />
            <Hero />
            <StarsCanvas />
          </div>
        </div>
        <About />
        <Experience />
        <Tech />
        <Works />
        <TestimonialFormWrapper isHomePage={true} />
        <div className="relative z-0">
          <Contact />
          <StarsCanvas />
          <FloatingChatButton>
            <ChatPopup />
          </FloatingChatButton>
        </div>
      </div>
    </>
  );
};

export default HomePage;