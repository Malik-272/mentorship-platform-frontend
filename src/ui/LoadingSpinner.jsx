import { Loader2 } from "lucide-react";

export default function LoadingSpinner({
  size = "md",
  className = "",
  text = "Loading...",
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-transparent flex flex-col items-center justify-start pt-20 ${className}`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0)" }} // ensure transparent
    >
      <Loader2
        className={`animate-spin text-blue-600 dark:text-blue-400 ${sizeClasses[size]}`}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
}
