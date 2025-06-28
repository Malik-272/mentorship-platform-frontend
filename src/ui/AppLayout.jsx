import { useAuth, useLogout } from "../hooks/useAuth";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Main from "./Main";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <Main />
      <Footer />
    </div>
  );
}
