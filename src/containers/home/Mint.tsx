import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import If from "../../components/If";
import {
  CONTRACT_ADDRESS,
  GELATO_API_KEY,
  getChain,
  getNetwork,
  TEST_NETWORK,
} from "../../constants";
import useContract from "../../hooks/useContract";
import {
  BUTTON_COLOR,
  BUTTON_TEXT_COLOR,
  INPUT_BORDER_COLOR,
  MINT_BUTTON_TEXT,
  TEXT_COLOR,
  TOKEN_NAME,
} from "../../settings/constants";
import Box from "../../components/Box";
import { GelatoRelay, SponsoredCallRequest } from "@gelatonetwork/relay-sdk";
import { delay, getOpenseaUrl, getRelayStatus } from "../arcanaHome/utils";
import { useAuth } from "@arcana/auth-react";
import { useQuery } from "urql";
import TokenQuery from "../../graphql/GetUserTokens";

const BUTTON_TEXT = {
  MINT: MINT_BUTTON_TEXT,
  MINT_SALE: "Mint for ",
  EXCEEDS: "Token exceeds limit",
  TRANSACTION: "Please Approve Claim",
  MINTING: "Sit Tight! Almost Done..",
  SOLD_OUT: "Sold Out",
  PRESALE_NOT_ALLOWED: "Not Allowed to Buy",
  NO_SALE: "Coming Soon",
  CLAIMED: "Fetching your Merch...",
};

