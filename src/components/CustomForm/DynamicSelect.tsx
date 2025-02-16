import { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";

interface DynamicSelectFieldProps {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (selectedValues: string[]) => void;
  defaultValue: string[]; // For prefilled values
}

const DynamicSelectField = ({
  label,
  placeholder,
  options,
  onChange,
  defaultValue,
}: DynamicSelectFieldProps) => {
  const [inputValue, setInputValue] = useState("");
  const [customOptions, setCustomOptions] = useState(options);
  const [selectedOptions, setSelectedOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Sync default values to selected options on mount
  useEffect(() => {
    const prefilledOptions = defaultValue.map((val) => ({
      value: val,
      label: val,
    }));
    setSelectedOptions(prefilledOptions);
  }, [defaultValue]);

  // Sync options from parent
  useEffect(() => {
    setCustomOptions(options);
  }, [options]);

  const handleAddOption = () => {
    if (inputValue.trim() !== "") {
      const newOption = { value: inputValue, label: inputValue };
      setCustomOptions((prevOptions) => [...prevOptions, newOption]);
      setInputValue("");
    }
  };

  const handleChange = (
    newValue: MultiValue<{ value: string; label: string }>
  ) => {
    const selectedValues = newValue.map((option) => option.value); // Extract values
    setSelectedOptions([...newValue]); // Update local state
    onChange(selectedValues); // Notify parent
  };

  return (
    <div className="w-full my-4">
      <label>{label}</label>
      <div className="flex gap-2 mb-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Add new ${label.toLowerCase()}`}
          className="bg-blue-50 border p-2 flex-1"
        />
        <Button
          onClick={handleAddOption}
          type="button"
          className="flex items-center justify-center gap-2 bg-white hover:bg-slate-200 p-2 border rounded-sm"
        >
          <p className="text-black">New</p>
          <FaPlus className="text-green-700" />
        </Button>
      </div>
      <Select
        options={customOptions}
        isMulti
        value={selectedOptions} // Bind selected options
        onChange={handleChange} // Use corrected handleChange
        placeholder={placeholder}
      />
    </div>
  );
};

export default DynamicSelectField;
