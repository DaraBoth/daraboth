import { BrowserRouter } from "react-router-dom";
import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
} from "./components";
import { Toaster } from "sonner";
import FloatingChatButton from "./components/FloatingChatButton"; // New Component
import FloatingChat from "./components/ChatPopup"; // New Component
import { useState } from "react";
import NotificationPrompt from "./components/NotificationPrompt";
import TestimonialForm from "./components/TestimonialForm";
import TestimonialFormWrapper from "./components/TestimonialFormWrapper";
import VisitorTracker from "./components/VisitorTracker";
// import usePushNotifications from "./hock/usePushNotifications";

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // usePushNotifications();

  return (
    <BrowserRouter>
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
        <TestimonialFormWrapper />
        <div className="relative z-0">
          <Contact />
          <StarsCanvas />
          <FloatingChatButton onClick={toggleChat} />
          {isChatOpen && <FloatingChat onClose={toggleChat} />}
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
