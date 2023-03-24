import { AuthProvider } from "@arcana/auth";
import { ProvideAuth, useAuth } from "@arcana/auth-react";
import Image from "next/image";
import React from "react";
import Box from "../../components/Box";
import {
  CONTRACT_ADDRESS,
  getEtherscanUrl,
  getNetwork,
  TEST_NETWORK,
} from "../../constants";
import { ARCANA_APP_ADDRESS } from "./constants";

import EtherscanFill from "../../../public/etherscan.svg";
import {
  Cross,
  DiscordFill,
  GoogleFill,
  InstagramFill,
  TelegramFill,
  TwitterFill,
} from "akar-icons";
import { useEffect, useState } from "react";
// import DiscordFill from "../components/svgs/discord";
import useContract from "../../hooks/useContract";
import useWallet from "../../hooks/useWallet";

import {
  BACKGROUND_COLOR,
  BUTTON_COLOR,
  BUTTON_TEXT_COLOR,
  COLLECTION_NAME,
  COLLECTION_WEBSITE,
  DISCORD_URL,
  HERO_MEDIA,
  INSTAGRAM_URL,
  LOGO_MEDIA,
  LOGO_MEDIA_2,
  SHOW_TOKENS_CLAIMED,
  SHOW_TOTAL_TOKENS,
  TELEGRAM_URL,
  TEXT_COLOR,
  TOKEN_COUNTER_COLOR,
  TOKEN_NAME,
  TWITTER_URL,
} from "../../settings/constants";
import If from "../../components/If";
import { ethers, providers } from "ethers";
import Mint from "./Mint";
import Confetti from "react-confetti";

const condense = (text: string) => {
  return `${text?.substring(0, 5)}...${text?.substring(text.length - 5)}`;
};

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

