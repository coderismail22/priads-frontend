import { Link } from "react-router-dom";
import AppForm from "../../CustomForm/AppForm";
import AppInput from "../../CustomForm/AppInput";
import AppInputPassword from "../../CustomForm/AppInputPassword";
// import LoaderWithBlurBG from "../../Loader/LoaderWithBlurBG";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { login, logout } from "../../../redux/slices/authSlice";

const Login = () => {
  const onSubmit = (data) => {
    const { email, password } = data;
    console.log(email, password);
    dispatch(
      login({
        user: { id: "1", name: "John Doe", email, password },
        token: "sample_token_123",
      })
    );
  };

  // if (loginMutation.isPending)
  //   return <LoaderWithBlurBG loadingText={"Getting you in - just a moment!"} />;

  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <Helmet>
        <title>FabAds | Login</title>
      </Helmet>
      <div className="w-full max-w-sm p-8 bg-gray-800 shadow-lg rounded-lg border border-gray-700">
        <div className="flex flex-col items-center justify-center mb-2">
          <Link to="/">
            <img className="w-20" alt="Logo" />
          </Link>
        </div>
        <h2 className="text-xl font-bold text-center text-gray-100 mb-8">
          Login to Your Account
        </h2>
        <AppForm
          // schema={loginSchema}
          onSubmit={onSubmit}
          buttonText={"Login"}
          submitButtonStyles="bg-blue-500 hover:bg-blue-600 text-white"
          defaultValues={{
            email: "",
            password: "",
          }}
        >
          {/* Email Input */}
          <div className="mb-4">
            <AppInput
              className="w-full mb-4 bg-[#2D394B] border border-gray-600 text-gray-300 placeholder-gray-400 focus:ring focus:ring-blue-500 focus:border-blue-500"
              name="email"
              label="Email"
              labelStyles="text-white"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input */}
          <AppInputPassword
            className="w-full mb-4 bg-gray-700 border border-gray-600 text-gray-300 placeholder-gray-400 focus:ring focus:ring-blue-500 focus:border-blue-500"
            name="password"
            label="Password"
            labelStyles="text-white"
            placeholder="Enter your password"
          />
        </AppForm>
      </div>
    </div>
  );
};

export default Login;
