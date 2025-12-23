import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";

const TechBall = ({ technology, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.1, 0.75)}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Glass Container with Dynamic Effects */}
      <motion.div
        whileHover={{
          scale: 1.1,
          rotateY: 15,
          zIndex: 50
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        className="relative w-32 h-32 lg:w-36 lg:h-36"
      >
        {/* Outer Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#915EFF]/20 to-[#804dee]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Main Glass Container */}
        <div className="relative glass-tech-card rounded-3xl p-3 backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/20 shadow-2xl overflow-hidden">

          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-[#915EFF]/20 to-transparent rounded-full blur-sm" />
          <div className="absolute bottom-0 left-0 w-6 h-6 bg-gradient-to-tr from-[#804dee]/20 to-transparent rounded-full blur-sm" />

          {/* 3D Ball Canvas */}
          <div className="relative z-10 w-full h-full">
            <BallCanvas icon={technology.icon} />
          </div>

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-br from-[#915EFF]/10 via-transparent to-[#804dee]/10 rounded-3xl"
          />
        </div>

        {/* Technology Name Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10
          }}
          transition={{ duration: 0.3 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
        >
          <div className="glass-secondary px-3 py-1 rounded-lg backdrop-blur-md border border-white/20">
            <span className="text-white text-sm font-medium">{technology.name}</span>
          </div>
        </motion.div>

        {/* Floating Particles */}
        <motion.div
          animate={{
            y: [-5, 5, -5],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2
          }}
          className="absolute -top-2 -right-2 w-2 h-2 bg-[#915EFF] rounded-full"
        />
        <motion.div
          animate={{
            y: [5, -5, 5],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.3
          }}
          className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-[#804dee] rounded-full"
        />
      </motion.div>
    </motion.div>
  );
};

const Tech = () => {
  const [arrangement, setArrangement] = useState('grid');

  useEffect(() => {
    const interval = setInterval(() => {
      setArrangement(prev => prev === 'grid' ? 'circle' : 'grid');
    }, 15000); // Change arrangement every 15 seconds (reduced frequency)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto">
      {/* Enhanced Section Header */}
      <div className="text-center mb-16">
        <motion.div variants={textVariant()}>
          <p className={`${styles.sectionSubText} text-[#915EFF] mb-4`}>Technologies I Work With</p>
          <h2 className={`${styles.sectionHeadText} mb-8`}>
            Tech Stack<span className="text-[#915EFF]">.</span>
          </h2>
        </motion.div>

        {/* Arrangement Toggle */}
        <motion.div
          variants={fadeIn("up", "", 0.2, 1)}
          className="flex justify-center mb-12"
        >
          <div className="glass-secondary rounded-2xl p-1 backdrop-blur-md border border-white/20">
            <button
              onClick={() => setArrangement('grid')}
              className={`px-6 py-2 rounded-xl transition-all duration-300 ${
                arrangement === 'grid'
                  ? 'glass-accent text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setArrangement('circle')}
              className={`px-6 py-2 rounded-xl transition-all duration-300 ${
                arrangement === 'circle'
                  ? 'glass-accent text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Circle View
            </button>
          </div>
        </motion.div>
      </div>

      {/* Stabilized Tech Balls Container */}
      <div className="relative min-h-[600px] flex items-center justify-center">
        <motion.div
          layout
          className={`relative w-full max-w-6xl transition-all duration-1000 ${
            arrangement === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 lg:gap-12 justify-items-center'
              : 'grid grid-cols-6 grid-rows-3 gap-8 justify-items-center items-center'
          }`}
          style={arrangement === 'circle' ? {
            transform: 'perspective(1000px) rotateX(5deg)',
            minHeight: '500px'
          } : {
            minHeight: '500px'
          }}
        >
        {technologies.map((technology, index) => (
          <motion.div
              key={technology.name}
              layout="position"
              transition={{
                delay: index * 0.05
              }}
            style={arrangement === 'circle' ? {
              gridColumn: `${(index % 6) + 1}`,
              gridRow: `${Math.floor(index / 6) + 1}`,
              transform: `translateZ(${Math.sin(index * 0.5) * 50}px) rotateY(${index * 15}deg)`,
            } : {}}
          >
            <TechBall technology={technology} index={index} />
          </motion.div>
        ))}
        </motion.div>
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
