import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import TestimonialFormWrapper from "@/components/TestimonialFormWrapper";
import Chat from "@/components/Chat"; // Add this line

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/feedbacks" element={<TestimonialFormWrapper isHomePage={false} />} />
        {/* <Redirect from="*" to="/" /> */}
      </Routes>
      <Chat /> {/* Add this line */}
    </BrowserRouter>
  );
};

export default App;