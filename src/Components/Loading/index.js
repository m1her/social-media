const Loading = () => {
   
  return (
    <div>
        <div className="popup">
          <div className="popup-content">
            <div className="text-2xl font-semibold animate-pulse">Loading ... </div>
          </div>
        </div>

      <style jsx>{`
        .popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .popup-content {
          text-align: center;
        }
      `}</style>
    </div>
  );
}
export default Loading;