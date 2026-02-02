import React, { useState } from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.2, 0.75)}
      className="group"
    >
      <Tilt
        options={{
          max: 25,
          scale: 1.02,
          speed: 450,
        }}
        className="w-full max-w-[400px] mx-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Enhanced Project Card Container */}
        <div className="relative glass-project-card rounded-3xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/12 via-white/8 to-white/5 border border-white/20 shadow-2xl transition-all duration-500 group-hover:shadow-[#915EFF]/25">

          {/* Image Container with Enhanced Effects */}
          <div className="relative w-full h-[280px] overflow-hidden">
            <motion.img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              whileHover={{ scale: 1.05 }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Enhanced Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 20
              }}
              transition={{ duration: 0.3 }}
              className="absolute top-4 right-4 flex gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open(source_code_link, "_blank")}
                className="glass-button p-3 w-12 h-12 rounded-2xl flex justify-center items-center cursor-pointer backdrop-blur-md border border-white/30 shadow-lg"
              >
                <img
                  src={github}
                  alt="source code"
                  className="w-6 h-6 object-contain filter brightness-110"
                />
              </motion.div>

              {/* Live Demo Button (if available) */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open(source_code_link, "_blank")}
                className="glass-button-secondary p-3 w-12 h-12 rounded-2xl flex justify-center items-center cursor-pointer backdrop-blur-md border border-white/30 shadow-lg"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </motion.div>
            </motion.div>

            {/* Project Index Badge */}
            <div className="absolute top-4 left-4">
              <div className="glass-accent w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-[#915EFF]/30">
                <span className="text-white font-bold text-sm">{String(index + 1).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          {/* Enhanced Content Section */}
          <div className="p-6 space-y-4">
            {/* Project Title */}
            <motion.h3
              className="text-white font-bold text-xl lg:text-2xl leading-tight group-hover:text-[#915EFF] transition-colors duration-300"
              whileHover={{ x: 5 }}
            >
              {name}
            </motion.h3>

            {/* Project Description */}
            <p className="text-white/80 text-base leading-relaxed">
              {description}
            </p>

            {/* Enhanced Tags Section */}
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag, tagIndex) => (
                <motion.div
                  key={`${name}-${tag.name}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: tagIndex * 0.1 }}
                  className="glass-tertiary px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10"
                >
                  <span className={`text-sm font-medium ${tag.color}`}>
                    #{tag.name}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-[#915EFF]/10 to-transparent rounded-full blur-xl" />
            <div className="absolute top-1/2 left-0 w-16 h-16 bg-gradient-to-br from-[#804dee]/10 to-transparent rounded-full blur-lg" />
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-br from-[#915EFF]/5 via-transparent to-[#804dee]/5 rounded-3xl pointer-events-none"
          />
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  const [filter, setFilter] = useState('all');

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(project =>
      project.tags.some(tag => tag.name.toLowerCase().includes(filter.toLowerCase()))
    );

  const categories = ['all', 'react', 'angular', 'nextjs', 'pwa'];

  return (
    <div className="relative max-w-7xl mx-auto">
      {/* Enhanced Section Header */}
      <div className="text-center mb-16">
        <motion.div variants={textVariant()}>
          <p className={`${styles.sectionSubText} text-[#915EFF] mb-4`}>
            Portfolio Showcase
          </p>
          <h2 className={`${styles.sectionHeadText} mb-8`}>
            Featured Projects<span className="text-[#915EFF]">.</span>
          </h2>
        </motion.div>

        {/* Enhanced Description */}
        <motion.div
          variants={fadeIn("up", "", 0.1, 1)}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="glass-secondary rounded-3xl p-8 backdrop-blur-xl border border-white/20 shadow-2xl">
            <p className="text-white/90 text-lg leading-relaxed">
              Following projects showcase my skills and experience through
              real-world examples of my work. Each project is briefly described with
              links to code repositories and live demos. It reflects my
              ability to solve complex problems, work with different technologies,
              and manage projects effectively.
            </p>
          </div>
        </motion.div>

        {/* Project Filter */}
        <motion.div
          variants={fadeIn("up", "", 0.2, 1)}
          className="flex justify-center mb-12"
        >
          <div className="glass-secondary rounded-2xl p-2 backdrop-blur-md border border-white/20 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-xl transition-all duration-300 capitalize font-medium ${filter === category
                    ? 'glass-accent text-white shadow-lg shadow-[#915EFF]/25'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Projects Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
      >
        {filteredProjects.map((project, index) => (
          <motion.div
            key={`project-${project.name}`}
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              layout: { duration: 0.3 }
            }}
          >
            <ProjectCard index={index} {...project} />
          </motion.div>
        ))}
      </motion.div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-[#915EFF]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gradient-to-tl from-[#804dee]/5 to-transparent rounded-full blur-2xl" />

      {/* Floating Background Particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2
          }}
          className={`absolute w-2 h-2 bg-[#915EFF] rounded-full`}
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
          }}
        />
      ))}
    </div>
  );
};

export default SectionWrapper(Works, "");
