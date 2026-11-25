import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { ToastContainer } from "../common/Toast";
import { VoiceCallModal } from "../voice/VoiceCallModal";
import { BookingConfirmationModal } from "../appointments/BookingConfirmationModal";
import { useApp } from "../../context/AppContext";
import { cn } from "../../utils/cn";

export function AppLayout() {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        {/* Sticky Top Navigation */}
        <TopNav />

        {/* Dynamic Page Routed Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Interactive Modals & Floating Toasts */}
      <ToastContainer />
      <VoiceCallModal />
      <BookingConfirmationModal />
    </div>
  );
}
