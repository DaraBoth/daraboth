import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { TypeAnimation } from "react-type-animation";
import axios from "axios";
import { toast } from "sonner";
import { marked, options } from "marked";
import DOMPurify from "dompurify";

import Markdown from "react-markdown";

const AskMore = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    message: "",
    answer: "",
  });
  const [loading, setLoading] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState(5);
  const [today, setToday] = useState(new Date());

  const resetQuestionLimit = () => {
    setRemainingQuestions(5);
    localStorage.setItem("remainingQuestions", 5);
    localStorage.setItem("today", today);
    setToday(new Date());
  };

  useEffect(() => {
    const storedRemainingQuestions = localStorage.getItem("remainingQuestions");
    const lastDate = localStorage.getItem("today");
    if (storedRemainingQuestions) {
      setRemainingQuestions(parseInt(storedRemainingQuestions));
    }
    if (!lastDate) {
      localStorage.setItem("today", today);
    } else if (isMoreThanADay(today, new Date(lastDate))) {
      toast.success("Welcome back. Your question has been reset! 😍", {
        duration: 5000,
      });
      resetQuestionLimit();
    }
  }, []);

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

    // if (remainingQuestions <= 0) {
    //   setTimeout(() => {
    //     setForm({
    //       ...form,
    //       answer: "You have reached your daily question limit for today. 🫰",
    //     });
    //     setLoading(false);
    //     toast("You have reached your daily question limit for today. 🫰", {
    //       duration: 5000,
    //     });
    //   }, 1000);
    //   return;
    // }

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://tinynotie-api.vercel.app/openai/ask",
      // url: "http://localhost:9000/openai/ask",
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
        // setRemainingQuestions(remainingQuestions - 1);
        // localStorage.setItem("remainingQuestions", remainingQuestions - 1);
      })
      .catch((error) => {
        setLoading(false);
        setForm({
          ...form,
          answer:
            "There are too many requests. Please wait a bit and try again.",
        });
        toast.warning(
          "There are too many requests. Please wait a bit and try again.",
          {
            duration: 3000,
          }
        );
        // console.log(error?.message);
      })
      .finally((fnl) => {});
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
        <br />
        {/* {!!form.answer && (
          <TypeAnimation
            sequence={["" + marked.parse(form.answer)]}
            role="document"
            wrapper="p"
            cursor={true}
            className={{ ...styles.sectionSubText2 }}
            speed={70}
            repeat={0}
          />
        )} */}
        {!!form.answer && (
          <div
            className="sectionSubText2"
            dangerouslySetInnerHTML={{
              __html: sanitizeAnswer(form.answer),
            }}
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
            disabled={loading}
            type="submit"
            className="bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary"
          >
            {loading ? "Answering..." : `Ask`}
            {/* (${remainingQuestions}) */}
          </button>
        </form>
      </motion.div>
    </div>
  );
  function sanitizeAnswer(answer) {
    try {
      const cleanHtml = DOMPurify.sanitize(marked(answer));
      return cleanHtml;
    } catch (error) {
      console.error("Error rendering markdown:", error);
      return "Error rendering content.";
    }
  }
};

export default SectionWrapper(AskMore, "askmore");

function isMoreThanADay(dateA, dateB) {
  // Get the timestamps of the two dates
  const dateATimestamp = dateA.getTime();
  const dateBTimestamp = dateB.getTime();

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = dateATimestamp - dateBTimestamp;

  // Convert the difference to days
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

  // Check if the difference is more than a day
  return differenceInDays > 0 && differenceInDays > 1;
}
