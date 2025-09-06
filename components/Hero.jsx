import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";

const Hero = () => {
  return (
    <section className={`relative w-full h-screen mx-auto flex justify-center items-center overflow-hidden`}>
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-black-200 to-tertiary opacity-90" />

      {/* Main Content Container */}
      <div className={`relative z-10 max-w-7xl mx-auto ${styles.paddingX} flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 h-full`}>

        {/* Left Side - Decorative Line */}
        <div className="hidden lg:flex flex-col justify-center items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-6 h-6 rounded-full bg-gradient-to-r from-[#915EFF] to-[#804dee] shadow-lg shadow-[#915EFF]/50"
          />
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "20rem" }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="w-1 bg-gradient-to-b from-[#915EFF] via-[#804dee] to-transparent mt-4"
          />
        </div>

        {/* Center Content - Enhanced Glass Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative max-w-5xl w-full"
        >
          {/* Enhanced Glass Morphism Container */}
          <div className="relative glass-hero-content p-8 lg:p-12 rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 border border-white/20 shadow-2xl">
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-[#915EFF] to-[#804dee] rounded-full opacity-60 blur-sm" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#915EFF] to-[#804dee] rounded-full opacity-40 blur-md" />

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className={`${styles.heroHeadText} text-white mb-6 relative z-10`}
            >
              Hi, I'm{" "}
              <span className="bg-gradient-to-r from-[#915EFF] via-[#804dee] to-[#915EFF] bg-clip-text text-transparent animate-pulse">
                DaraBoth
              </span>
            </motion.h1>

            {/* Subtitle with Enhanced Typography */}
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className={`${styles.heroSubText} text-white-100 leading-relaxed relative z-10`}
            >
              I develop{" "}
              <span className="text-[#915EFF] font-semibold">3D visuals</span>,{" "}
              <span className="text-[#915EFF] font-semibold">user interfaces</span>{" "}
              <br className="sm:block hidden" />
              and{" "}
              <span className="text-[#915EFF] font-semibold">web applications</span>.
            </motion.p>

            {/* Call to Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 mt-8 relative z-10"
            >
              <a
                href="#about"
                className="glass-button text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#915EFF]/25"
              >
                Explore My Work
              </a>
              <a
                href="#contact"
                className="glass-button-secondary text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105"
              >
                Get In Touch
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Additional Decorative Elements */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-6">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-[#915EFF]/20 to-[#804dee]/20 border border-[#915EFF]/30 backdrop-blur-sm"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 0.9, 1]
            }}
            transition={{
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-[#804dee]/20 to-[#915EFF]/20 border border-[#804dee]/30 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-8 lg:bottom-16 w-full flex justify-center items-center"
      >
        <a href="#about" className="group">
          <div className="w-[40px] h-[70px] rounded-3xl border-2 border-white/40 glass-secondary flex justify-center items-start p-3 group-hover:border-[#915EFF]/60 transition-all duration-300">
            <motion.div
              animate={{
                y: [0, 28, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
              className="w-3 h-3 rounded-full bg-gradient-to-b from-[#915EFF] to-[#804dee] shadow-lg shadow-[#915EFF]/50"
            />
          </div>
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;