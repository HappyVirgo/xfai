import { useEffect, useState } from 'react'

const useBlock = () => {
  const [block, setBlock] = useState(0);
  useEffect(() => {
    if (!window.web3) return;

    const interval = setInterval(async () => {
      const latestBlockNumber = await window.web3.eth.getBlockNumber();
      if (block !== latestBlockNumber) {
        setBlock(latestBlockNumber);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [block]);

  return block;
}

export default useBlock;
