import { CHAIN } from "@arcana/auth";

export const boolify = (x: string) => {
  if (x.toLowerCase() === "true") return true;
  else return false;
};

export const CONTRACT_ADDRESS = `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`;
export const SUBGRAPH_ENDPOINT = process.env.NEXT_PUBLIC_SUBGRAPH_ENDPOINT;

export const CHAIN_NETWORK = process.env.NEXT_PUBLIC_CHAIN_NETWORK;
export const TEST_NETWORK = boolify(`${process.env.NEXT_PUBLIC_TEST_NETWORK}`);

export const getNetwork = (): {
  chainIdHex: CHAIN;
  chainId: string;
  blockExplorer: string;
  unit: string;
  name: string;
} => {
  if (TEST_NETWORK) {
    if (CHAIN_NETWORK === "polygon")
      return {
        name: "mumbai",
        chainIdHex: CHAIN.POLYGON_MUMBAI_TESTNET,
        chainId: "80001",
        blockExplorer: "https://mumbai.polygonscan.com/",
        unit: "MATIC",
      };
    else
      return {
        name: "goerli",
        chainIdHex: CHAIN.ETHEREUM_GOERLI,
        chainId: "5",
        blockExplorer: "https://goerli.etherscan.io/",
        unit: "ETH",
      };
  } else {
    if (CHAIN_NETWORK === "polygon")
      return {
        name: "matic",
        chainIdHex: CHAIN.POLYGON_MAINNET,
        chainId: "137",
        blockExplorer: "https://polygonscan.com/",
        unit: "MATIC",
      };
    else
      return {
        name: "mainnet",
        chainIdHex: CHAIN.ETHEREUM_MAINNET,
        chainId: "1",
        blockExplorer: "https://etherscan.io/",
        unit: "ETH",
      };
  }
};

export const NETWORK: string = getNetwork().name;

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

export const GELATO_API_KEY = process.env.NEXT_PUBLIC_GELATO_API_KEY;
