import { getPasswordStrength } from "../../utils/validation"

export default function PasswordStrengthIndicator({ password }) {
  if (!password) return null

  const { strength, color } = getPasswordStrength(password)

  const getStrengthWidth = () => {
    switch (strength) {
      case "weak":
        return "w-1/3"
      case "medium":
        return "w-2/3"
      case "strong":
        return "w-full"
      default:
        return "w-0"
    }
  }

  const getStrengthColor = () => {
    switch (strength) {
      case "weak":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "strong":
        return "bg-green-500"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600">Password strength:</span>
        <span className={`text-xs font-medium ${color}`}>{strength.charAt(0).toUpperCase() + strength.slice(1)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthWidth()} ${getStrengthColor()}`}
        ></div>
      </div>
    </div>
  )
}
