import { cn } from "@/lib/utils";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const ReviewCard = ({
  img,
  name,
  title,
  message,
  company,
  onShowMore,
  hideOriginal,
}) => {
  const [showShowMoreButton, setShowShowMoreButton] = useState(false);
  const textRef = useRef(null);

  // Using a more generous limit for initial content, as overflow detection will be more accurate
  const initialCharacterLimit = 200; // This is now just for initial display, not strict truncation decision

  const truncatedMessage = message.length > initialCharacterLimit
    ? `${message.substring(0, initialCharacterLimit)}...`
    : message;

  useEffect(() => {
    if (textRef.current) {
      // Create a temporary element to measure the full text's height
      const tempDiv = document.createElement('div');
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.position = 'absolute';
      tempDiv.style.width = `${textRef.current.clientWidth}px`; // Match the width of the actual blockquote
      tempDiv.style.fontSize = getComputedStyle(textRef.current).fontSize;
      tempDiv.style.lineHeight = getComputedStyle(textRef.current).lineHeight;
      tempDiv.style.padding = getComputedStyle(textRef.current).padding;
      tempDiv.style.margin = getComputedStyle(textRef.current).margin;
      tempDiv.style.fontFamily = getComputedStyle(textRef.current).fontFamily;
      tempDiv.style.fontWeight = getComputedStyle(textRef.current).fontWeight;
      tempDiv.style.whiteSpace = getComputedStyle(textRef.current).whiteSpace;
      tempDiv.innerHTML = message; // Use the full message for measurement
      document.body.appendChild(tempDiv);

      // Define the target height (e.g., 3 lines * calculated line height)
      // A rough estimate of line height can be used, or precisely calculated.
      // For 3 lines, let's assume a target height based on font size and line-height
      const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight) || parseFloat(getComputedStyle(textRef.current).fontSize) * 1.5; // Fallback
      const targetHeight = lineHeight * 3; // For approximately 3 lines

      if (tempDiv.scrollHeight > targetHeight) {
        setShowShowMoreButton(true);
      } else {
        setShowShowMoreButton(false);
      }

      document.body.removeChild(tempDiv);

      const resizeObserver = new ResizeObserver(() => {
        // Re-run measurement on resize
        const newTempDiv = document.createElement('div');
        newTempDiv.style.visibility = 'hidden';
        newTempDiv.style.position = 'absolute';
        newTempDiv.style.width = `${textRef.current.clientWidth}px`;
        newTempDiv.style.fontSize = getComputedStyle(textRef.current).fontSize;
        newTempDiv.style.lineHeight = getComputedStyle(textRef.current).lineHeight;
        newTempDiv.style.padding = getComputedStyle(textRef.current).padding;
        newTempDiv.style.margin = getComputedStyle(textRef.current).margin;
        newTempDiv.style.fontFamily = getComputedStyle(textRef.current).fontFamily;
        newTempDiv.style.fontWeight = getComputedStyle(textRef.current).fontWeight;
        newTempDiv.style.whiteSpace = getComputedStyle(textRef.current).whiteSpace;
        newTempDiv.innerHTML = message;
        document.body.appendChild(newTempDiv);

        if (newTempDiv.scrollHeight > targetHeight) {
          setShowShowMoreButton(true);
        } else {
          setShowShowMoreButton(false);
        }
        document.body.removeChild(newTempDiv);
      });

      resizeObserver.observe(textRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [message]); // Re-run effect when message changes

  const handleShowMoreClick = () => {
    if (onShowMore) {
      onShowMore({ img, name, title, message, company, id: name + title });
    }
  };

  return (
    <motion.figure
      layoutId={name + title}
      className={cn(
        "relative max-w-md mx-auto h-full flex flex-col justify-between cursor-pointer rounded-2xl border p-6 transition-all duration-300 ease-in-out",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] shadow-lg hover:shadow-xl",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15] dark:shadow-lg dark:hover:shadow-xl",
        hideOriginal ? "opacity-0" : "opacity-100"
      )}
      style={hideOriginal ? { pointerEvents: "none" } : {}}
    >
      <blockquote ref={textRef} className="mt-2 text-base flex-grow overflow-hidden">
        {showShowMoreButton ? truncatedMessage : message}
        {showShowMoreButton && (
          <button
            onClick={handleShowMoreClick}
            className="text-blue-400 hover:underline ml-1 focus:outline-none"
          >
            Show More
          </button>
        )}
      </blockquote>
      <div className="flex flex-row items-center gap-3 mt-4 pt-4 border-t border-gray-950/[.1] dark:border-gray-50/[.1]">
        <img className="rounded-full w-12 h-12 object-cover border border-gray-950/[.1] dark:border-gray-50/[.1]" width="48" height="48" alt={name} src={img || "/9720009.jpg"} loading="lazy" />
        <div className="flex flex-col">
          <figcaption className="text-lg font-semibold text-white">
            {name}
          </figcaption>
          <p className="text-sm font-medium text-white/60">{title || "Customer"} of {company || "Our Company"} </p>
        </div>
      </div>
    </motion.figure>
  );
};

export default ReviewCard;