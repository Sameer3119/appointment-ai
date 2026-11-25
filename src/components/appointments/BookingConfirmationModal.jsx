import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Phone,
  User,
  Stethoscope,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Modal } from "../common/Modal";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { useApp } from "../../context/AppContext";

export function BookingConfirmationModal() {
  const { confirmationData, setConfirmationData, setNewlyBookedId } = useApp();
  const navigate = useNavigate();

  if (!confirmationData) return null;

  const handleViewAppointments = () => {
    setNewlyBookedId(confirmationData.id);
    setConfirmationData(null);
    navigate("/my-appointments");
  };

  return (
    <Modal
      isOpen={Boolean(confirmationData)}
      onClose={() => setConfirmationData(null)}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6 pt-1">
        {/* Success Header Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-100/90 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="inline-block text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
            Booking Confirmed via MediVoice AI
          </span>
          <h2 className="text-xl font-bold text-charcoal-900 tracking-tight">
            Appointment Confirmed!
          </h2>
          <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
            Your appointment has been registered with the doctor and added to your schedule.
          </p>
        </div>

        {/* Confirmation Summary Card */}
        <div className="bg-[#FAFBF9] border border-charcoal-200/80 rounded-2xl p-5 space-y-4">
          {/* Header Row: ID & Status */}
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-200/70">
            <div>
              <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider block">
                Booking Reference ID
              </span>
              <span className="text-sm font-mono font-bold text-charcoal-900">
                #{confirmationData.id.toUpperCase()}
              </span>
            </div>
            <Badge variant="confirmed" dot>
              {confirmationData.status || "Confirmed"}
            </Badge>
          </div>

          {/* Doctor Info */}
          <div className="flex items-center gap-3.5">
            <img
              src={confirmationData.doctorAvatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=120&auto=format&fit=crop"}
              alt={confirmationData.doctorName}
              className="w-12 h-12 rounded-xl object-cover border border-charcoal-200 shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-charcoal-900 truncate">
                {confirmationData.doctorName}
              </h4>
              <p className="text-xs text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                <Stethoscope className="w-3.5 h-3.5" />
                {confirmationData.speciality} Specialist
              </p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="bg-white p-3 rounded-xl border border-charcoal-100 flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <div>
                <span className="text-charcoal-400 block text-[10px] uppercase font-semibold">
                  Date
                </span>
                <span className="font-semibold text-charcoal-800">
                  {confirmationData.appointmentDate}
                </span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-charcoal-100 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <div>
                <span className="text-charcoal-400 block text-[10px] uppercase font-semibold">
                  Time Slot
                </span>
                <span className="font-semibold text-charcoal-800">
                  {confirmationData.appointmentTime}
                </span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-charcoal-100 flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <div>
                <span className="text-charcoal-400 block text-[10px] uppercase font-semibold">
                  Patient Phone
                </span>
                <span className="font-semibold text-charcoal-800 font-mono">
                  {confirmationData.patientPhone}
                </span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-charcoal-100 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <div>
                <span className="text-charcoal-400 block text-[10px] uppercase font-semibold">
                  Location
                </span>
                <span className="font-semibold text-charcoal-800">
                  {confirmationData.room || "Suite 402, Wing B"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <Button
            variant="primary"
            onClick={handleViewAppointments}
            icon={ArrowRight}
            iconPosition="right"
            className="w-full sm:flex-1 py-2.5 cursor-pointer"
          >
            Go to My Appointments
          </Button>

          <Button
            variant="secondary"
            onClick={() => setConfirmationData(null)}
            className="w-full sm:w-auto py-2.5 px-4 cursor-pointer"
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
