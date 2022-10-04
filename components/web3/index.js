import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { loadContract } from '@utils/loadContract';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { setupHooks } from '@components/web3/hooks/setupHooks';

// Web3Context helps to access web3 data inside the components
const Web3Context = createContext(null);

// Structure of web3 state accessible in components
const createWeb3State = ({ web3, provider, contract, isLoading }) => {
  return {
    web3,
    provider,
    contract,
    isLoading,
    hooks: setupHooks({ web3, provider, contract })
  };
};

// Wrapper component for the application
export default function Web3Provider({ children }) {
  // Initial Web3Api state method structure is set
  const [web3Api, setWeb3Api] = useState(
    createWeb3State({
      web3: null,
      provider: null,
      contract: null,
      isLoading: true
    })
  );

  // Set web3 state methods on initial page load
  useEffect(() => {
    (async function () {
      const provider = await detectEthereumProvider();

      if (provider) {
        const web3 = new Web3(provider);
        // Load factory contract
        const contract = await loadContract('TreasureFactory', web3);
        // Set Web3Api state with loaded data
        setWeb3Api(
          createWeb3State({
            web3,
            provider,
            contract,
            isLoading: false
          })
        );
      } else {
        // If provider is not defined, set only loading value
        setWeb3Api((api) => ({ ...api, isLoading: false }));
      }
    })();
  }, []);

  // useMemo hook will only run when web3Api dependencies have changed
  const _web3Api = useMemo(() => {
    const { web3, provider, isLoading } = web3Api;
    return {
      ...web3Api,
      requireInstall: !isLoading && !web3,
      connect: provider
        ? async () => {
            try {
              await provider.request({ method: 'eth_requestAccounts' });
            } catch {
              location.reload();
            }
          }
        : () =>
            console.error(
              'Cannot connect to Metamask, try to reload your browser please.'
            )
    };
  }, [web3Api]);

  return (
    <Web3Context.Provider value={_web3Api}>{children}</Web3Context.Provider>
  );
}

// Hook function to access web3 inside the app components wrapped in Web3Context
export function useWeb3() {
  return useContext(Web3Context);
}
