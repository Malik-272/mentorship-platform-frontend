import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AppLayout from "./ui/AppLayout"
import LandingPage from "./pages/LandingPage"

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/mentors" element={<div className="p-8 text-center">Mentors page coming soon...</div>} />
          <Route path="/communities" element={<div className="p-8 text-center">Communities page coming soon...</div>} />
          <Route
            path="/how-it-works"
            element={<div className="p-8 text-center">How it works page coming soon...</div>}
          />
          <Route path="/about" element={<div className="p-8 text-center">About page coming soon...</div>} />
          <Route path="/login" element={<div className="p-8 text-center">Login page coming soon...</div>} />
          <Route path="/register" element={<div className="p-8 text-center">Register page coming soon...</div>} />
        </Routes>
      </AppLayout>
    </Router>
  )
}

export default App
