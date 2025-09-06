import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/png" href="/profileicon.png" />
        <link rel="apple-touch-icon" type="image/png" href="/profile.png" />
        <meta name="google-adsense-account" content="ca-pub-3856854469847678" />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3856854469847678" 
          crossOrigin="anonymous"
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
