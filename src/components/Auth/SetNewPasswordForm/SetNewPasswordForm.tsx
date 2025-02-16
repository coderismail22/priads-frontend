// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Link, useSearchParams } from "react-router-dom";
// import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
// import logo from "/7bfeedd.png";

// const SetNewPasswordForm = () => {
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const { register, handleSubmit, formState: { errors }, watch } = useForm();
//     const [searchParams] = useSearchParams();
//     const token = searchParams.get("token");  // Retrieve the token from the URL

//     const password = watch("password");

//     const onSubmit = data => {
//         const payload = {
//             token,  // Include the token in the payload
//             password: data.password,
//             confirmPassword: data.confirmPassword,
//         };

//         console.log(payload);
//         // Send this payload to your backend API for password reset
//         // Example: axios.post('/api/reset-password', payload)
//     };

//     return (
//         <div className="flex flex-col justify-center min-h-screen">
//             <div className="w-full md:w-[40%] p-8 rounded-xl shadow-md mx-auto">
//                 <Link to="/">
//                     <img className="mx-auto" src={logo} alt="logo" />
//                 </Link>

//                 <div className="space-y-3 text-center py-2">
//                     <h1 className="text-3xl md:text-4xl font-medium text-rose-600">
//                         Set New Password
//                     </h1>
//                 </div>

//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
//                     <div className="space-y-1 text-sm">
//                         <label className="block text-rose-700">New Password</label>
//                         <div className="relative">
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 {...register("password", {
//                                     required: "Password is required",
//                                     minLength: {
//                                         value: 6,
//                                         message: "Password must be at least 6 characters long"
//                                     }
//                                 })}
//                                 placeholder="New Password"
//                                 className="w-full px-4 py-3 rounded-md bg-rose-50"
//                             />
//                             <span
//                                 className="absolute right-3 top-3 cursor-pointer"
//                                 onClick={() => setShowPassword(!showPassword)}
//                             >
//                                 {showPassword ? (
//                                     <AiFillEyeInvisible className="text-rose-700" />
//                                 ) : (
//                                     <AiFillEye className="text-rose-700" />
//                                 )}
//                             </span>
//                         </div>
//                         {errors.password && <p className="text-red-500">{errors.password.message}</p>}
//                     </div>

//                     <div className="space-y-1 text-sm">
//                         <label className="block text-rose-700">Confirm New Password</label>
//                         <div className="relative">
//                             <input
//                                 type={showConfirmPassword ? "text" : "password"}
//                                 {...register("confirmPassword", {
//                                     required: "Please confirm your password",
//                                     validate: value =>
//                                         value === password || "Passwords do not match"
//                                 })}
//                                 placeholder="Confirm New Password"
//                                 className="w-full px-4 py-3 rounded-md bg-rose-50"
//                             />
//                             <span
//                                 className="absolute right-3 top-3 cursor-pointer"
//                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                             >
//                                 {showConfirmPassword ? (
//                                     <AiFillEyeInvisible className="text-rose-700" />
//                                 ) : (
//                                     <AiFillEye className="text-rose-700" />
//                                 )}
//                             </span>
//                         </div>
//                         {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
//                     </div>

//                     <button className="block w-full p-3 text-center rounded bg-primary hover:bg-primary/95 text-white">
//                         Reset Password
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default SetNewPasswordForm;
