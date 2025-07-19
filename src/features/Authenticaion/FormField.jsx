// import { useState } from "react"
// import { Eye, EyeOff, AlertCircle } from "lucide-react"

// export default function FormField({
//   label,
//   name,
//   type = "text",
//   placeholder,
//   register,
//   error,
//   rules,
//   showPasswordToggle = false,
//   children,
//   className = "",
//   ...props
// }) {
//   const [showPassword, setShowPassword] = useState(false)

//   const inputType = showPasswordToggle && showPassword ? "text" : type

//   return (
//     <div className={`space-y-2 ${className}`}>
//       <label htmlFor={name} className="block text-sm font-medium text-gray-700">
//         {label}
//       </label>
//       <div className="relative">
//         {children ? (
//           children
//         ) : (
//           <input
//             id={name}
//             type={inputType}
//             placeholder={placeholder}
//             className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? "border-red-300" : "border-gray-300"
//               }`}
//             {...(register ? register(name, rules) : {})}
//             {...props}
//           />
//         )}
//         {showPasswordToggle && (
//           <button
//             type="button"
//             className="absolute inset-y-0 right-0 pr-3 flex items-center"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
//           </button>
//         )}
//       </div>
//       {error && (
//         <div className="flex items-center space-x-1 text-red-600 text-sm">
//           <AlertCircle className="w-4 h-4" />
//           <span>{error.message}</span>
//         </div>
//       )}
//     </div>
//   )
// }

import { useState } from "react"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

export default function FormField({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
  rules,
  showPasswordToggle = false,
  children,
  className = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = showPasswordToggle && showPassword ? "text" : type

  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>

      <div className="relative">
        {children ? (
          children
        ) : (
          <input
            id={name}
            type={inputType}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            bg-white text-gray-900 placeholder-gray-400 
            dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 
            ${error ? "border-red-300 dark:border-red-500" : "border-gray-300 dark:border-gray-600"}`}
            {...(register ? register(name, rules) : {})}
            {...props}
          />
        )}

        {showPasswordToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-gray-400" />
            ) : (
              <Eye className="w-5 h-5 text-gray-400" />
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-1 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error.message}</span>
        </div>
      )}
    </div>
  )
}
