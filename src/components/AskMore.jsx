import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import axios from "axios";
import { toast } from "sonner";

const BAN_DURATION = 3 * 60 * 1000; // 3 minutes in milliseconds
const BAN_THRESHOLD = 10; // Number of attempts before ban
const SPAM_INTERVAL = 500; // Interval in milliseconds to consider as spam

const AskMore = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ message: "", answer: "" });
  const [loading, setLoading] = useState(false);
  const [banCount, setBanCount] = useState(0);
  const [banEndTime, setBanEndTime] = useState(null);
  const [lastSpamTime, setLastSpamTime] = useState(0);
  const [showingBannedAlert,setShowingBannedAlert] = useState(false);

  const answerChar = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 },
  };

  useEffect(() => {
    const lastDate = localStorage.getItem("today");

    if (!lastDate) {
      localStorage.setItem("today", new Date());
    } else if (isMoreThanADay(new Date(), new Date(lastDate))) {
      toast.success("Welcome back. Your question limit has been reset! 😍", { duration: 5000 });
      localStorage.setItem("today", new Date());
    }

    const storedBanEndTime = localStorage.getItem("banEndTime");
    if (storedBanEndTime && new Date(storedBanEndTime) > new Date()) {
      setBanEndTime(new Date(storedBanEndTime));
    }
  }, []);

  useEffect(() => {
    if (banEndTime) {
      const remainingBanTime = banEndTime.getTime() - new Date().getTime();
      if (remainingBanTime > 0) {
        const timer = setTimeout(() => {
          setBanCount(0);
          setBanEndTime(null);
          localStorage.removeItem("banEndTime");
          setShowingBannedAlert(false)
          toast.success("Congratulations! Now you are back... Let's behave well this time. ㄱㄱㄱㄱㄱㄱㄱ", { duration: 10000 });
        }, remainingBanTime);
        displayBanMessages(remainingBanTime);
        return () => clearTimeout(timer);
      } else {
        setBanCount(0);
        setBanEndTime(null);
        localStorage.removeItem("banEndTime");
      }
    }
  }, [banEndTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (banEndTime && new Date() < new Date(banEndTime)) {
      return; // Prevent submission during ban
    }

    setLoading(true);
    setForm({ ...form, answer: "" });

    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://tinynotie-api.vercel.app/openai/ask",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: { text: form.message, chatHistory },
    };

    try {
      const response = await axios.request(config);
      setForm({ ...form, answer: response.data?.text });
      saveOldChat(form.message, response.data?.text);
    } catch (error) {
      setForm({ ...form, answer: "There are too many requests. Please wait a bit and try again." });
      toast.warning("There are too many requests. Please wait a bit and try again.", { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === "Enter") {
      if (loading) {
        const now = Date.now();
        if (now - lastSpamTime < SPAM_INTERVAL) {
          incrementBanCount();
        }
        setLastSpamTime(now);
      } else {
        handleSubmit(event);
      }
    }
  };

  const incrementBanCount = () => {
    if (banCount < BAN_THRESHOLD) {
      setBanCount(banCount + 1);
      toast.warning("Chill daddy chill....", { duration: 3000 });
    } else {
      handleBan();
    }
  };

  const handleBan = () => {
    if(showingBannedAlert) return;
    const endTime = new Date(new Date().getTime() + BAN_DURATION);
    setBanEndTime(endTime);
    localStorage.setItem("banEndTime", endTime);
    toast.error("You are banned from asking for 3 minutes. Until this alert closes!",{ 
        duration: BAN_DURATION ,
        onclose:()=>{  
          if(showingBannedAlert) return;
        } 
    });
    displayBanMessages(BAN_DURATION);
    setShowingBannedAlert(true)
  };

  const displayBanMessages = (remainingBanTime) => {
    setTimeout(() => setForm({ ...form, answer: "Hasha my boss is mad you are getting banned right now. Please wait...." }), 60 * 1000);
    setTimeout(() => setForm({ ...form, answer: "1min and 20s more. Please wait hasha." }), 1.67 * 60 * 1000);
  };

  const saveOldChat = (chat, response) => {
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ role: "user", parts: [{ text: chat }] }, { role: "model", parts: [{ text: response }] });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  };

  const isMoreThanADay = (dateA, dateB) => {
    const differenceInMilliseconds = dateA - dateB;
    return differenceInMilliseconds > 1000 * 60 * 60 * 24;
  };

  return (
    <div className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}>
      <motion.div variants={slideIn("left", "tween", 0.2, 1)} className="flex-[1] bg-black-100 p-8 rounded-2xl">
        <h3 className={styles.sectionHeadText}>Ask More</h3>
        <p className={styles.sectionSubText}>Ask anything about me in real time with AI</p>
        <br />

        {form.answer &&
          form.answer.split(" ").map((char, index) => (
            <motion.span
              key={index}
              variants={answerChar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.05 }}
              className="ml-1 inline-block"
            >
              {char}
            </motion.span>
          ))}

        <form ref={formRef} onSubmit={handleSubmit} className="mt-12 flex flex-col gap-8">
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Question</span>
            <textarea
              rows={5}
              name="message"
              value={form.message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="What you want to say?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium min-h[58px]"
            />
          </label>
          <div className="w-full flex flex-row justify-between gap-5">
            <button
              disabled={loading || (banEndTime && new Date() < new Date(banEndTime))}
              type="submit"
              className="bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary"
            >
              {loading ? "Answering..." : "Ask"}
            </button>
            <button
              onClick={() => setForm({ ...form, message: "" })}
              type="button"
              className="bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary"
            >
              Clear
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(AskMore, "askmore");
