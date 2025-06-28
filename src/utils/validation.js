export const validateCountryAlpha3Code = (code) => {
  const validCodes = [
    "AFG",
    "ALB",
    "DZA",
    "AND",
    "AGO",
    "ARG",
    "ARM",
    "AUS",
    "AUT",
    "AZE",
    "BHR",
    "BGD",
    "BLR",
    "BEL",
    "BRA",
    "BGR",
    "CAN",
    "CHN",
    "COL",
    "CZE",
    "DNK",
    "EGY",
    "EST",
    "FIN",
    "FRA",
    "DEU",
    "GRC",
    "HUN",
    "IND",
    "IDN",
    "IRN",
    "IRQ",
    "IRL",
    "ISR",
    "ITA",
    "JPN",
    "JOR",
    "KWT",
    "LBN",
    "LBY",
    "MAR",
    "NLD",
    "NZL",
    "NOR",
    "OMN",
    "PAK",
    "PSE",
    "POL",
    "PRT",
    "QAT",
    "ROU",
    "RUS",
    "SAU",
    "SGP",
    "ZAF",
    "KOR",
    "ESP",
    "SWE",
    "CHE",
    "SYR",
    "TUN",
    "TUR",
    "ARE",
    "GBR",
    "USA",
    "YEM",
  ]
  return validCodes.includes(code)
}

export const getPasswordStrength = (password) => {
  let score = 0
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  Object.values(checks).forEach((check) => {
    if (check) score++
  })

  if (score < 3) return { strength: "weak", color: "text-red-500" }
  if (score < 5) return { strength: "medium", color: "text-yellow-500" }
  return { strength: "strong", color: "text-green-500" }
}
