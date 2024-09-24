import "../../src/index.css";

export const metadata = {
  title: "DaraBoth",
  description:
    "by Vong Pich Daraboth | Software Engineer | Full Stack Developer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/png" href="/profileicon.png" />
        <link rel="apple-touch-icon" type="image/png" href="/profile.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <meta name="google-adsense-account" content="ca-pub-3856854469847678" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3856854469847678"
          crossOrigin="anonymous"
        ></script>
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
