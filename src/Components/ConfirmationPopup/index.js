

const ConfirmationPopup = ({deletePost, handleDelete}) => {

  const closeConfirmation = () => {
    deletePost(false);
    handleDelete(false);
  };

  const handleConfirm = () => {
    deletePost(true);
    handleDelete(false);
  };

  return (
    <div>
        <div className="popup">
          <div className="popup-content">
            <h2>Confirmation</h2>
            <p>Are you sure you want to delete this post?</p>
            <div>
              <button className="mr-6" onClick={handleConfirm}>Yes</button>
              <button onClick={closeConfirmation}>No</button>
            </div>
          </div>
        </div>

      <style jsx>{`
        .popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .popup-content {
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationPopup;
