import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Loader2, AlertCircle, Mail } from "lucide-react"
import { authApi } from "../services/authApi"

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
    <p className="text-gray-600">Checking authentication...</p>
  </div>
)


