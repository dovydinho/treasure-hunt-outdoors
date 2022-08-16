import { handler as createAccountHook } from './useAccount';
import { handler as createNetworkHook } from './useNetwork';
import { handler as createDeployedTreasures } from './useDeployedTreasures';

export const setupHooks = ({ web3, provider, contract }) => {
  return {
    useAccount: createAccountHook(web3, provider),
    useNetwork: createNetworkHook(web3, provider),
    useDeployedTreasures: createDeployedTreasures(web3, contract)
  };
};
