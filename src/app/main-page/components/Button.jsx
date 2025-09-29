import Link from "next/link";

const sizes = {
  sm: "px-3 py-1 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  children,
  href,
  className = "",
  size = "md",
}) {
  return (
    <Link
      href={href}
      className={`block bg-indigo-500 cursor-pointer w-full hover:bg-indigo-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:ring-4 focus:ring-blue-300 outline-none text-center ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
