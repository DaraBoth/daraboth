import LiveIsland from "react-live-island";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

const DynamicIsland = () => {
  const [isAboutInView, setIsAboutInView] = useState(false);
  const [isWorkInView, setIsWorkInView] = useState(false);
  const [isContactInView, setIsContactInView] = useState(false);
  const [isAskMoreInView, setIsAskMoreInView] = useState(false);

  const aboutRef = useRef();
  const workRef = useRef();
  const contactRef = useRef();
  const askMoreRef = useRef();
  const { scrollY } = useScroll();

//   useEffect(() => {
//     const isElementInViewport = (el) => {
//       const rect = el.getBoundingClientRect();
//       return (
//         rect.top >= 0 &&
//         rect.left >= 0 &&
//         rect.bottom <=
//           (window.innerHeight || document.documentElement.clientHeight) &&
//         rect.right <=
//           (window.innerWidth || document.documentElement.clientWidth)
//       );
//     };

//     const handleScroll = () => {
//       setIsAboutInView(isElementInViewport(aboutRef));
//       setIsWorkInView(isElementInViewport(workRef));
//       setIsContactInView(isElementInViewport(contactRef));
//       setIsAskMoreInView(isElementInViewport(askMoreRef));
//     };

//     handleScroll();

//     // Add a scroll event listener
//     const removeScrollListener = scrollY.onChange(handleScroll);

//     // Remove the event listener when the component is unmounted
//     return () => {
//       removeScrollListener();
//     };
//   }, [aboutRef, workRef, contactRef, askMoreRef, scrollY]);

  return (
    <div>
      <LiveIsland>
        {(isSmall) => {
          return (
            <>
              {isAboutInView && "isAboutInView"}
              {isWorkInView && "isWorkInView"}
              {isContactInView && "isContactInView"}
              {isAskMoreInView && "isAskMoreInView"}
            </>
          );
        }}
      </LiveIsland>
    </div>
  );
};

export default DynamicIsland;
