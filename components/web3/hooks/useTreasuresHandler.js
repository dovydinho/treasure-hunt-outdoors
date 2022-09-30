import { useState, useEffect } from 'react';

export const handler = (web3, contract) => () => {
  const [allTreasures, setAllTreasures] = useState([]);
  const [treasureContracts, setTreasureContracts] = useState([]);

  useEffect(() => {
    const init = async () => {
      const deployedTreasures = await contract.methods
        .getTreasureContracts()
        .call();
      setAllTreasures(deployedTreasures);
    };
    contract && init();
  }, [contract]);

  useEffect(() => {
    const init = async () => {
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
    };
    web3 && allTreasures.length > 0 && init();
  }, [web3, allTreasures]);

  return treasureContracts;
};
