import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import TestimonialFormWrapper from "@/components/TestimonialFormWrapper";
import Chat from "@/components/Chat"; // Import the Chat component

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/feedbacks" element={<TestimonialFormWrapper isHomePage={false} />} />
        {/* <Redirect from="*" to="/" /> */}
      </Routes>
      <Chat /> {/* Render the Chat component */}
    </BrowserRouter>
  );
};

export default App;