import React from "react";
import ReactDOM from "react-dom/client";
import * as serviceWorker from '../public/sw.js';

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);