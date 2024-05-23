/* eslint-disable react/prop-types */
const ConfirmationDialog = ({
  id,
  message,
  onRespond,
  okOption = "Yes",
  refuseOption = "No",
}) => {
  return (
    <div className="confirmation_dialog">
      <p>{message}</p>
      <div className="confirmation_btn_box">
        <button
          className="success_dialog confirmation_btns"
          onClick={() => onRespond(id, true)}
        >
          {okOption}
        </button>
        <button
          className="error_dialog confirmation_btns"
          onClick={() => onRespond(id, false)}
        >
          {refuseOption}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
