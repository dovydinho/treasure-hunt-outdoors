import useSWR from 'swr';

export const handler = (web3, contract) => (treasures, account) => {
  const swrRes = useSWR(
    () => (web3 && contract && account ? 'web3/deployedTreasures' : null),
    async () => {
      const deployedTreasures = [];

      for (let i = 0; i < treasures.length; i++) {
        const treasure = treasures[i];
        deployedTreasures.push(treasures.id);
      }

      return deployedTreasures;
    }
  );

  return swrRes;
};
