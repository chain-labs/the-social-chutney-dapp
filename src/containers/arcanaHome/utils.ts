import axios from "axios";

const RELAY_TASK_CHECK_ENDPOINT = "https://relay.gelato.digital/tasks/status/";

export const getRelayStatus = async (taskId: string) => {
  const endpoint = `${RELAY_TASK_CHECK_ENDPOINT}${taskId}`;
  const res = await axios.get(endpoint);
  return res.data?.task;
};

export function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
