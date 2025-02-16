import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Importing icons

interface AppInputPasswordProps {
  name: string;
  label: string;
  labelStyles?: string;
  placeholder?: string;
  className?: string;
  isDisabled?: boolean;
}

const AppInputPassword = ({
  name,
  label,
  labelStyles,
  isDisabled = false,
  placeholder,
  className,
}: AppInputPasswordProps) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  if (!control) {
    console.error(
      "Form context is missing. Ensure that AppInputPassword is rendered within AppForm."
    );
    return null;
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel className={`${labelStyles}`}>{label}</FormLabel>
          <FormControl>
            <div className="relative ">
              <Input
                type={showPassword ? "text" : "password"}
                disabled={isDisabled}
                className={`bg-blue-50 ${className}`}
                {...field}
                placeholder={placeholder}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? (
                  <AiFillEye size={20} /> // Show eye icon
                ) : (
                  <AiFillEyeInvisible size={20} /> // Show eye slash icon
                )}
              </button>
              {error && (
                <FormMessage className="mb-2">{error.message}</FormMessage>
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default AppInputPassword;
