export default function Title({ children, className = "" }) {
  return (
    <h1
      className={`text-4xl md:text-5xl  font-bold text-blue-900 text-center mb-4 ${className}`}
    >
      {children}
    </h1>
  );
}
