import { AuthProvider } from "@arcana/auth";
import { ProvideAuth } from "@arcana/auth-react";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { getNetwork, TEST_NETWORK } from "../src/constants";
import ArcanaHome from "../src/containers/arcanaHome";
import { ARCANA_APP_ADDRESS } from "../src/containers/arcanaHome/constants";

const PROVIDER = new AuthProvider(`${ARCANA_APP_ADDRESS}`, {
  position: "right",
  theme: "light",
  alwaysVisible: true,
  network: TEST_NETWORK ? "testnet" : "mainnet",
  chainConfig: {
    chainId: getNetwork().chainIdHex,
    rpcUrl: "",
  },
});

const Home: NextPage = () => {
  return (
    <ProvideAuth provider={PROVIDER}>
      <ArcanaHome />;
    </ProvideAuth>
  );
};

export default Home;
