import { Html, Head, Main, NextScript } from 'next/document';

export default function Document(props) {
  const meta = {
    title: 'Treasure Hunt Outdoors - Web3 Application Demo',
    description: `Full-stack web3 project demo built by Dovydas Lapinskas. Please visit: https://dovydas.io for more details.`,
    type: 'website'
  };

  return (
    <Html lang="en">
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
      <body className="text-gray-800 dark:text-gray-200 font-light">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
