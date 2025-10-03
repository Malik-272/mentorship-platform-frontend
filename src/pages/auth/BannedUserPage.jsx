import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Ban, Mail } from "lucide-react";

export default function BannedUserFeedback() {
  const { banReason, logout: logoutMutation } = useAuth();
  const navigate = useNavigate();

  // Random fixed ban reason for now
  const BAN_REASON =
    "Repeated violations of community guidelines (spam-like behavior detected).";

  const subject = `Ban Appeal`;
  const mailtoHref = `mailto:sgrowthly@gmail.com?subject=${encodeURIComponent(
    subject
  )}`;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
      onError: () => {
        navigate("/login");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-7xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 lg:p-12">
        <div className="flex items-start gap-4 md:gap-6">
          <div className="shrink-0 w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
            <Ban className="w-9 h-9 text-red-600 dark:text-red-400" />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              You have been banned from accessing the platform
            </h2>

            <p className="text-gray-700 dark:text-gray-200 mb-8">
              If you believe this is a mistake or you’d like to request a review,
              please submit an appeal by emailing{" "}
              <a
                href={mailtoHref}
                className="underline font-medium text-blue-700 dark:text-blue-400"
              >
                sgrowthly@gmail.com
              </a>
              . Include any relevant context that might help us reassess the ban.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={mailtoHref}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-5 rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5" />
                Appeal via Email
              </a>
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-medium py-3 px-5 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
