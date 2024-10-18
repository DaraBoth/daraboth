// src/components/Hero.jsx

import { motion } from "framer-motion";
import { styles } from "../styles";
// import GojoCanvas from "./canvas/GojoCanvas";
import ComputersCanvas from "./canvas/Computers";
import { TypeAnimation } from "react-type-animation";
import RetroGrid from "./magic-ui/RetroGrid";

const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto">
      <div
        className={`absolute inset-0 top-[180px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#ffb6c1]" />
          <div className="w-1 sm:h-80 h-40 pink-gradient" />
        </div>

        <div>
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm{" "}
            <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-6x1 font-bold leading-none tracking-tighter text-transparent">
              DaraBoth
            </span>
          </h1>
          <TypeAnimation
            sequence={[
              "I’m a software engineer who builds websites that don’t just look good but work like magic. My code is clean, efficient, and, on rare occasions, it even behaves. I live for solving problems and making the web a more beautiful place. When I’m not coding, I’m probably debugging... because let’s be real, that’s half the job. Let’s create something amazing together!",
            ]}
            wrapper="p"
            cursor={true}
            speed={70}
            repeat={1}
            className={`${styles.heroSubText} mt-2 text-white-100`}
          />
          {/* <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            I am a skilled software engineer <br className="sm:block hidden" />I
            develop websites.
          </p> */}
        </div>
      </div>

      <RetroGrid />
      {/* <ComputersCanvas /> */}
      {/* <GojoCanvas /> */}

      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
