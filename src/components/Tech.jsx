import React from "react";
import { motion } from "framer-motion";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";

const TechBall = ({ technology, index }) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.1, 0.75)}
      className="w-28 h-28"
    >
      <BallCanvas icon={technology.icon} />
    </motion.div>
  );
};

const Tech = () => {
  return (
    <div className="relative max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <motion.div variants={textVariant()}>
          <p className={`${styles.sectionSubText} text-[#915EFF] mb-4`}>Technologies I Work With</p>
          <h2 className={`${styles.sectionHeadText} mb-8`}>
            Tech Stack<span className="text-[#915EFF]">.</span>
          </h2>
        </motion.div>
      </div>

      {/* Tech Balls Container */}
      <div className="flex flex-wrap justify-center gap-10">
        {technologies.map((technology, index) => (
          <TechBall key={technology.name} technology={technology} index={index} />
        ))}
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-[#915EFF]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gradient-to-tl from-[#804dee]/5 to-transparent rounded-full blur-2xl" />

      {/* Floating Background Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5
          }}
          className={`absolute w-2 h-2 bg-[#915EFF] rounded-full`}
          style={{
            top: `${20 + i * 10}%`,
            left: `${10 + i * 15}%`,
          }}
        />
      ))}
    </div>
  );
};

export default SectionWrapper(Tech, "");
