# MediVoice AI – Patient Doctor Appointment Booking Platform

MediVoice AI is a patient-facing doctor appointment booking platform built with **React**, **Vite**, **Tailwind CSS**, and **Lucide Icons**. It empowers patients to discover specialists, browse available dates and time slots, and converse with **MediVoice AI** via a natural, low-latency simulated telephone interface to check availability, book visits, or cancel appointments.

---

## 🌟 Key Patient Features

### 1. Patient Home Page (`/`)
- **Patient Welcome Banner**: *"Your health, one conversation away."* with a prominent **"Talk to MediVoice AI"** button.
- **Quick Doctor Search**: Instant search by specialist name, symptom (e.g. *"heart check"*, *"skin rash"*), or department.
- **Browse Specialities**: Direct access to Cardiology, Dermatology, Neurology, Orthopaedics, General Medicine, and Pulmonology.
- **Upcoming Appointment Card**: Displays your next scheduled consultation (doctor name, speciality, date, time, clinic room, and quick management actions).
- **Top Rated Specialists**: Highlights verified doctors with ratings, reviews, consultation fees, and instant slot booking.
- **Simple Booking Call-To-Action**: Banner prompting patients to start a voice call or browse doctor schedules.

### 2. Find Doctors (`/doctors`)
- **Specialist Directory**: View detailed doctor cards with verified ratings, qualifications, hospital affiliation, and consultation fees.
- **Filters & Search**: Filter by speciality chips, search query, or same-day availability.
- **Interactive Slot Booking Modal**:
  - Select preferred date (Today, Tomorrow, Upcoming days).
  - Select specific time slots (e.g. 10:00 AM, 11:30 AM).
  - Pre-filled patient information (John Anderson, phone number).
  - Instant booking confirmation without administrative friction.

### 3. My Appointments (`/my-appointments`)
- **Consistent Patient Identity**: Default patient profile for John Anderson (`+1 (555) 234-8901`).
- **Segmented Tabs**:
  - **Upcoming Appointments**: Active confirmed consultations with newly booked highlights.
  - **Completed Visits**: Past consultation history and prescriptions.
  - **Cancelled Appointments**: Records of cancelled appointments with recorded reasons.
- **Appointment Details Modal**: Full summary of doctor, location, fee, date & time.
- **Cancellation with Confirmation**: Easy 1-click cancellation with reason prompt that updates all views immediately.

### 4. Talk to MediVoice AI (`/voice`)
- **Phone-Style Calling HUD**: Styled as a clinical smartphone call with top speaker notch, status pill (*Connecting* ➔ *Connected* ➔ *Call Ended*), and live call timer (`mm:ss`).
- **Dynamic Audio Visualizer**: 12 frequency wave bars that animate when the AI or patient speaks.
- **3 Interactive Voice Scenarios**:
  1. **Book an Appointment**: Converses with AI to book a cardiologist for tomorrow at 10 AM.
  2. **Check Doctor Availability**: Inquires about Dr. Priya Nair's open slots and books 1:00 PM.
  3. **Cancel Appointment**: Inquires about cancelling an upcoming appointment with Dr. Sharma.
- **Live Transcript Stream**: Turn-by-turn chat transcript with speech-to-text bubbles.
- **Interactive Controls**: Mute/unmute microphone, speaker output toggle, and call end button.
- **Automatic State Synchronization**: Booking or cancelling via the voice assistant immediately updates the Home page, My Appointments page, and local storage.

### 5. Profile & Settings (`/settings`)
- **Patient Profile**: Name, phone number, email address, and emergency contact details.
- **Notification Preferences**: SMS alerts, WhatsApp confirmation messages, and email summaries.
- **Voice Preferences**: Preferred spoken language (English, Spanish, Hindi) and medical records sharing.
- **Reset Demo Data**: Easily restore initial demo appointments.

---

## 🚀 Running Locally

```bash
# Start Vite development server
npm run dev
```

Open **`http://localhost:3000/`** in your browser.

```bash
# Production Build
npm run build
```
