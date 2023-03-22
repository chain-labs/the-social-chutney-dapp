export const boolify = (x: string) => {
  if (x.toLowerCase() === "true") return true;
  else return false;
};

export const CONTRACT_ADDRESS = `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`;

export const CHAIN_NETWORK = process.env.NEXT_PUBLIC_CHAIN_NETWORK;
export const TEST_NETWORK = boolify(`${process.env.NEXT_PUBLIC_TEST_NETWORK}`);

export const getNetwork = () => {
  switch (CHAIN_NETWORK) {
    case "eth":
      return TEST_NETWORK ? "goerli" : "mainnet";
    case "polygon":
      return TEST_NETWORK ? "mumbai" : "polygon";
  }
};

export const NETWORK: string = getNetwork();

export const getChain = () => {
  switch (NETWORK) {
    case "goerli":
      return "5";
    case "mainnet":
      return "1";
    case "mumbai":
      return "80001";
    case "polygon":
      return "137";
  }
};

export const CHAIN_ID: string = getChain();

export const getEtherscanUrl = () => {
  switch (getChain()) {
    case "5":
      return `https://goerli.etherscan.io/address/${CONTRACT_ADDRESS}`;
    case "1":
      return `https://etherscan.io/address/${CONTRACT_ADDRESS}`;
    case "80001":
      return `https://mumbai.polygonscan.com/address/${CONTRACT_ADDRESS}`;
    case "137":
      return `https://polygonscan.com/address/${CONTRACT_ADDRESS}`;
  }
};

export const SIMPLR_URL = "https://simplrhq.com";

export const SALE_PAUSED = process.env.NEXT_PUBLIC_SALE_PAUSED === "true";
export const MAX_TOKENS = `${process.env.NEXT_PUBLIC_MAX_TOKENS}`;
