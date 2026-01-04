import "./LoadingScreen.scss";

const LoadingScreen = ({ text = "در حال ورود..." }) => {
  return (
    <div className="loading-container">
      <div className="__spinner" />
      <p className="loading-text">{text}</p>
    </div>
  );
};

export default LoadingScreen;
