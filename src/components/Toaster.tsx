import { useToaster } from "react-hot-toast";
import { CHAIN_ID, CONTRACT_ADDRESS } from "../constants";
import {
  BACKGROUND_COLOR,
  BUTTON_COLOR,
  TEXT_COLOR,
} from "../settings/constants";

const getBlockExplorer = (tx: string) => {
  const chain = parseInt(CHAIN_ID);
  switch (chain) {
    case 1:
      return `https://etherscan.io/tx/${tx}`;
    case 5:
      return `https://goerli.etherscan.io/tx/${tx}`;
  }
};

const Toaster = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  return (
    <div
      onMouseEnter={startPause}
      onMouseLeave={endPause}
      className="toast-container"
    >
      {toasts
        .filter((toast) => toast.visible)
        .map((toast) => {
          const toastMessage = `${toast.message}`;
          const message = toastMessage.split("//")[0];
          const tx = toastMessage.split("//")[1];

          return (
            <div
              key={toast.id}
              {...toast.ariaProps}
              style={{
                background: BACKGROUND_COLOR,
                color: TEXT_COLOR,
                padding: "8px 12px",
                border: `1px solid ${BUTTON_COLOR}`,
                borderRadius: "4px",
                zIndex: "20",
                width: tx ? "830px" : "830px",
                maxWidth: "90vw",
                display: "flex",
                alignItems: "center",
                justifyContent: tx ? "space-between" : "center",
              }}
            >
              <h6
                className="toast-text"
                style={{
                  margin: "0",
                  fontWeight: 700,
                  display: "inline",
                }}
              >
                {message}
              </h6>
              {tx ? (
                <a href={getBlockExplorer(tx)} target="_blank" rel="noreferrer">
                  <h3
                    className="toast-text"
                    style={{
                      margin: 0,
                      display: "inline",
                      color: BUTTON_COLOR,
                      fontWeight: 700,
                      width: "500px",
                    }}
                  >
                    View on Etherscan
                  </h3>
                </a>
              ) : null}
            </div>
          );
        })}
    </div>
  );
};

export default Toaster;
