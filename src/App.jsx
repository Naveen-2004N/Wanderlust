/* Fix App layout — announcement bar is sticky, navbar is fixed below it */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocationProvider } from "./context/LocationContext";
import AnnouncementBar from "./components/layout/AnnouncementBar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import DestinationDetailPage from "./pages/DestinationDetailPage";
import "./styles/globals.css";
import "./styles/animations.css";

function NotFound() {
  return (
    <main style={{
      minHeight: "80vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <p style={{ fontSize: "4rem" }}>🌍</p>
        <h1 style={{ fontSize: 28, fontWeight: 300, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
          Page not found
        </h1>
        <p style={{ color: "var(--text-body)", opacity: 0.7 }}>This page doesn't exist.</p>
        <a href="/" style={{ color: "var(--color-electric-iris)", fontWeight: 600, textDecoration: "underline" }}>
          Go home →
        </a>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LocationProvider>
        {/* AnnouncementBar is sticky top:0 z-index:201 */}
        <AnnouncementBar />
        {/* Navbar is fixed, sits below announcement bar */}
        <Navbar />
        <Routes>
          <Route path="/"                   element={<HomePage />} />
          <Route path="/explore"            element={<ExplorePage />} />
          <Route path="/destination/:id"    element={<DestinationDetailPage />} />
          <Route path="*"                   element={<NotFound />} />
        </Routes>
        <Footer />
      </LocationProvider>
    </BrowserRouter>
  );
}
