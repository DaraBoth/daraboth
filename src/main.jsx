import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import './serviceWorkerRegistration'; // Import the service worker registration

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
