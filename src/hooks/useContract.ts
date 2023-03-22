import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { CHAIN_ID, NETWORK } from "../constants";
import contracts from "../contracts.json";
import { COLLECTION_TYPE } from "../settings/constants";

const useContract = (
  address: string,
  provider: ethers.providers.Web3Provider
) => {
  const [contract, setContract] = useState<ethers.Contract>();

  useEffect(() => {
    if (provider) {
      // @ts-ignore
      const abi =
        contracts?.[CHAIN_ID]?.[NETWORK].contracts?.[COLLECTION_TYPE]?.abi;
      console.log({ abi });

      const contract = new ethers.Contract(address, abi, provider);
      console.log({ contract });

      setContract(contract);
    }
  }, [provider, address]);

  return [contract];
};

export default useContract;
