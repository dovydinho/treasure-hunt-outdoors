const HDWalletProvider = require("@truffle/hdwallet-provider")
const keys = require("./keys.json")

module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*",
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
      timeoutBlocks: 200 // number of blocks before deployment times out
    },
    rinkeby: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: keys.MNEMONIC
          },
          providerOrUrl: `https://rinkeby.infura.io/v3/${keys.INFURA_PROJECT_ID}`,
          addressIndex: 0
        }),
      network_id: '4',
      gas: 5500000, // Gas Limit, How much gas we are willing to spent
      gasPrice: 20000000000, // how much we are willing to spent for unit of gas
      confirmations: 2, // number of blocks to wait between deployment
      timeoutBlocks: 200 // number of blocks before deployment times out
    }
  },

  compilers: {
    solc: {
      version: "0.8.10",
    }
  }
}

// RINKEBY
// transaction hash:    0x095b08b0e36f4caf1d1a72ca059de10f43aaf6e3660d48b4e812e0b0c67cb462
// contract address:    0x641889BAa15FCb738967a6d85D98Eac0C3469B56
// account:             0x2D03f01EFBc301B2a2d52473872C189Cc669EcDd

// NEXT_PUBLIC_TARGET_CHAIN_ID=4
// NEXT_PUBLIC_NETWORK_ID=4

// ROPSTEN

// transaction hash:    0x794f39671a934731544304a4acfac044f84292ae1f3f197e8a6c3b71fe046cc9
// contract address:    0x235131fC51feD4DFa374fF45e7Da2aBe456cbcBD
// account:             0x2D03f01EFBc301B2a2d52473872C189Cc669EcDd

// NEXT_PUBLIC_TARGET_CHAIN_ID=3
// NEXT_PUBLIC_NETWORK_ID=3

// GANACHE

// NEXT_PUBLIC_TARGET_CHAIN_ID=1337
// NEXT_PUBLIC_NETWORK_ID=5777
