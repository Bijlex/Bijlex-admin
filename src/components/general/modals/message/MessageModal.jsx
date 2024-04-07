/* eslint-disable react/prop-types */
const MessageModal = ({ messageType, message, style }) => {
    return (
        <div className={`message_modal ${messageType === 'success' ? 'success_dialog' : messageType === 'error' ? 'error_dialog' : 'message_dialog'}`} style={style}>
            <p className="message">
                {message}
            </p>
        </div>
    );
};

export default MessageModal;
