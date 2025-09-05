import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const ExperienceCard = ({ experience, index }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "1.5rem",
        boxShadow: "0 12px 40px rgba(31, 38, 135, 0.4)",
        color: "#fff",
        position: "relative",
        overflow: "hidden"
      }}
      contentArrowStyle={{
        borderRight: "10px solid rgba(255, 255, 255, 0.2)",
        filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))"
      }}
      date={experience.date}
      dateClassName="text-white font-semibold text-lg"
      iconStyle={{
        background: "linear-gradient(135deg, rgba(145, 94, 255, 0.3), rgba(128, 77, 238, 0.3))",
        backdropFilter: "blur(16px)",
        border: "3px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px rgba(145, 94, 255, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      icon={
        <div className='flex justify-center items-center w-full h-full relative'>
          {/* Icon Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#915EFF]/20 to-[#804dee]/20 rounded-full blur-sm" />
          <img
            src={experience.icon}
            alt={experience.company_name}
            className='w-[70%] h-[70%] object-contain relative z-10 filter brightness-110'
          />
        </div>
      }
    >
      <div className="relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#915EFF]/10 to-transparent rounded-full blur-xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#804dee]/10 to-transparent rounded-full blur-lg" />

        {/* Header Section */}
        <div className="relative z-10 mb-6">
          <h3 className='text-white text-2xl font-bold mb-2 leading-tight'>
            {experience.title}
          </h3>
          <div className="flex items-center gap-3 mb-3">
            <p className='text-[#915EFF] text-lg font-semibold'>
              {experience.company_name}
            </p>
            <div className="w-2 h-2 bg-[#915EFF] rounded-full animate-pulse" />
          </div>

          {/* Decorative Line */}
          <div className="w-16 h-[2px] bg-gradient-to-r from-[#915EFF] to-[#804dee] rounded-full" />
        </div>

        {/* Experience Points */}
        <div className="relative z-10">
          <ul className='space-y-4'>
            {experience.points.map((point, pointIndex) => (
              <li
                key={`experience-point-${pointIndex}`}
                className='flex items-start gap-3 text-white-100 text-base leading-relaxed'
              >
                <div className="w-2 h-2 bg-gradient-to-r from-[#915EFF] to-[#804dee] rounded-full mt-2 flex-shrink-0" />
                <span className="tracking-wide">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#915EFF]/5 via-transparent to-[#804dee]/5 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
      </div>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  return (
    <div className="relative max-w-7xl mx-auto">
      {/* Enhanced Section Header */}
      <div className="text-center mb-20">
        <motion.div variants={textVariant()}>
          <p className={`${styles.sectionSubText} text-[#915EFF] mb-4`}>
            My Professional Journey
          </p>
          <h2 className={`${styles.sectionHeadText} mb-8`}>
            Work Experience<span className="text-[#915EFF]">.</span>
          </h2>
        </motion.div>

        {/* Decorative Line */}
        <div className="w-32 h-1 bg-gradient-to-r from-[#915EFF] to-[#804dee] mx-auto rounded-full" />
      </div>

      {/* Enhanced Timeline Container */}
      <div className='relative'>
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-[#915EFF]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gradient-to-tl from-[#804dee]/5 to-transparent rounded-full blur-2xl" />

        {/* Timeline */}
        <VerticalTimeline
          lineColor="rgba(145, 94, 255, 0.3)"
        >
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
              index={index}
            />
          ))}
        </VerticalTimeline>
      </div>
    </div>
  );
};

export default SectionWrapper(Experience, "work");
