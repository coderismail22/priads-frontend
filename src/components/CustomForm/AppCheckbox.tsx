import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface AppCheckboxProps {
  name: string;
  label: string;
  labelStyles?: string;
  className?: string;
  isDisabled?: boolean;
}

const AppCheckbox = ({
  name,
  label,
  labelStyles,
  isDisabled = false,
  className,
}: AppCheckboxProps) => {
  const { control } = useFormContext();

  if (!control) {
    console.error(
      "Form context is missing. Ensure that AppCheckbox is rendered within AppForm."
    );
    return null;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormItem className="flex items-center space-x-2">
          <FormControl>
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isDisabled}
              className={`transition-all duration-300 ease-in-out border-blue-300 checked:bg-blue-500 focus:ring focus:ring-blue-300 ${className}`}
            />
          </FormControl>
          <FormLabel
            htmlFor={name}
            className={`text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${labelStyles}`}
          >
            {label}
          </FormLabel>
          {error && <FormMessage>{error.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default AppCheckbox;