const ArcanaHome = () => {
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState<providers.Web3Provider>();
  const [signer, setSigner] = useState<providers.JsonRpcSigner>();
  const [user, setUser] = useState<string>();
  const [loggingIn, setLoggingIn] = useState(false);
  const [totalSupply, setTotalSupply] = useState<number>();
  const [maximumTokens, setMaximumTokens] = useState<number>();
  const [contract] = useContract(CONTRACT_ADDRESS, provider);

  const [ready, setReady] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const auth = useAuth();

  const handleConnect = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    const arcanaProvider = await auth.loginWithSocial("google");
    const provider = new ethers.providers.Web3Provider(arcanaProvider);
    const signer = provider.getSigner();
    setSigner(signer);
    setProvider(provider);
  };

  useEffect(() => {
    if (signer) {
      signer.getAddress().then((user) => setUser(user));
    }
  }, [signer]);

  useEffect(() => {
    if (user) {
      setLoggingIn(false);
      setConnected(true);
    }
  }, [user]);

  useEffect(() => {
    if (!auth.loading) {
      auth.logout();
      setReady(true);
    }
  }, [auth.loading]);

  useEffect(() => {
    const getSupply = async () => {
      try {
        const tokens = await contract.callStatic.totalSupply();
        setTotalSupply(tokens);
      } catch (err) {
        console.log(err, "error in fetch total supply");
      }
    };

    const getInformation = async () => {
      try {
        getSupply();
        const maxSupply = await contract.callStatic.maximumTokens();
        setMaximumTokens(maxSupply);
      } catch (err) {
        console.log(err, "Error in fetching max Supply");
      }
    };

    if (contract) {
      try {
        getInformation();
        setInterval(() => {
          getSupply();
        }, 5000);
      } catch (err) {
        console.log(err);
      }
    }
  }, [contract]);

  if (!ready) {
    return (
      <div className="h-screen w-screen flex justify-center items-center text-5xl font-medium">
        Loading...
      </div>
    );
  }

  const incrementSupply = (quantity: number) => {
    setTotalSupply(totalSupply + quantity);
  };

  return (
    <ProvideAuth provider={PROVIDER}>
      <If
        condition={confetti}
        then={
          <Confetti
            className="confetti"
            numberOfPieces={200}
            width={window.innerWidth}
            height={window.innerHeight}
            initialVelocityY={-10}
            gravity={0.01}
          />
        }
      />
      <Box
        className="container"
        backgroundColor={BACKGROUND_COLOR}
        height="100vh"
        width="100vw"
        position="relative"
      >
        <Box
          maxWidth="128rem"
          m="auto"
          display="flex"
          justifyContent="space-between"
          className="navbar"
          alignItems="center"
        >
          <Box className="logo-cont">
            <a
              href={COLLECTION_WEBSITE}
              target="_blank"
              rel="noreferrer"
              className="flex items-center"
            >
              <Box
                position="relative"
                width="200px"
                height="128px"
                css={`
                  @media screen and (max-width: 768px) {
                    height: 69px;
                    width: 100px;
                  }
                `}
              >
                <Image
                  src={LOGO_MEDIA}
                  alt="logo"
                  layout="fill"
                  objectFit="cover"
                />
              </Box>
              <Box
                position="relative"
                width="133px"
                height="69px"
                css={`
                  @media screen and (max-width: 768px) {
                    height: 34.5px;
                    width: 66.5px;
                  }
                `}
              >
                <Image
                  src={LOGO_MEDIA_2}
                  alt="logo"
                  layout="fill"
                  objectFit="cover"
                />
              </Box>
            </a>
          </Box>
          <Box
            display="flex"
            flex={1}
            flexDirection="row"
            justifyContent="flex-end"
            css={`
              @media screen and (max-width: 768px) {
                width: 150px;
              }
            `}
            className="icon-box"
            maxWidth="30rem"
          >
            <Box
              as="a"
              href={getEtherscanUrl()}
              rel="noreferrer"
              target="_blank"
              className="icon px-2 md:px-8"
              color={TEXT_COLOR}
              display="flex"
              justifyContent="center"
            >
              <EtherscanFill color={TEXT_COLOR} />
            </Box>
            <If
              condition={!!TWITTER_URL}
              then={
                <a
                  href={TWITTER_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 md:px-8 icon"
                >
                  <TwitterFill color={TEXT_COLOR} size={48} />
                </a>
              }
            />
            <If
              condition={!!DISCORD_URL}
              then={
                <Box
                  as="a"
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="icon px-2 md:px-8"
                >
                  <DiscordFill color={TEXT_COLOR} size={48} />
                </Box>
              }
            />
            <If
              condition={!!INSTAGRAM_URL}
              then={
                <Box
                  as="a"
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="icon px-2 md:px-8"
                >
                  <InstagramFill color={TEXT_COLOR} size={48} />
                </Box>
              }
            />
            <If
              condition={!!TELEGRAM_URL}
              then={
                <Box
                  as="a"
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="icon px-2"
                >
                  <TelegramFill color={TEXT_COLOR} size={48} />
                </Box>
              }
            />
          </Box>
        </Box>
        <Box className="hero">
          <Box
            className="hero-media"
            height={{ mobS: "20rem", tabS: "30rem" }}
            width={{ mobS: "20rem", tabS: "30rem" }}
            position={"relative"}
            borderRadius="8px"
            overflow="hidden"
            top="0"
            backgroundColor="none"
          >
            <Image
              alt="hero g-smif"
              src={HERO_MEDIA}
              layout="fill"
              className="hero-gif"
              quality="1"
              objectFit="contain"
            />
          </Box>
          <Box as="h1" id="hero-text" color={TEXT_COLOR}>
            {COLLECTION_NAME}
          </Box>
          {connected && SHOW_TOKENS_CLAIMED ? (
            <Box
              as="h3"
              id="counter"
              fontSize="1.8rem"
              fontWeight="800"
              color={TOKEN_COUNTER_COLOR}
            >
              {`${totalSupply} members have claimed ${TOKEN_NAME}`}
            </Box>
          ) : null}
        </Box>
        <Box className="mint-section">
          {!connected ? (
            <Box
              as="button"
              className="connect-btn"
              onClick={handleConnect}
              style={{
                backgroundColor: loggingIn ? "#cfcfcf" : BUTTON_COLOR,
                color: BUTTON_TEXT_COLOR,
              }}
              disabled={loggingIn}
            >
              <If
                condition={!loggingIn}
                then={
                  <Box display="flex" alignItems="center">
                    <GoogleFill strokeWidth={2} size={32} />
                    <Box ml="1rem">Login to Claim Merch</Box>
                  </Box>
                }
                else="Logging in..."
              />
            </Box>
          ) : (
            <Box>
              <Mint
                provider={provider}
                signer={signer}
                user={user}
                incrementSupply={incrementSupply}
                setConfetti={setConfetti}
              />
              <Box
                as="h3"
                className="user-address"
                fontSize="2rem"
                color={TEXT_COLOR}
                fontWeight={400}
                lineHeight="120%"
                m="0"
                textAlign="center"
                zIndex={3}
              >
                Connected to:{" "}
                <Box as="span" className="address" color={BUTTON_COLOR}>
                  {auth.user.email}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
        <div className="simplr">
          <a href="https://simplrhq.com" target="_blank" rel="noreferrer">
            <Image
              src="/simplr_brand.svg"
              height={41}
              width={167}
              alt="simplr brand"
            />
          </a>
        </div>
      </Box>
    </ProvideAuth>
  );
};

export default ArcanaHome;
