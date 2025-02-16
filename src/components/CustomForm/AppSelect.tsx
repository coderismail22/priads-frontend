// AppSearchableSelect.tsx
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Option {
  value: string;
  label: string;
}

interface AppSearchableSelectProps {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  isMulti?: boolean;
}

const AppSelect = ({
  name,
  label,
  options,
  placeholder,
  isMulti = false,
}: AppSearchableSelectProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="bg-blue-50">
              <Select
                {...field}
                options={options}
                placeholder={placeholder || "Select an option"}
                // onChange={(option) => field.onChange(option?.value)}
                onChange={(option) =>
                  field.onChange(
                    isMulti
                      ? (option as Option[]).map((opt) => opt.value) // Map array of selected options
                      : (option as Option)?.value // Single value
                  )
                }
                /**                value={
                  isMulti
                    ? options.filter((opt) =>
                        (field.value || []).includes(opt.value)
                      ) // Handle array for multi-select
                    : options.find((opt) => opt.value === field.value) || null
                } */

                //For preserving the lesson serial
                value={
                  isMulti
                    ? (field.value || []).map((value: string) =>
                        options.find((opt) => opt.value === value)
                      )
                    : options.find((opt) => opt.value === field.value) || null
                }
                isClearable
                isSearchable
                isMulti={isMulti} // Multi-select support
                classNamePrefix="react-select"
              />
            </div>
          </FormControl>
          {error && <FormMessage>{error.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default AppSelect;
