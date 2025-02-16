import { Controller, useFormContext } from "react-hook-form";
import DatePicker from "react-datepicker";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import "react-datepicker/dist/react-datepicker.css"; // Ensure this is imported if not already
import "./appdatepicker.css";

interface AppYearPickerProps {
  name: string;
  label: string;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
}

const AppYearPicker = ({
  name,
  label,
  placeholder,
  isDisabled = false,
  className = "",
}: AppYearPickerProps) => {
  const { control } = useFormContext();
  const currentYear = new Date().getFullYear();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative w-full">
              <DatePicker
                {...field}
                selected={field.value ? new Date(Number(field.value), 0, 1) : null} // Set to January 1 of the selected year
                onChange={(date) =>
                  field.onChange(date ? (date as Date).getFullYear().toString() : "")
                }
                showYearPicker
                dateFormat="yyyy"
                placeholderText={placeholder || "Select a year"}
                disabled={isDisabled}
                className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
                yearDropdownItemNumber={20} // Show 20 years in the dropdown (10 past + 10 future)
                minDate={new Date(currentYear - 10, 0, 1)} // 10 years back
                maxDate={new Date(currentYear + 10, 0, 1)} // 10 years forward
              />
            </div>
          </FormControl>
          {error && <FormMessage>{error.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default AppYearPicker;
