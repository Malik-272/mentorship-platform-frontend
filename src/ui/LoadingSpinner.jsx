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
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2
        className={`animate-spin text-blue-600 dark:text-blue-400 ${sizeClasses[size]}`}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
}
