import { Footer } from '@components/ui/common';
import Head from 'next/head';
import '../styles/globals.css';

const Noop = ({ children }) => <>{children}</>;

function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout ?? Noop;

  const meta = {
    title: 'Treasure Hunt Outdoors - Web3 Application Demo',
    description: `Full-stack web3 project demo built by Dovydas Lapinskas. Visit dovydas.io for more info.`,
    type: 'website'
  };

  return (
    <>
      <Head>
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
    </>
  );
}

export default MyApp;
