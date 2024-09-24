"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import NumberTicker from "./magic-ui/NumberTicker";
import moment from "moment/moment";

const VisitorTracker = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);

  const apiEndpoint = "https://tinynotie-api.vercel.app/daraboth/track-visitor";

  useEffect(() => {
    const handleAddVisitor = async () => {
      try {
        setLoading(true); // Show loading state
        const visitorData = {
          visitedRoute: "/vongpichdaraboth",
          visit_time: moment().format("YYYY-MM-DD HH:mm:ss"),
        };

        const response = await axios.post(apiEndpoint, visitorData);
        if (response.status !== 200) {
          setError("Error adding visitor.");
        }
      } catch (err) {
        setError("Error adding visitor.");
      }
    };

    const fetchVisitors = async () => {
      try {
        const response = await axios.get(
          `${apiEndpoint}?visitedRoute=/vongpichdaraboth`
        );
        setCount(response.data.data[0].visitor_count);
      } catch (err) {
        setError("Error fetching visitors.");
      }
    };

    const runSequentially = async () => {
      await handleAddVisitor(); // Run POST first
      await fetchVisitors(); // Run GET after POST
      setLoading(false); // Turn off loading state
    };

    runSequentially();
  }, [apiEndpoint]);

  return (
    <div
      className={`z-50 fixed bottom-5 left-5 p-2 rounded-lg shadow-lg ${count <= 0 && "hidden"}`}
    >
      <NumberTicker value={count} /> visitor{count > 1 && "s"}
    </div>
  );
};

export default VisitorTracker;
