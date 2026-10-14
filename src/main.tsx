import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./layouts/App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/homepage.tsx";
import Auth from "./components/auth.tsx";
import FindYourHome from "./components/findYourHome.tsx";
import ScrollToTop from "./components/scrollToTop.tsx";
import ProtectedRoute from "./components/protectedRoute.tsx";
import Dashboard from "./pages/dashboard.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<App />}>
          <Route index element={<Homepage />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/find-your-home" element={<FindYourHome />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
