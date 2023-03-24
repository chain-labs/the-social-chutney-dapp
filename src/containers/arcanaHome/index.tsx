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
  CircleX,
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
  TOKEN_IMG_URI,
  TOKEN_NAME,
  TWITTER_URL,
} from "../../settings/constants";
import If from "../../components/If";
import { ethers, providers } from "ethers";
import Mint from "./Mint";
import Confetti from "react-confetti";
import { delay, getOpenseaUrl } from "./utils";

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
  const [showPopup, setShowPopup] = useState(false);

  const [ready, setReady] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState(200);

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

  useEffect(() => {
    if (confetti)
      if (confettiPieces > 0) {
        console.log({ confettiPieces });
        delay(1000).then(() => {
          setConfettiPieces(confettiPieces - 10);
        });
      }
  }, [confettiPieces, confetti]);

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
            numberOfPieces={confettiPieces}
            width={window.innerWidth}
            height={window.innerHeight}
            initialVelocityY={-5}
            gravity={0.01}
          />
        }
      />
      <If condition={showPopup} then={<Popup setShowPopup={setShowPopup} />} />
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
                setShowPopup={setShowPopup}
              />
              <Box
                as="h3"
                className="user-address"
                fontSize={{ mobS: "1.6rem", tabS: "2rem" }}
                color={TEXT_COLOR}
                fontWeight={400}
                lineHeight="120%"
                m="0"
                textAlign="center"
                zIndex={3}
              >
                Connected to:{" "}
                <Box as="span" className="address" color={BUTTON_COLOR}>
                  {auth?.user?.email}
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

const Popup = ({ setShowPopup }) => {
  return (
    <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full">
      <div className="relative p-4 w-full max-w-2xl h-full md:h-auto mt-40">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600">
            <h3 className="text-2xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
              Your {TOKEN_NAME}
            </h3>
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <CircleX size={12} />
            </button>
          </div>
          <div className="p-6 space-y-6 flex justify-center">
            <Box
              className="relative rounded-lg overflow-hidden"
              height="30rem"
              width="30rem"
            >
              <Image
                src={TOKEN_IMG_URI}
                layout="fill"
                objectFit="contain"
                alt="token_img"
              />
            </Box>
          </div>
          <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
            {/* <a href={getOpenseaUrl()}>
            <button
              type="button"
              className={`text-black font-bold text-xl bg-[#43a2ff]  rounded-lg px-5 py-2.5 mr-2 text-center inline-flex items-center hover:scale-[1.02] transition-transform`}
              >
              View on Opensea
            </button>
              </a> */}
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className={`text-black font-bold text-xl bg-[#FFD031] rounded-lg px-5 py-2.5 mr-2 text-center inline-flex items-center hover:scale-[1.02] transition-transform`}
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
