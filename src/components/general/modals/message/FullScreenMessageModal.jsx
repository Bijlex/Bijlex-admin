/* eslint-disable react/prop-types */
const FullScreenMessageModal = ({
  id,
  messageType,
  message,
  confirmMsg,
  onRespond,
}) => {
  return (
    <div
      className={`fullscreen_message_modal ${
        messageType === "success"
          ? "success_dialog"
          : messageType === "error"
          ? "error_dialog"
          : "message_dialog"
      }`}
    >
      <div className="fullscreen_message_box">
        <p className="fullscreen_message">{message}</p>
        <button
          className="success_dialog confirmation_btns"
          onClick={() => onRespond(id, true)}
        >
          {confirmMsg}
        </button>
      </div>
    </div>
  );
};

export default FullScreenMessageModal;
