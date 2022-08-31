import { Html, Head, Main, NextScript } from 'next/document';

export default function Document(props) {
  const meta = {
    title: 'Treasure Hunt Outdoors - Web3 Application Demo',
    description: `Full-stack web3 project demo built by Dovydas Lapinskas. Please visit: https://dovydas.io for more details.`,
    type: 'website'
  };

  return (
    <Html lang="en">
      <Head />
      <body className="text-gray-800 dark:text-gray-200 font-light">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
