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
  <Tilt className="xs:w-[250px] w-full">
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
    >
      <motion.div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col"
      >
        <img
          src={icon}
          alt="web-development"
          className="w-16 h-16 object-contain"
        />

        <h3 className="text-white text-[20px] font-bold text-center">
          {title}
        </h3>
      </motion.div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.div
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        <OpenAiChat
          text={
            "Please write and introduction about me. My name's DaraBoth.I'm male. I'm a software engineer and Full stack web developer I used to work with AngularJS, Next.js, React.js, JavaScript, and jQuery on frontend and backend I used to use Express.js, Spring Boot with JPA, JSP, and Flask and about SQL I used to use PostgreSQL and MySQL. Please write and Introduction about me in a professional way."
          }
        />
      </motion.div>

      <div className="mt-20 flex flex-wrap gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export const OpenAiChat = ({ text }) => {
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(false);
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
            console.log(error);
          });
      } catch (e) {
        console.log(e);
      }
    }

    const about = localStorage.getItem("about");

    if (about) {
      setLoading(true);
      setTimeout(() => {
        setApiResponse(about);
        setLoading(false);
      }, 1000);
    } else {
      getChat();
    }
  }, []);

  return (
    !loading && (
      <TypeAnimation
        sequence={["" + apiResponse]}
        wrapper="p"
        cursor={true}
        speed={70}
        repeat={0}
      />
    )
  );
};

export default SectionWrapper(About, "about");
