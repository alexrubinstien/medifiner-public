import React from 'react';
import Document, {
  Head,
  Main,
  NextScript,
} from 'next/document';
import htmlescape from 'htmlescape';

const {
  BACKEND_URL,
  MAPBOX_KEY,
} = process.env;
const env = {
  BACKEND_URL,
  MAPBOX_KEY,
};

export default class MyDocument extends Document {
  render() {

    return (
      <html lang="en">
        <Head>
          <link href='https://api.mapbox.com/mapbox-gl-js/v0.52.0/mapbox-gl.css' rel='stylesheet' />
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-132876685-1"></script>
          <script dangerouslySetInnerHTML={{__html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date()); gtag('config', 'UA-132876685-1');`}} />
          <script dangerouslySetInnerHTML={{__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-N43VKZW');`}} />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1" />
          <link
            href="https://fonts.googleapis.com/css?family=Barlow:400,400i,500,500i,600,700,700i"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
            integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="/_next/static/style.css"
          />
          <link
            href="https://api.mapbox.com/mapbox.js/v3.1.1/mapbox.css"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <script dangerouslySetInnerHTML={{ __html: `__ENV__ = ${htmlescape(env)}` }} />
          <NextScript />
        </body>
      </html>
    );
  }
}
