import { Outlet } from "react-router-dom";
function Main() {
  return (
    <main className="flex-1">
      <Outlet />
    </main>
  );
}

export default Main;
