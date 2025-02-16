import { Controller, useFormContext } from "react-hook-form";
import DatePicker from "react-datepicker";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import "react-datepicker/dist/react-datepicker.css"; // Ensure this is imported if not already
import "./appdatepicker.css";
interface AppDatePickerProps {
  name: string;
  label: string;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
}

const AppDatePicker = ({
  name,
  label,
  placeholder,
  isDisabled = false,
  className = "",
}: AppDatePickerProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="w-full">
              <DatePicker
                {...field}
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) =>
                  field.onChange(
                    date ? (date as Date).toISOString().split("T")[0] : ""
                  )
                }
                dateFormat="yyyy-MM-dd"
                placeholderText={placeholder}
                disabled={isDisabled}
                className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none ${className}`}
              />
            </div>
          </FormControl>
          {error && <FormMessage>{error.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default AppDatePicker;
