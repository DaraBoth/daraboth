import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import TestimonialFormWrapper from "@/components/TestimonialFormWrapper";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/feedbacks" element={<TestimonialFormWrapper isHomePage={false} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
