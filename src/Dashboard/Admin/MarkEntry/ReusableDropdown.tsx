export const ReusableDropdown = ({ label, value, onChange, options }: any) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-1">
      {label}:
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border rounded-md shadow-sm transition-all bg-white border-gray-300 hover:shadow-md focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select {label}</option>
      {options.map((option: any) => (
        <option key={option.value || option} value={option.value || option}>
          {option.label || option}
        </option>
      ))}
    </select>
  </div>
);
