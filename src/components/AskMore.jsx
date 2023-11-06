import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { BallCanvas, ComputersCanvas, EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { TypeAnimation } from "react-type-animation";
import axios from "axios";

const AskMore = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    message: "",
    answer: "",
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
    setLoading(true);
    setForm({ ...form, answer: "" });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://tinynotie-api.vercel.app/openai/ask",
      //   url: "http://localhost:9000/openai/ask",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: { text: form.message },
    };
    axios
      .request(config)
      .then((response) => {
        setForm({ ...form, answer: response.data?.text });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setForm({
          ...form,
          answer: "There are too many request please wait abit and try again.",
        });
        console.log(error?.message);
      });
  };

  return (
    <div
      className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[1] bg-black-100 p-8 rounded-2xl"
      >
        <h3 className={styles.sectionHeadText}>Ask More</h3>
        <p className={styles.sectionSubText}>
          Ask anything about me in real time
        </p>
        {!!form.answer && (
          <TypeAnimation
            sequence={["" + form.answer]}
            wrapper="p"
            cursor={true}
            className={{ ...styles.sectionSubText2 }}
            speed={70}
            repeat={0}
          />
        )}

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-12 flex flex-col gap-8"
        >
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Question</span>
            <textarea
              rows={5}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What you want to say?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
            />
          </label>

          <button
            type="submit"
            className="bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary"
          >
            {loading ? "Answering..." : "Ask"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(AskMore, "askmore");
