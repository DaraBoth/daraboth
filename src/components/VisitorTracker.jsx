import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

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
    <div className="z-50 fixed bottom-5 left-5 p-2 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg text-black font-semibold align-middle">
        {loading ? <ClipLoader  size={15} color="#000000" /> : count} visitors
      </h3>
    </div>
  );
};

export default VisitorTracker;
