export default function Spinner() {
  return (
    <>
      <div className="spinner-container d-flex align-items-center justify-content-center">
        <div className="spinner">
            <div className="spinner-border orange-text fs-4 text" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
        </div>
      </div>
    </>
  );
}
