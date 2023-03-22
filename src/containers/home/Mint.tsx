import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import If from "../../components/If";
import { CONTRACT_ADDRESS } from "../../constants";
import useContract from "../../hooks/useContract";
import {
  BUTTON_COLOR,
  BUTTON_TEXT_COLOR,
  INPUT_BORDER_COLOR,
  TEXT_COLOR,
} from "../../settings/constants";
import Box from "../../components/Box";

const BUTTON_TEXT = {
  MINT: "MINT",
  MINT_SALE: "Mint for ",
  EXCEEDS: "Token exceeds limit",
  TRANSACTION: "Confirm Transaction",
  MINTING: "Minting...",
  SOLD_OUT: "Sold Out",
  PRESALE_NOT_ALLOWED: "Not Allowed to Buy",
  NO_SALE: "Coming Soon",
};

const Mint = ({ provider, signer, user, incrementSupply }) => {
  const [contract] = useContract(CONTRACT_ADDRESS, provider);

  const [maxPurchase, setMaxPurchase] = useState(10);
  const [noOfTokens, setNoOfTokens] = useState(null);
  const [disabledMintInput, setDisabledMintInput] = useState(false);
  const [saleType, setSaleType] = useState(0);
  const [price, setPrice] = useState("0");
  const [buttonText, setButtonText] = useState(BUTTON_TEXT.MINT);
  const [disabledMintButton, setDisabledMintButton] = useState(false);

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
      let transaction;
      if (saleType === 1) {
        transaction = await contract
          ?.connect(signer)
          ?.presaleBuy([], user, parseInt(noOfTokens), {
            value: BigNumber.from(noOfTokens).mul(price),
          });
      }
      if (saleType === 2) {
        transaction = await contract
          ?.connect(signer)
          ?.buy(user, parseInt(noOfTokens), {
            value: BigNumber.from(noOfTokens).mul(price),
          });
      }
      setButtonText(BUTTON_TEXT.MINTING);
      transaction
        .wait()
        .then((tx: any) => {
          incrementSupply(parseInt(noOfTokens));
          resetMint();
          toast(
            `🎉 Succesfully minted ${noOfTokens} Token${
              noOfTokens > 1 ? "s" : ""
            }!//${tx.transactionHash}`
          );
        })
        .catch((err: any, tx: any) => {
          resetMint();
          toast(`❌ Something went wrong! Please Try Again`);
        });
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
      <If
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
      />
      <If
        condition={saleType > 0 && noOfTokens > 0}
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
                } ETH`}</Box>
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
    </Box>
  );
};

export default Mint;
