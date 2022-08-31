const HDWalletProvider = require('@truffle/hdwallet-provider');
const keys = require('./keys.json');

module.exports = {
  contracts_build_directory: './public/contracts',
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*'
    },
    ropsten: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: keys.MNEMONIC
          },
          providerOrUrl: `https://ropsten.infura.io/v3/${keys.INFURA_PROJECT_ID}`,
          addressIndex: 0
        }),
      network_id: '3',
      gas: 5500000, // Gas Limit, How much gas we are willing to spent
      gasPrice: 20000000000, // how much we are willing to spent for unit of gas
      confirmations: 2, // number of blocks to wait between deployment
      timeoutBlocks: 200, // number of blocks before deployment times out
      networkCheckTimeout: 1000000
    }
  },

  compilers: {
    solc: {
      version: '0.8.10'
    }
  }
};

// ROPSTEN
// transaction hash:    0xe75925b7c06bf9552cb4adcfb73a67c9b7f0161505f783e1ba892369cb634b51
// contract address:    0x6E41D2a146EE85506A83f79578ad3D04CaB2b59D
// account:             0x7b48Eeedb1f7b6b65d4c9AF86B5BdBB945FF6D50
