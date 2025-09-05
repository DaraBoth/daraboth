import React, { useEffect, useState } from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { TypeAnimation } from "react-type-animation";
import axios from "axios";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt className="xs:w-[280px] w-full group">
    <motion.div
      variants={fadeIn("up", "spring", index * 0.2, 0.75)}
      className="relative w-full h-full"
    >
      {/* Enhanced Glass Card with Layered Effects */}
      <div className="relative glass-card-interactive rounded-3xl p-[2px] bg-gradient-to-br from-[#915EFF]/30 via-transparent to-[#804dee]/30 hover:from-[#915EFF]/50 hover:to-[#804dee]/50 transition-all duration-500">
        <div className="glass-primary rounded-3xl py-8 px-6 min-h-[320px] flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden">

          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#915EFF]/10 to-transparent rounded-full blur-xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#804dee]/10 to-transparent rounded-full blur-lg" />

          {/* Icon Container with Enhanced Effects */}
          <motion.div
            whileHover={{
              scale: 1.1,
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.5 }
            }}
            className="relative"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#915EFF]/20 to-[#804dee]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-[#915EFF]/25 transition-all duration-300">
              <img
                src={icon}
                alt={title}
                className="w-12 h-12 object-contain filter brightness-110"
              />
            </div>

            {/* Floating Particles Effect */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#915EFF] rounded-full opacity-60 animate-pulse" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#804dee] rounded-full opacity-40 animate-pulse delay-300" />
          </motion.div>

          {/* Enhanced Title */}
          <motion.h3
            whileHover={{ scale: 1.05 }}
            className="text-white text-xl font-bold leading-tight relative z-10"
          >
            {title}
          </motion.h3>

          {/* Subtle Description Line */}
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#915EFF] to-transparent opacity-60" />

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#915EFF]/5 via-transparent to-[#804dee]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
        </div>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <div className="relative max-w-7xl mx-auto">
      {/* Enhanced Section Header */}
      <div className="text-center mb-16">
        <motion.div variants={textVariant()}>
          <p className={`${styles.sectionSubText} text-[#915EFF] mb-4`}>Introduction</p>
          <h2 className={`${styles.sectionHeadText} mb-8`}>
            Overview<span className="text-[#915EFF]">.</span>
          </h2>
        </motion.div>

        {/* Enhanced Description Container */}
        <motion.div
          variants={fadeIn("up", "", 0.1, 1)}
          className="relative max-w-4xl mx-auto"
        >
          <div className="glass-primary rounded-3xl p-8 lg:p-12 backdrop-blur-xl border border-white/20 shadow-2xl">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-[#915EFF]/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-tl from-[#804dee]/10 to-transparent rounded-full blur-2xl" />

            <div className="relative z-10">
              <OpenAiChat
                text={
                  `Write a greeting like this for me.
                    | Hi everyone, my name is DaraBoth.
                    | I'm a passionate software engineer with experience in both front-end and back-end development.
                    | Throughout my career, I've honed my skills in a variety of technologies,
                    | including JavaScript frameworks like AngularJS, Next.js, and React.js, along with libraries like jQuery.
                    | For back-end development, I've utilized frameworks such as Express.js and Spring Boot with JPA, as well as templating languages like JSP and Flask.
                    | Additionally, I possess strong database management skills, having worked extensively with PostgreSQL and MySQL.
                  Make it more friendly ,professional, funny and kind and please response as Text. `
                }
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Services Grid */}
      <motion.div
        variants={fadeIn("up", "", 0.3, 1)}
        className="relative"
      >
        {/* Section Subtitle */}
        <div className="text-center mb-12">
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            What I Do<span className="text-[#915EFF]">.</span>
          </h3>
          <div className="w-24 h-1 bg-gradient-to-r from-[#915EFF] to-[#804dee] mx-auto rounded-full" />
        </div>

        {/* Enhanced Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.title} index={index} {...service} />
          ))}
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-[#915EFF]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-gradient-to-tl from-[#804dee]/5 to-transparent rounded-full blur-2xl" />
      </motion.div>
    </div>
  );
};

export const OpenAiChat = ({ text }) => {
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const about = localStorage.getItem("about");

  useEffect(() => {
    async function getChat() {
      try {
        setLoading(true);
        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://tinynotie-api.vercel.app/openai/text",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: { text: text },
        };
        axios
          .request(config)
          .then((response) => {
            localStorage.setItem("about", response.data?.text);
            setApiResponse(response.data?.text);
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            setApiResponse(about);
            console.log(error);
          });
      } catch (e) {
        setApiResponse(about);
        console.log(e);
      }
    }


    if (about) {
      getChat()
      // setLoading(true);
      // setTimeout(() => {
      //   setApiResponse(about);
      //   setLoading(false);
      // }, 1000);
    } else {
      getChat();
    }
  }, []);

  return (
    !loading && <p>{apiResponse}</p>
  );
  // return (
  //   !loading && (
  //     <TypeAnimation
  //       sequence={["" + apiResponse]}
  //       wrapper="p"
  //       cursor={true}
  //       speed={70}
  //       repeat={0}
  //     />
  //   )
  // );
};

export default SectionWrapper(About, "about");
