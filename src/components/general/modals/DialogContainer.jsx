import { useMessage } from "../../../contexts/MessageContext";
import ConfirmationDialog from "./message/ConfirmationDialog";
import FullScreenMessageModal from "./message/FullScreenMessageModal";
import LoadingMessageModal from "./message/LoadingMessage";
import MessageModal from "./message/MessageModal";
import "../../../styles/Dialog_modals.css";
const DialogContainer = () => {
  const { dialogs, removeDialog, respondToConfirmation } = useMessage();
  const messageDialogOffset = 6; // Spacing between message dialogs
  // Check if there is an active confirmation dialog
  const hasConfirmationDialog = dialogs.some(
    (dialog) => dialog.type === "confirmation" || dialog.type === "fullscreen"
  );

  // Set styles based on whether there is a confirmation dialog
  const containerStyle = {
    pointerEvents: hasConfirmationDialog ? "auto" : "none",
  };
  return (
    <div className="dialog_container" style={containerStyle}>
      {dialogs.map((dialog, index) => {
        let style = {};
        if (dialog.type === "message") {
          style = {
            bottom: `${(index + 1) * messageDialogOffset}vh`,
            left: "50%",
            transform: "translateX(-50%)",
          };
        }

        switch (dialog.type) {
          case "fullscreen":
            return (
              <FullScreenMessageModal
                key={dialog.id}
                id={dialog.id}
                message={dialog.message}
                confirmMsg={dialog.confirmMsg}
                onRespond={respondToConfirmation}
              />
            );
          case "message":
            return (
              <MessageModal
                key={dialog.id}
                message={dialog.message}
                style={style}
                messageType={dialog.messageType}
              />
            );
          case "loading":
            return (
              <LoadingMessageModal key={dialog.id} message={dialog.message} />
            );
          case "confirmation":
            return (
              <ConfirmationDialog
                key={dialog.id}
                id={dialog.id}
                message={dialog.message}
                onRespond={respondToConfirmation}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default DialogContainer;
