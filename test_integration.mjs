/**
 * End-to-End Integration Test Suite for MediVoice AI
 * Verifies Frontend-Backend connection against running FastAPI SQLite backend
 */

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

async function runIntegrationVerification() {
  console.log("===============================================================");
  console.log("MEDIVOICE AI: FRONTEND & BACKEND INTEGRATION VERIFICATION");
  console.log(`Backend Base URL: ${API_BASE_URL}`);
  console.log("===============================================================\n");

  const results = [];

  function record(step, ok, detail) {
    results.push({ step, ok, detail });
    console.log(`[${ok ? "PASS" : "FAIL"}] ${step}: ${detail}`);
  }

  // 1. Health check
  try {
    const res = await fetch("http://127.0.0.1:8000/health");
    const json = await res.json();
    if (res.status === 200 && json.status === "ok" && json.database === "connected") {
      record("1. Backend Health Check", true, `Status 200 OK, DB ${json.database}`);
    } else {
      record("1. Backend Health Check", false, `Unexpected response: ${JSON.stringify(json)}`);
    }
  } catch (err) {
    record("1. Backend Health Check", false, err.message);
  }

  // 2. Doctor listing
  let testDoctor = null;
  try {
    const res = await fetch(`${API_BASE_URL}/doctors`);
    const docs = await res.json();
    if (res.status === 200 && Array.isArray(docs) && docs.length > 0) {
      testDoctor = docs[0];
      record("2. Doctor Listing (GET /doctors)", true, `Loaded ${docs.length} doctors from SQLite. Selected #${testDoctor.id} ${testDoctor.name} (${testDoctor.specialty})`);
    } else {
      record("2. Doctor Listing (GET /doctors)", false, `Status ${res.status}`);
    }
  } catch (err) {
    record("2. Doctor Listing (GET /doctors)", false, err.message);
  }

  // 3. Speciality filtering
  try {
    const res = await fetch(`${API_BASE_URL}/doctors?specialty=Cardiology`);
    const cardioDocs = await res.json();
    if (res.status === 200 && Array.isArray(cardioDocs) && cardioDocs.length > 0) {
      const allCardio = cardioDocs.every((d) => d.specialty.toLowerCase().includes("cardio"));
      record("3. Speciality Filtering (GET /doctors?specialty=Cardiology)", allCardio, `Found ${cardioDocs.length} cardiology doctor(s)`);
    } else {
      record("3. Speciality Filtering", false, `Status ${res.status}`);
    }
  } catch (err) {
    record("3. Speciality Filtering", false, err.message);
  }

  // 4. Date-specific slot retrieval
  // Choose a date 2 days in the future to avoid any conflicts
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 2);
  const dateStr = targetDate.toISOString().split("T")[0]; // YYYY-MM-DD
  let chosenSlotTime = null;

  try {
    const res = await fetch(`${API_BASE_URL}/doctors/${testDoctor.id}/availability?date=${dateStr}`);
    const avail = await res.json();
    if (res.status === 200 && Array.isArray(avail.slots) && avail.slots.length === 16) {
      chosenSlotTime = avail.available_slots[0] || "10:00";
      record("4. Date-Specific Slot Retrieval (GET /doctors/{id}/availability)", true, `Retrieved ${avail.slots.length} 30-min slots for date ${dateStr}. Available: ${avail.available_slots.length}. Selected slot: ${chosenSlotTime}`);
    } else {
      record("4. Date-Specific Slot Retrieval", false, `Status ${res.status}, slots: ${avail.slots?.length}`);
    }
  } catch (err) {
    record("4. Date-Specific Slot Retrieval", false, err.message);
  }

  // 5. Book a real test appointment
  const testPhone = "+1 (555) 234-8901"; // Consistent demo patient phone
  const testPatientName = "John Anderson";
  let createdAppointment = null;

  try {
    const bookingPayload = {
      doctor_id: testDoctor.id,
      appointment_date: `${dateStr}T${chosenSlotTime}:00`,
      patient_phone: testPhone,
      patient_name: testPatientName,
      patient_email: "john.anderson@example.com",
      reason: "E2E Integration Verification Visit",
      notes: "Slot availability check",
    };

    const res = await fetch(`${API_BASE_URL}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingPayload),
    });

    const booked = await res.json();
    if (res.status === 201 && booked.id) {
      createdAppointment = booked;
      record("5. Real Appointment Booking (POST /appointments)", true, `Booked Appointment ID #${booked.id} for ${testPatientName} on ${dateStr} at ${chosenSlotTime}`);
    } else {
      record("5. Real Appointment Booking (POST /appointments)", false, `Status ${res.status}: ${JSON.stringify(booked)}`);
    }
  } catch (err) {
    record("5. Real Appointment Booking", false, err.message);
  }

  // 6. Verify slot is now BOOKED and removed from availability
  try {
    const res = await fetch(`${API_BASE_URL}/doctors/${testDoctor.id}/availability?date=${dateStr}`);
    const availAfter = await res.json();
    const isSlotAvailable = availAfter.available_slots.includes(chosenSlotTime);
    record("6. Slot Exclusion Check", !isSlotAvailable, `Slot ${chosenSlotTime} on ${dateStr} is ${isSlotAvailable ? "STILL AVAILABLE (FAILED)" : "CORRECTLY MARKED BOOKED & EXCLUDED"}`);
  } catch (err) {
    record("6. Slot Exclusion Check", false, err.message);
  }

  // 7. Verify persistence by querying by patient phone
  try {
    const res = await fetch(`${API_BASE_URL}/appointments/by-phone/${encodeURIComponent(testPhone.trim())}`);
    const patientAppointments = await res.json();
    const found = patientAppointments.find((a) => a.id === createdAppointment?.id);
    if (res.status === 200 && found) {
      record("7. Appointment Persistence (GET /appointments/by-phone/{phone})", true, `Found appointment #${found.id} for phone ${testPhone} in SQLite database (Status: ${found.status})`);
    } else {
      record("7. Appointment Persistence", false, `Appointment #${createdAppointment?.id} not found in patient list`);
    }
  } catch (err) {
    record("7. Appointment Persistence", false, err.message);
  }

  // 8. Prevent duplicate booking (Double booking validation)
  try {
    const duplicatePayload = {
      doctor_id: testDoctor.id,
      appointment_date: `${dateStr}T${chosenSlotTime}:00`,
      patient_phone: "+1-555-999-0000",
      patient_name: "Another Patient",
    };

    const res = await fetch(`${API_BASE_URL}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(duplicatePayload),
    });

    if (res.status === 409) {
      const errJson = await res.json();
      record("8. Conflict & Double-Booking Prevention", true, `Blocked double-booking with HTTP 409 Conflict: "${errJson.detail}"`);
    } else {
      record("8. Conflict & Double-Booking Prevention", false, `Expected 409, got ${res.status}`);
    }
  } catch (err) {
    record("8. Conflict & Double-Booking Prevention", false, err.message);
  }

  // 9. Cancel the test appointment
  if (createdAppointment) {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${createdAppointment.id}/cancel`, {
        method: "PATCH",
      });
      const cancelled = await res.json();
      if (res.status === 200 && cancelled.status === "cancelled") {
        record("9. Appointment Cancellation (PATCH /appointments/{id}/cancel)", true, `Cancelled appointment #${createdAppointment.id}. Status: ${cancelled.status}`);
      } else {
        record("9. Appointment Cancellation", false, `Status ${res.status}: ${JSON.stringify(cancelled)}`);
      }
    } catch (err) {
      record("9. Appointment Cancellation", false, err.message);
    }

    // 10. Verify slot becomes AVAILABLE again after cancellation
    try {
      const res = await fetch(`${API_BASE_URL}/doctors/${testDoctor.id}/availability?date=${dateStr}`);
      const availAfterCancel = await res.json();
      const isSlotRestored = availAfterCancel.available_slots.includes(chosenSlotTime);
      record("10. Slot Restoration Check After Cancellation", isSlotRestored, `Slot ${chosenSlotTime} on ${dateStr} is ${isSlotRestored ? "CORRECTLY RESTORED AS AVAILABLE" : "NOT RESTORED (FAILED)"}`);
    } catch (err) {
      record("10. Slot Restoration Check", false, err.message);
    }
  }

  console.log("\n===============================================================");
  const allPassed = results.every((r) => r.ok);
  console.log(`TOTAL CHECKS: ${results.length} | PASSED: ${results.filter((r) => r.ok).length} | FAILED: ${results.filter((r) => !r.ok).length}`);
  console.log(`OVERALL RESULT: ${allPassed ? "ALL INTEGRATION TESTS PASSED!" : "SOME TESTS FAILED"}`);
  console.log("===============================================================");
}

runIntegrationVerification();
