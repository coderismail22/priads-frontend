import { ThreeDots } from "react-loader-spinner";

const LoaderWithBlurBG = ({ loadingText }: { loadingText?: string }) => {
  return (
    <div className="relative flex justify-center items-center h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 z-10"
        style={{
          backdropFilter: "blur(20px)", // Subtle blur
          WebkitBackdropFilter: "blur(20px)", // Safari compatibility
        }}
      ></div>

      {/* Loader and Text */}
      <div className="relative z-20 flex flex-col items-center">
        {/* Loader */}
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#36d7b7" // Calming green
          radius="9"
          ariaLabel="three-dots-loading"
        />
        {/* Subtle Text */}
        <p className="text-center font-siliguri mt-5 text-xl md:text-4xl  bg-gradient-to-r from-blue-500 to-cyan-500  text-transparent bg-clip-text ">
          {loadingText}
        </p>
      </div>
    </div>
  );
};

export default LoaderWithBlurBG;
