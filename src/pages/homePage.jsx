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

const HomePage = () => {
  
  return (
    <>
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
