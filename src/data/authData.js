import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

// Register the English locale for country names
countries.registerLocale(enLocale);
const countryNames = countries.getNames("en");

export const countryCodes = Object.fromEntries(
  Object.entries(countryNames).map(([key, value]) => [countries.alpha2ToAlpha3(key), value])
);

export const validationRules = {
  name: {
    required: "Name is required",
    minLength: { value: 3, message: "Name must be at least 3 characters" },
    maxLength: { value: 50, message: "Name must not exceed 50 characters" },
    pattern: {
      value: /^[a-zA-Z\s]+$/,
      message: "Name can only contain letters and spaces",
    },
  },
  id: {
    required: "Username is required",
    minLength: { value: 3, message: "Username must be at least 3 characters" },
    maxLength: { value: 32, message: "Username must not exceed 32 characters" },
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
      message: "Username can only contain letters, numbers, and underscores",
    },
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Please enter a valid email address",
    },
  },
  headline: {
    required: "Headline is required",
    minLength: { value: 5, message: "Headline must be at least 5 characters" },
    maxLength: { value: 50, message: "Headline must not exceed 50 characters" },
  },
  password: {
    required: "Password is required",
    minLength: { value: 8, message: "Password must be at least 8 characters" },
    maxLength: { value: 72, message: "Password must not exceed 72 characters" },
    validate: {
      hasUppercase: (value) => /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
      hasLowercase: (value) => /[a-z]/.test(value) || "Password must contain at least one lowercase letter",
      hasNumber: (value) => /\d/.test(value) || "Password must contain at least one number",
      hasSpecialChar: (value) =>
        /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Password must contain at least one special character",
    },
  },
  country: {
    required: "Country is required",
    validate: (value) => {
      if (!value) return "Please select a country"
      const isValid = Object.keys(countryCodes).some((key) => key === value)
      return isValid || "Please select a valid country"
    },
  },
  role: {
    required: "Please select your role",
    validate: (value) => {
      if (!value) return "Please select whether you want to be a mentee or mentor"
      return ["mentee", "mentor"].includes(value) || "Role must be either mentee or mentor"
    },
  },
}
