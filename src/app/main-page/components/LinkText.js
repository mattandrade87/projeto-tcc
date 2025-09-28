export default function LinkText({
  children,
  href = "#",
  onClick,
  className = "",
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`text-blue-600 hover:text-blue-800 underline text-sm transition-colors duration-200 cursor-pointer ${className}`}
    >
      {children}
    </a>
  );
}
