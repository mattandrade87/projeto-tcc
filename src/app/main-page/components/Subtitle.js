export default function Subtitle({ children, className = "" }) {
  return (
    <h2
      className={`text-xl md:text-2xl text-gray-600 text-center mb-8 ${className}`}
    >
      {children}
    </h2>
  );
}
