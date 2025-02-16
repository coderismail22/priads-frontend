// import { Link } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import logo from "/7bfeedd.png";
// import LoginBanner from "../../../components/Banner/LoginBanner";

// const ResetPassword = () => {
//     const { register, handleSubmit, formState: { errors } } = useForm();

//     const onSubmit = data => {
//         console.log(data);
//         // Trigger the password reset logic here
//     };

//     return (
//         <div className="flex flex-col justify-center min-h-screen">
//             <div className="flex flex-col md:flex-row items-center justify-center">
//                 <div className="w-full h-full md:w-[28%] hidden md:block">
//                     <LoginBanner />
//                 </div>
//                 <div className="w-full md:w-[40%] p-8 rounded-xl shadow-md">
//                     <Link to={"/"}>
//                         <img className="mx-auto" src={logo} alt="logo" />
//                     </Link>

//                     <div className="space-y-3 text-center py-2">
//                         <h1 className="text-3xl md:text-4xl font-medium text-rose-600">
//                             Reset Password
//                         </h1>
//                     </div>

//                     {/* Reset Password Form */}
//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
//                         <div className="space-y-1 text-sm">
//                             <label className="block text-rose-700">Email</label>
//                             <input
//                                 type="email"
//                                 {...register("email", {
//                                     required: "Email is required",
//                                     pattern: {
//                                         value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
//                                         message: "Email is not valid"
//                                     }
//                                 })}
//                                 placeholder="Enter your email"
//                                 className="w-full px-4 py-3 rounded-md bg-rose-50"
//                             />
//                             {errors.email && <p className="text-red-500">{errors.email.message}</p>}
//                         </div>
//                         <Link to="/set-new-password-form" className="block w-full p-3 text-center rounded bg-primary hover:bg-primary/95 text-white">
//                             Send Reset Link
//                         </Link>
//                     </form>

//                     <p className="text-md text-center pt-2 sm:px-6 text-rose-700">
//                         Remember your password?
//                         <Link to="/login" className="underline">
//                             Login
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ResetPassword;
