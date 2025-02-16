import { useMutation } from "@tanstack/react-query";
import AppForm from "@/components/CustomForm/AppForm";
import AppInput from "@/components/CustomForm/AppInput";
import AppInputPassword from "@/components/CustomForm/AppInputPassword";
import { registerSchema } from "@/schemas/register.schema";
import { TRegisterForm } from "@/types/register.type";
import axiosInstance from "@/api/axiosInstance";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin";
import LoaderWithBlurBG from "@/components/Loader/LoaderWithBlurBG";
import { AxiosError } from "axios";
import { handleAxiosError } from "@/utils/handleAxiosError";
import "../../../styles/swal.css";
import { Helmet } from "react-helmet";
const Register = () => {
  const loginMutation = useLogin();

  const registerMutation = useMutation({
    mutationFn: async (formData: Partial<TRegisterForm>) => {
      const response = await axiosInstance.post(
        "/users/create-student",
        formData
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      // Automatically log in after registration
      loginMutation.mutate(
        {
          email: variables.email as string,
          password: variables.password as string,
        },
        {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Registration Successful",
              text: "Welcome!",
              customClass: {
                title: "custom-title",
                popup: "custom-popup",
                icon: "custom-icon",
                confirmButton: "custom-confirm-btn",
              },
            });
          },
          onError: () => {
            Swal.fire({
              icon: "error",
              title: "Auto Login Failed",
              text: "Please log in manually.",
              customClass: {
                title: "custom-title",
                popup: "custom-popup",
                icon: "custom-icon",
                confirmButton: "custom-confirm-btn",
              },
            });
          },
        }
      );
    },
    onError: (error: AxiosError) => {
      handleAxiosError(error, "Registration Failed");
    },
  });

  const onSubmit = (data: TRegisterForm) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...restFormData } = data;
    registerMutation.mutate(restFormData);
  };

  if (registerMutation.isPending)
    return <LoaderWithBlurBG loadingText="Getting things ready for you !" />;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <Helmet>
        <title>BlueBirdSchool | Register</title>
      </Helmet>
      <div className="w-full max-w-sm p-6 sm:p-8 bg-gray-800 shadow-lg rounded-lg border border-gray-700">
        <div className="flex flex-col items-center justify-center mb-2">
          <Link to="/">
            <img
              className="w-16 sm:w-20"
              src="/ejobsit-logo.svg"
              alt="Ejobsit"
            />
          </Link>
        </div>
        <h2 className="text-xl font-bold text-center text-gray-100 mb-6">
          Create Your Account
        </h2>
        <AppForm
          schema={registerSchema}
          onSubmit={onSubmit}
          buttonText={
            registerMutation.isPending ? "Registering..." : "Register"
          }
          submitButtonStyles="w-full py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
          defaultValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
        >
          {/* Full Name */}
          <div className="mb-4">
            <AppInput
              className="w-full bg-gray-700 border border-gray-600 text-gray-300 placeholder-gray-400 focus:ring focus:ring-blue-500 focus:border-blue-500"
              name="name"
              label="Full Name"
              labelStyles="text-white"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <AppInput
              className="w-full bg-gray-700 border border-gray-600 text-gray-300 placeholder-gray-400 focus:ring focus:ring-blue-500 focus:border-blue-500"
              name="email"
              label="Email"
              labelStyles="text-white"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <AppInputPassword
            className="w-full mb-4 bg-gray-700 border border-gray-600 text-gray-300 placeholder-gray-400 focus:ring focus:ring-blue-500 focus:border-blue-500"
            name="password"
            label="Password"
            labelStyles="text-white"
            placeholder="Enter your password"
          />

          {/* Confirm Password */}
          <AppInputPassword
            className="w-full mb-4 bg-gray-700 border border-gray-600 text-gray-300 placeholder-gray-400 focus:ring focus:ring-blue-500 focus:border-blue-500"
            name="confirmPassword"
            label="Confirm Password"
            labelStyles="text-white"
            placeholder="Confirm your password"
          />
        </AppForm>
        <div className="text-sm flex gap-1 mt-4 items-center justify-center text-gray-400">
          <p>Already have an account?</p>
          <Link to="/auth/login" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
