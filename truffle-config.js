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
    // ropsten: {
    //   // must be a thunk, otherwise truffle commands may hang in CI
    //   provider: () =>
    //     new HDWalletProvider({
    //       mnemonic: {
    //         phrase: keys.MNEMONIC
    //       },
    //       providerOrUrl: `https://ropsten.infura.io/v3/${keys.INFURA_PROJECT_ID}`,
    //       addressIndex: 0
    //     }),
    //   network_id: '3',
    //   gas: 5500000, // Gas Limit, How much gas we are willing to spent
    //   gasPrice: 20000000000, // how much we are willing to spent for unit of gas
    //   confirmations: 2, // number of blocks to wait between deployment
    //   timeoutBlocks: 200, // number of blocks before deployment times out
    //   networkCheckTimeout: 1000000
    // },
    goerli: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: keys.MNEMONIC
          },
          providerOrUrl: `https://goerli.infura.io/v3/${keys.INFURA_PROJECT_ID}`,
          addressIndex: 0
        }),
      network_id: '5',
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

// GOERLI
// transaction hash:    0xef37e2245633d43ccf20e07294fb6c3be514605f6444132275e4beea6895e961
// contract address:    0x1953429ef894a7a6Cc6102D0eAc9C05121a41F7f

// ROPSTEN
// contract address:    0x6E41D2a146EE85506A83f79578ad3D04CaB2b59D
