import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AppLayout } from "./components/layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import { DoctorsPage } from "./pages/DoctorsPage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { VoicePage } from "./pages/VoicePage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="my-appointments" element={<AppointmentsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="voice" element={<VoicePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
