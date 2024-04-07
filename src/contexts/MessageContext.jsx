/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const messageDialogOffset = 5; // Adjust this value for spacing between message dialogs
const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [dialogs, setDialogs] = useState([]);

  const generateRandomId = () => {
    return `dialog-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
  };

  const addDialog = (dialog) => {
    const dialogId = generateRandomId();
    const newPosition =
      dialog.type === "message"
        ? dialogs.filter((d) => d.type === "message").length *
          messageDialogOffset
        : 0;

    const newDialog = {
      ...dialog,
      id: dialogId,
      position: newPosition,
      messageType: dialog.messageType || "default",
    };

    setDialogs((currentDialogs) => [...currentDialogs, newDialog]);

    if (dialog.type === "message") {
      const duration = dialog.duration || 3000; // Default to 3 seconds if not specified
      setTimeout(() => {
        removeDialog(dialogId);
      }, duration);
    }
    return dialogId;
  };

  const addConfirmationDialog = (message) => {
    return new Promise((resolve) => {
      const dialogId = generateRandomId();
      const dialog = {
        id: dialogId,
        type: "confirmation",
        message,
        resolve,
      };
      setDialogs((currentDialogs) => [...currentDialogs, dialog]);
    });
  };
  const addFullscreenConfirmationDialog = (message, confirmMsg) => {
    return new Promise((resolve) => {
      const dialogId = generateRandomId();
      const dialog = {
        id: dialogId,
        type: "fullscreen",
        message,
        confirmMsg,
        resolve,
      };
      setDialogs((currentDialogs) => [...currentDialogs, dialog]);
    });
  };

  const respondToConfirmation = (dialogId, response) => {
    console.log(dialogId);
    const dialog = dialogs.find((d) => d.id === dialogId);
    if (dialog && dialog.resolve) {
      dialog.resolve(response);
    }
    removeDialog(dialogId);
  };

  const removeDialog = (dialogId) => {
    setDialogs((currentDialogs) =>
      currentDialogs.filter((d) => d.id !== dialogId)
    );
  };

  return (
    <MessageContext.Provider
      value={{
        dialogs,
        addDialog,
        removeDialog,
        addConfirmationDialog,
        respondToConfirmation,
        addFullscreenConfirmationDialog,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
