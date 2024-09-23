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
          //   console.warn("Error adding visitor. Status code:", response.status); // Log warning but don't throw
          setError("Error adding visitor.");
        } else {
          //   console.log("Visitor added successfully.");
        }
      } catch (err) {
        setError("Error adding visitor.");
        // console.error("Error in POST request:", err);
      }
    };

    const fetchVisitors = async () => {
      try {
        const response = await axios.get(
          `${apiEndpoint}?visitedRoute=/vongpichdaraboth`
        );
        setCount(response.data[0].visitor_count);
        // console.log("Fetched visitors:", response.data[0].visitor_count);
      } catch (err) {
        setError("Error fetching visitors.");
        // console.error("Error in GET request:", err);
      }
    };

    const runSequentially = async () => {
      await handleAddVisitor(); // Run POST first, handle errors internally
      await fetchVisitors(); // Run GET after POST, regardless of POST result
      setLoading(false); // Turn off loading state
    };

    runSequentially();
  }, [apiEndpoint]);

  return (
    <div className="z-50 fixed bottom-5 right-5 bg-white p-4 rounded-lg shadow-lg w-72">
      <h3 className="text-lg font-semibold mb-3">{count}Visitors</h3>

      {loading && <ClipLoader size={30} color="#4A90E2" />}
    </div>
  );
};

export default VisitorTracker;
