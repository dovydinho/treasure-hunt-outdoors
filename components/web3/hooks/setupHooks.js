import { handler as createAccountHook } from './useAccountHandler';
import { handler as createNetworkHook } from './useNetworkHandler';
import { handler as createTreasuresHook } from './useTreasuresHandler';

export const setupHooks = ({ web3, provider, contract }) => {
  return {
    useAccount: createAccountHook(web3, provider),
    useNetwork: createNetworkHook(web3, provider),
    useTreasures: createTreasuresHook(web3, contract)
  };
};
