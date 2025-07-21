import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const { confirmEmail, setStatus } = useAuth();
  const { mutate, isPending, isError, error } = confirmEmail;
  useEffect(() => {
    if (code) {
      mutate({ code }); // Automatically send confirmation request
      console.log("Confirming email with code:", code);
    }
  }, [code, mutate]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <div>Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-red-600 dark:text-red-400">
        <div>Error: {error.message}</div>
      </div>
    );
  } else {
    setStatus("full"); // Set status to full after successful confirmation
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Email Confirmation
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Your email has been successfully confirmed!
        </p>
      </div>
    </div>
  );
}
