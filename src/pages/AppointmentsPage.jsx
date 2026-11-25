import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Plus,
  PhoneCall,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { PatientAppointmentCard } from "../components/appointments/PatientAppointmentCard";
import { AppointmentDetailsModal } from "../components/appointments/AppointmentDetailsModal";
import { Button } from "../components/common/Button";
import { useApp } from "../context/AppContext";

export function AppointmentsPage() {
  const {
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments,
    newlyBookedId,
    cancelAppointment,
    openCallModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' | 'completed' | 'cancelled' | 'all'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Filter based on active tab & search
  const displayedAppointments = useMemo(() => {
    let list = [];
    if (activeTab === "upcoming") {
      list = upcomingAppointments;
    } else if (activeTab === "completed") {
      list = completedAppointments;
    } else if (activeTab === "cancelled") {
      list = cancelledAppointments;
    } else {
      list = [...upcomingAppointments, ...completedAppointments, ...cancelledAppointments];
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (apt) =>
          apt.doctorName.toLowerCase().includes(q) ||
          apt.speciality.toLowerCase().includes(q) ||
          apt.appointmentDate.includes(q) ||
          (apt.reason && apt.reason.toLowerCase().includes(q))
      );
    }

    return list;
  }, [activeTab, searchQuery, upcomingAppointments, completedAppointments, cancelledAppointments]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
            My Appointments
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-0.5">
            Manage your doctor consultations, view upcoming schedules and consultation history.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={openCallModal}
            icon={PhoneCall}
            className="font-bold shadow-xs cursor-pointer"
          >
            Talk to MediVoice AI
          </Button>

          <Link to="/doctors">
            <Button variant="secondary" size="md" icon={Plus} className="cursor-pointer">
              Book New Doctor
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="bg-white rounded-2xl border border-surface-border p-4 shadow-card space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Segmented Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "upcoming"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "bg-charcoal-50 text-charcoal-700 hover:bg-charcoal-100"
              }`}
            >
              <span>Upcoming</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === "upcoming" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {upcomingAppointments.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "completed"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "bg-charcoal-50 text-charcoal-700 hover:bg-charcoal-100"
              }`}
            >
              <span>Completed</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === "completed" ? "bg-white/20 text-white" : "bg-charcoal-200 text-charcoal-700"
                }`}
              >
                {completedAppointments.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("cancelled")}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "cancelled"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "bg-charcoal-50 text-charcoal-700 hover:bg-charcoal-100"
              }`}
            >
              <span>Cancelled</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === "cancelled" ? "bg-white/20 text-white" : "bg-charcoal-200 text-charcoal-700"
                }`}
              >
                {cancelledAppointments.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "all"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "bg-charcoal-50 text-charcoal-700 hover:bg-charcoal-100"
              }`}
            >
              <span>All Visits</span>
            </button>
          </div>

          {/* Search in appointments */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by doctor or speciality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-charcoal-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-[#FAFBF9]"
            />
          </div>
        </div>
      </div>

      {/* Appointments List / Grid */}
      {displayedAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-border p-12 text-center">
          <Calendar className="w-8 h-8 text-charcoal-300 mx-auto mb-2" />
          <h4 className="text-base font-bold text-charcoal-900">
            No {activeTab !== "all" ? activeTab : ""} appointments found
          </h4>
          <p className="text-xs text-charcoal-500 max-w-sm mx-auto mt-1">
            {activeTab === "upcoming"
              ? "You don't have any upcoming doctor appointments scheduled. Talk to MediVoice AI or choose a doctor to book."
              : "No records found matching this category or filter."}
          </p>

          <div className="mt-4 flex items-center justify-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              onClick={openCallModal}
              icon={PhoneCall}
            >
              Talk to MediVoice AI
            </Button>
            <Link to="/doctors">
              <Button variant="secondary" size="sm">
                Find Doctors
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedAppointments.map((apt) => (
            <PatientAppointmentCard
              key={apt.id}
              appointment={apt}
              isNewlyBooked={apt.id === newlyBookedId || apt.isNewlyCreated}
              onViewDetails={(appointment) => setSelectedAppointment(appointment)}
              onCancelAppointment={(appointment) => setSelectedAppointment(appointment)}
              onTalkToAI={openCallModal}
            />
          ))}
        </div>
      )}

      {/* Appointment Details & Cancellation Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={Boolean(selectedAppointment)}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}