const Mint = ({ provider, signer, user, incrementSupply, setConfetti }) => {
  const relay = new GelatoRelay();
  const [contract] = useContract(CONTRACT_ADDRESS, provider);

  const [maxPurchase, setMaxPurchase] = useState(10);
  const [noOfTokens, setNoOfTokens] = useState("1");
  const [disabledMintInput, setDisabledMintInput] = useState(false);
  const [saleType, setSaleType] = useState(0);
  const [price, setPrice] = useState("0");
  const [buttonText, setButtonText] = useState(BUTTON_TEXT.MINT);
  const [disabledMintButton, setDisabledMintButton] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const [tokenId, setTokenId] = useState("");
  const auth = useAuth();

  const [result, reexecuteQuery] = useQuery({
    query: TokenQuery,
    variables: {
      id: auth.user.address.toLowerCase(),
      address: CONTRACT_ADDRESS,
    },
    requestPolicy: 'network-only'
  });

  useEffect(() => {
    if (!result.fetching) {
      const tokenId = result.data?.users?.[0]?.minted?.[0]?.tokenId;
      console.log({ tokenId });
      if (tokenId) {
        setTokenId(tokenId);
      } else {
        delay(1500).then(() => {
          reexecuteQuery({ requestPolicy: "network-only" });
        });
      }
    }
  }, [result, reexecuteQuery]);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const isPresale = await contract.callStatic.isPresaleActive();
        const isSale = await contract.callStatic.isSaleActive();
        console.log({ isSale, isPresale });

        if (isPresale) {
          setSaleType(1);
          const presalePrice = await contract.callStatic.presalePrice();
          setPrice(presalePrice);
          const mPurchase = await contract.callStatic.presaleMaxHolding();
          setMaxPurchase(mPurchase);
        } else {
          if (isSale) {
            setSaleType(2);
            const salePrice = await contract.callStatic.price();
            setPrice(salePrice);
            const mPurchase = await contract.callStatic.maxPurchase();
            setMaxPurchase(mPurchase);
          } else {
            setSaleType(0);
            setDisabledMintButton(true);
          }
        }
      } catch (err) {
        console.log(err, "error in fetching sale info");
      }
    };
    if (contract) {
      try {
        getDetails();
      } catch (err) {
        console.log(err);
      }
    }
  }, [contract]);

  const resetMint = () => {
    setButtonText(BUTTON_TEXT.MINT);
    setDisabledMintInput(false);
    setDisabledMintButton(false);
    setNoOfTokens("");
  };

  useEffect(() => {
    if (noOfTokens) {
      const tokensCount = parseInt(noOfTokens);

      if (tokensCount > 0) {
        if (tokensCount <= maxPurchase) {
          setDisabledMintButton(false);
          setButtonText(BUTTON_TEXT.MINT);
        } else {
          setDisabledMintButton(true);
          //   setButtonText(BUTTON_TEXT.EXCEEDS);
        }
      } else {
        setDisabledMintButton(true);
        setButtonText(BUTTON_TEXT.MINT);
      }
    } else {
      setDisabledMintButton(true);
      setButtonText(BUTTON_TEXT.MINT);
    }
  }, [noOfTokens, maxPurchase]);

  useEffect(() => {
    if (saleType === 0) {
      setButtonText(BUTTON_TEXT.NO_SALE);
    } else {
      setButtonText(BUTTON_TEXT.MINT);
    }
  }, [saleType]);

  const handleMint = async (e) => {
    if (disabledMintButton) {
      return;
    }
    e.preventDefault();
    setButtonText(BUTTON_TEXT.TRANSACTION);
    setDisabledMintButton(true);
    setDisabledMintInput(true);
    try {
      let task;
      if (saleType === 1) {
        const { data } = await contract.populateTransaction.presaleBuy(
          [],
          user,
          parseInt(noOfTokens),
          {
            value: BigNumber.from(noOfTokens).mul(price),
          }
        );
        const request = {
          chainId: getChain(),
          target: CONTRACT_ADDRESS,
          data: data,
          user: user,
        };

        task = await relay.sponsoredCallERC2771(
          request,
          provider,
          GELATO_API_KEY
        );
        console.log({ task });
      }
      if (saleType === 2) {
        const { data } = await contract.populateTransaction.buy(
          user,
          parseInt(noOfTokens),
          {
            value: BigNumber.from(noOfTokens).mul(price),
          }
        );
        const request = {
          chainId: getChain(),
          target: CONTRACT_ADDRESS,
          data: data,
          user: user,
        };

        task = await relay.sponsoredCallERC2771(
          request,
          provider,
          GELATO_API_KEY
        );
        console.log({ task });
      }

      setButtonText(BUTTON_TEXT.MINTING);

      let confirmation = false;

      while (!confirmation) {
        getRelayStatus(task.taskId).then((task) => {
          console.log({ task });
          const taskStatus = task?.taskState;
          if (taskStatus === "CheckPending") {
            confirmation = false;
          } else {
            if (taskStatus === "ExecSuccess") {
              confirmation = true;
              setConfetti(true);
              setButtonText(BUTTON_TEXT.CLAIMED);
              setDisabledMintButton(true);
              setClaimed(true);
              toast(
                `🎉 Succesfully claimed ${noOfTokens} ${TOKEN_NAME}${
                  parseInt(noOfTokens) > 1 ? "s" : ""
                }!//${taskStatus.transactionHash}`
              );
            } else if (taskStatus === "Cancelled") {
              resetMint();
              toast.error("Transaction Failed! Try Again!");
              confirmation = true;
            }
          }
        });
        await delay(2000);
      }
    } catch (err) {
      console.log({ err });
      if (err.message.includes("out of buying limit")) {
        toast(`❌ You have exceeded your buying limit`);
      } else if (err.code === "INSUFFICIENT_FUNDS") {
        toast(`❌ Insufficient Funds in you wallet!`);
      } else {
        toast(`❌ Something went wrong! Please Try Again`);
      }
      resetMint();
    }
  };

  return (
    <Box className="mint-container" position="relative">
      {/* <If
        condition={saleType > 0}
        then={
          <Box className="mint-input-bg">
            <Box
              as="input"
              border={`1px solid ${INPUT_BORDER_COLOR}`}
              color={TEXT_COLOR}
              className="mint-input"
              type="number"
              onWheel={(e) => {
                // @ts-ignore
                e.target?.blur();
              }}
              placeholder={`Number of Tokens. ${
                maxPurchase ? `(Max. ${maxPurchase})` : ""
              }`}
              value={noOfTokens}
              onChange={(e) => setNoOfTokens(e.target.value)}
              min={1}
              max={maxPurchase ?? 10}
              disabled={disabledMintInput}
              css={`
                &::placeholder {
                  color: ${TEXT_COLOR}80;
                }
              `}
            />
          </Box>
        }
      /> */}
      <If
        condition={saleType > 0 && parseInt(noOfTokens) > 0}
        then={
          <Box
            className="total-info"
            position="absolute"
            top="40%"
            right="0%"
            transform="translateY(-40%)"
            // left="50%"
            zIndex={12}
          >
            <If
              condition={parseInt(noOfTokens) <= maxPurchase}
              then={
                <Box as="h2" fontSize="1.2rem">{`Total ${
                  noOfTokens
                    ? ethers.utils.formatUnits(
                        BigNumber.from(noOfTokens).mul(price).toString()
                      )
                    : ""
                } ${getNetwork().unit}`}</Box>
              }
              else={
                <Box as="h2" fontSize="1.2rem" className="error" color="red">
                  {`Cannot mint more than ${maxPurchase} tokens`}!
                </Box>
              }
            />
          </Box>
        }
      />
      <If
        condition={!!tokenId}
        then={
          <a href={getOpenseaUrl(tokenId)} target="_blank" rel="noreferrer">
            <Box
              as="button"
              backgroundColor={BUTTON_COLOR}
              color={BUTTON_TEXT_COLOR}
              className="mint-btn"
            >
              View your Merch
            </Box>
          </a>
        }
        else={
          <Box
            as="button"
            backgroundColor={BUTTON_COLOR}
            color={BUTTON_TEXT_COLOR}
            className="mint-btn"
            onClick={handleMint}
            disabled={disabledMintButton}
          >
            {buttonText}
          </Box>
        }
      />
    </Box>
  );
};

export default Mint;
