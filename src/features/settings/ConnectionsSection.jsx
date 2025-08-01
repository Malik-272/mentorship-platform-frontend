import { useGetAppConnectionsStates } from "../../hooks/useSettings";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = encodeURIComponent("http://localhost:3000/api/v1/auth/google-callback");
const SCOPE = encodeURIComponent("https://www.googleapis.com/auth/calendar");
const RESPONSE_TYPE = "code";
const ACCESS_TYPE = "offline";
const PROMPT = "consent";

// Construct the URL
const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&access_type=${ACCESS_TYPE}&prompt=${PROMPT}`;

export default function ConnectionsSection() {
  const {
    refetch,
    data : connectionState,
  } = useGetAppConnectionsStates();
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">App Connections</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Connect your account to external apps like Google Calendar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
              alt="Google Calendar"
              className="w-10 h-10"
            />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Google Calendar</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sync sessions with your Google calendar
              </p>
            </div>
          </div>
          {
           connectionState?.appConnections?.GoogleCalendar ?
            <a
          onClick={() => {alert("It's too late my mate :)")}}
            href={''}
            className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            Disconnect
          </a>
          :
            <a
          onClick={refetch}
            href={GOOGLE_AUTH_URL}
            className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            Connect
          </a>
          }
        </div>
      </div>
    </div>
  );
}
