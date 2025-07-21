import NavBar from "./NavBar";
import Footer from "./Footer";
import Main from "./Main";
import { ThemeProvider } from "../context/ThemeContext";

export default function AppLayout() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="growtly-theme">
      <div className="min-h-screen bg-white  dark:bg-gray-900 transition-colors">
        <NavBar />
        <Main />
        <Footer />
      </div>
    </ThemeProvider>
  );
}
