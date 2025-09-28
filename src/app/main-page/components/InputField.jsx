export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  id,
  className = "",
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id || name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        type={type}
        id={id || name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${className}`}
      />
    </div>
  );
}
