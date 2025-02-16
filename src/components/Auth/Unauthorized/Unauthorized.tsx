import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h1 className="text-3xl font-bold text-white">Unauthorized !</h1>
      <p className="mt-2 text-center text-red-500">
        You do not have permission to access this page.
      </p>
      <Link
        className="text-center text-[14px] underline mt-10 text-white"
        to="/"
      >
        {" "}
        Go to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
