import Head from 'next/head';
import '../styles/globals.css';

import { Footer } from '@components/ui/common';
import Web3Provider from '@components/web3';

// If layout is not set, return children in simple tags
const NoLayout = ({ children }) => <>{children}</>;

function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout ?? NoLayout;

  const meta = {
    title: 'Treasure Hunt Outdoors - Web3 Application Demo',
    description: `Full-stack web3 project demo built by Dovydas Lapinskas. Visit dovydas.io for more info.`,
    type: 'website'
  };

  return (
    <Web3Provider>
      <Head>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
            page_path: window.location.pathname,
          });
        `
          }}
        />
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        <meta property="og:title" content={meta.title} />
        <meta
          property="og:url"
          content="https://treasure-hunt-outdoors.dovydas.io"
        />

        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content="Treasure Hunt Outdoors" />
        <meta property="og:description" content={meta.description} />
      </Head>
      <Layout>
        <Component {...pageProps} />
        <Footer />
      </Layout>
    </Web3Provider>
  );
}

export default MyApp;
