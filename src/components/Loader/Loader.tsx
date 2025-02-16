import { ThreeDots } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#36d7b7"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default Loader;
