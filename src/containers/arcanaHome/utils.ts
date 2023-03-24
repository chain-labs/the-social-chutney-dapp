import axios from "axios";
import { CONTRACT_ADDRESS, getNetwork, TEST_NETWORK } from "../../constants";

const RELAY_TASK_CHECK_ENDPOINT = "https://relay.gelato.digital/tasks/status/";

export const getRelayStatus = async (taskId: string) => {
  const endpoint = `${RELAY_TASK_CHECK_ENDPOINT}${taskId}`;
  const res = await axios.get(endpoint);
  return res.data?.task;
};

export function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export const getOpenseaUrl = (tokenId) => {
  const BASE_URL = TEST_NETWORK
    ? "https://testnets.opensea.io"
    : "https://opensea.io";

  const NETWORK = getNetwork().chainId;
  const NETWORK_TAG = TEST_NETWORK
    ? getNetwork().name
    : NETWORK === "1"
    ? "ethereum"
    : "matic";

  return `${BASE_URL}/assets/${NETWORK_TAG}/${CONTRACT_ADDRESS}/${tokenId}`;
};
