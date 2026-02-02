import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { toast } from "sonner";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.warning`Please fill all the information first!`;
      return;
    }
    setLoading(true);
    emailjs
      .send(
        "service_0bc6sgs",
        "template_nw1vp7x",
        {
          from_name: form.name,
          to_name: "Vong Pich Daraboth",
          from_email: form.email,
          to_email: "vongpichdarabot@gmail.com",
          message: form.message,
        },
        "FTfXkTunMtI_tIlGC"
      )
      .then(
        () => {
          setLoading(false);
          toast.success(`Thanks you I will get back to you soon.`)
          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          toast.warning("Ahh, something went wrong. Please try again.");
        }
      );
  };

  return (
    <div className="relative max-w-7xl mx-auto">
      {/* Enhanced Section Header */}
      <div className="text-center mb-16">
        <motion.div variants={slideIn("up", "tween", 0.1, 1)}>
          <p className={`${styles.sectionSubText} text-[#915EFF] mb-4`}>
            Let's Connect
          </p>
          <h2 className={`${styles.sectionHeadText} mb-8`}>
            Get In Touch<span className="text-[#915EFF]">.</span>
          </h2>
        </motion.div>

        {/* Contact Description */}
        <motion.p
          variants={slideIn("up", "tween", 0.2, 1)}
          className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed"
        >
          Have a project in mind or just want to chat about technology?
          I'd love to hear from you. Drop me a message and I'll get back to you as soon as possible.
        </motion.p>
      </div>

      {/* Enhanced Contact Container */}
      <div className="flex xl:flex-row flex-col-reverse gap-12 lg:gap-16">

        {/* Enhanced Contact Form */}
        <motion.div
          variants={slideIn("left", "tween", 0.3, 1)}
          className="flex-[0.75] relative"
        >
          {/* Form Container with Enhanced Glass Effect */}
          <div className="relative glass-contact-form rounded-3xl p-8 lg:p-12 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-white/8 to-white/5 border border-white/20 shadow-2xl overflow-hidden">

            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#915EFF]/10 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#804dee]/10 to-transparent rounded-full blur-xl" />

            {/* Form Content */}
            <div className="relative z-10">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                {/* Enhanced Form Fields */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="group"
                  >
                    <label className="block text-white font-semibold text-lg mb-3 group-focus-within:text-[#915EFF] transition-colors duration-300">
                      Your Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="What's your good name?"
                        className="w-full glass-input text-white font-medium text-lg rounded-2xl p-4 pl-12 backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 focus:border-[#915EFF]/50 focus:shadow-lg focus:shadow-[#915EFF]/25 transition-all duration-300 placeholder:text-white/50"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gradient-to-r from-[#915EFF] to-[#804dee] rounded-full opacity-60" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="group"
                  >
                    <label className="block text-white font-semibold text-lg mb-3 group-focus-within:text-[#915EFF] transition-colors duration-300">
                      Your Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="What's your web address?"
                        className="w-full glass-input text-white font-medium text-lg rounded-2xl p-4 pl-12 backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 focus:border-[#915EFF]/50 focus:shadow-lg focus:shadow-[#915EFF]/25 transition-all duration-300 placeholder:text-white/50"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gradient-to-r from-[#915EFF] to-[#804dee] rounded-full opacity-60" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="group"
                  >
                    <label className="block text-white font-semibold text-lg mb-3 group-focus-within:text-[#915EFF] transition-colors duration-300">
                      Your Message
                    </label>
                    <div className="relative">
                      <textarea
                        rows={6}
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="What would you like to discuss?"
                        className="w-full glass-textarea text-white font-medium text-lg rounded-2xl p-4 pl-12 pt-4 backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 focus:border-[#915EFF]/50 focus:shadow-lg focus:shadow-[#915EFF]/25 transition-all duration-300 placeholder:text-white/50 resize-none"
                      />
                      <div className="absolute left-4 top-4 w-5 h-5 bg-gradient-to-r from-[#915EFF] to-[#804dee] rounded-full opacity-60" />
                    </div>
                  </motion.div>
                </div>

                {/* Enhanced Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-center pt-4"
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="glass-button px-12 py-4 text-white font-bold text-lg rounded-2xl backdrop-blur-xl bg-gradient-to-r from-[#915EFF]/30 to-[#804dee]/20 border border-[#915EFF]/40 hover:from-[#915EFF]/40 hover:to-[#804dee]/30 hover:border-[#915EFF]/60 hover:shadow-lg hover:shadow-[#915EFF]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span>Send Message</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                    )}
                  </button>
                </motion.div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Enhanced 3D Earth Canvas */}
        <motion.div
          variants={slideIn("right", "tween", 0.3, 1)}
          className="xl:flex-1 relative"
        >
          <div className="relative xl:h-[550px] md:h-[500px] h-[400px] rounded-3xl overflow-hidden glass-secondary backdrop-blur-xl border border-white/20 shadow-2xl">
            <EarthCanvas />

            {/* Overlay with Contact Info */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="glass-tertiary rounded-2xl p-4 backdrop-blur-md border border-white/20">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Available for new projects</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-[#915EFF]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gradient-to-tl from-[#804dee]/5 to-transparent rounded-full blur-2xl" />
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
