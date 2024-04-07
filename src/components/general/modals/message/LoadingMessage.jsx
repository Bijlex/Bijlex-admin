/* eslint-disable react/prop-types */
const LoadingMessageModal = ({ message }) => {
    return (
        <div className={`loading_modal`}>
            <div className="spinner"></div>
            <div className="loading_message_box">

                <p className="loading_message">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default LoadingMessageModal;
