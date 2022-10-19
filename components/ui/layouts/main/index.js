import {
  Navbar,
  ScreenSpinner,
  WrongNetwork,
  InstallMetamask
} from '@components/ui/common';
import { useWeb3 } from '@components/web3';
import { useEffect, useState } from 'react';

export default function MainLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const { isLoading, requireInstall, hooks } = useWeb3();
  const network = hooks.useNetwork();
  const account = hooks.useAccount();

  useEffect(() => {
    setLoading(true);
    !isLoading && setTimeout(() => setLoading(false), 1000);
  }, [isLoading, network.isSupported, account.data]);

  return loading ? (
    <ScreenSpinner />
  ) : network.isSupported ? (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      {children}
    </div>
  ) : requireInstall ? (
    <InstallMetamask />
  ) : (
    <WrongNetwork network={network} />
  );
}
