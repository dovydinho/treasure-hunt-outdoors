import { useState, useEffect } from 'react';
import { useWeb3 } from '@components/providers';

export const useTreasures = () => {
  const { contract, web3 } = useWeb3();
  const [allTreasures, setAllTreasures] = useState([]);
  const [treasureContracts, setTreasureContracts] = useState([]);

  useEffect(() => {
    let init = async () => {
      if (contract && contract !== null) {
        const deployedTreasures = await contract.methods
          .getTreasureContracts()
          .call();
        setAllTreasures(deployedTreasures);
      }
    };
    init();
  }, [contract]);

  useEffect(() => {
    let init = async () => {
      if (web3 && allTreasures.length > 0) {
        let res = await fetch('/contracts/Treasure.json');
        let Artifact = await res.json();
        let treasureContractInstance = (address) =>
          new web3.eth.Contract(Artifact.abi, address);

        for (let i = 0; i < allTreasures.length; i++) {
          let book = await treasureContractInstance(allTreasures[i]);
          let callGetSummary = await book.methods.getTreasureSummary().call();
          setTreasureContracts((treasureContracts) => [
            callGetSummary,
            ...treasureContracts
          ]);
        }
      } else {
        return;
      }
    };
    init();
  }, [web3, allTreasures]);

  return treasureContracts;
};
