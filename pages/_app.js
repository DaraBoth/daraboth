import React from 'react';
import { HelmetProvider } from "react-helmet-async";
import "../styles/globals.css";

// Service worker registration can be added later if needed

function MyApp({ Component, pageProps }) {
  return (
    <HelmetProvider>
      <Component {...pageProps} />
    </HelmetProvider>
  );
}

export default MyApp;
