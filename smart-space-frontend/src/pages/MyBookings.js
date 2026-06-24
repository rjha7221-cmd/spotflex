import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  MapPin,
  MessageSquare,
  QrCode,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

import ChatBox from "../components/ChatBox";
import InvoiceModal from "../components/InvoiceModal";

const fallbackImage =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop";

const toMinutes = (time) => {
  if (!time || !time.includes(":")) {
    return NaN;
  }

  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleStartTime, setRescheduleStartTime] = useState("");
  const [rescheduleEndTime, setRescheduleEndTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [invoiceBooking, setInvoiceBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        setLoading(false);
        return;
      }

      const userId = user.id || user._id;
      const res = await axios.get(`http://localhost:5000/api/bookings/user/${userId}`);

      console.log("Bookings fetched:", res.data);
      setBookings(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching bookings:", error);
      setLoading(false);
    }
  };

  const getStatus = (booking) => {
    if (booking.status === "cancelled") {
      return "cancelled";
    }

    const endDateTime = new Date(`${booking.date}T${booking.endTime}`);
    return endDateTime < new Date() ? "completed" : "upcoming";
  };

  const getStatusClass = (status) => {
    if (status === "completed") return "badge-muted";
    if (status === "cancelled") return "badge-danger";
    return "badge-success";
  };

  const openReschedule = (booking) => {
    setEditingBooking(booking);
    setRescheduleDate(booking.date);
    setRescheduleStartTime(booking.startTime);
    setRescheduleEndTime(booking.endTime);
  };

  const closeReschedule = () => {
    setEditingBooking(null);
    setRescheduleDate("");
    setRescheduleStartTime("");
    setRescheduleEndTime("");
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
      alert("Booking deleted");
      setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      console.log(error);
      alert("Failed to delete booking");
    }
  };

  const handleReschedule = async () => {
    if (!editingBooking) return;

    if (!rescheduleDate || !rescheduleStartTime || !rescheduleEndTime) {
      return alert("Fill all fields");
    }

    const startMinutes = toMinutes(rescheduleStartTime);
    const endMinutes = toMinutes(rescheduleEndTime);

    if (endMinutes <= startMinutes) {
      return alert("End time must be after start time");
    }

    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${editingBooking._id}/reschedule`,
        {
          date: rescheduleDate,
          startTime: rescheduleStartTime,
          endTime: rescheduleEndTime,
        }
      );

      alert("Booking rescheduled");
      closeReschedule();
      fetchBookings();
    } catch (error) {
      console.log(error);
      alert("Failed to reschedule booking");
    }
  };

  const openInvoice = (booking) => {
    setInvoiceBooking({
      _id: booking._id,
      title: booking.spaceTitle,
      location: booking.location,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      price: booking.price,
      customer: booking.userName,
      paymentId: booking.paymentId,
      paymentMethod: booking.paymentMethod || "Fake Razorpay",
      paymentStatus: booking.paymentStatus || "PAID",
      qrCode: booking.qrCode,
      qrPayload: booking.qrPayload,
      checkInStatus: booking.checkInStatus || "pending",
    });
  };

  if (loading) {
    return (
      <main className="page-shell">
        <div className="empty-state">
          <h2>Loading bookings</h2>
          <p>Fetching your upcoming and completed reservations.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">
            <CalendarDays size={15} />
            Reservations
          </p>
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">
            Review upcoming visits, reschedule when needed, and message the
            space owner.
          </p>
        </div>
      </header>

      {bookings.length > 0 ? (
        <div className="booking-grid">
          {bookings.map((booking) => {
            const status = getStatus(booking);
            const canManage = status === "upcoming";
            const userData = JSON.parse(localStorage.getItem("user"));

            return (
              <article key={booking._id} className="space-card booking-card">
                <div className="space-card-image">
                  <img
                    src={booking.image || fallbackImage}
                    alt={booking.spaceTitle || "Booked space"}
                  />
                </div>

                <div className="booking-card-body">
                  <div className="booking-card-top">
                    <h2 className="space-card-title">{booking.spaceTitle}</h2>
                    <span className={`badge ${getStatusClass(status)}`}>{status}</span>
                  </div>

                  <p className="meta-row">
                    <MapPin size={16} />
                    {booking.location}
                  </p>
                  <p className="meta-row">
                    <CalendarDays size={16} />
                    {booking.date}
                  </p>
                  <p className="meta-row">
                    <Clock3 size={16} />
                    {booking.startTime} - {booking.endTime}
                  </p>
                  <p className="price">
                    <IndianRupee size={18} />
                    {booking.price}
                  </p>

                  <div className="booking-qr-strip">
                    <div className="booking-qr-thumb">
                      {booking.qrCode ? (
                        <img src={booking.qrCode} alt="Booking QR" />
                      ) : (
                        <QrCode size={34} />
                      )}
                    </div>
                    <div>
                      <p className="qr-strip-title">
                        <QrCode size={15} />
                        Entry QR
                      </p>
                      <span
                        className={`badge ${
                          booking.checkInStatus === "verified"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {booking.checkInStatus === "verified" ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <ShieldCheck size={14} />
                        )}
                        {booking.checkInStatus || "pending"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-full"
                    onClick={() => openInvoice(booking)}
                  >
                    <ReceiptText size={17} />
                    Open Invoice
                  </button>

                  {canManage && (
                    <div className="action-row">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => openReschedule(booking)}
                      >
                        <RotateCcw size={17} />
                        Reschedule
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        <Trash2 size={17} />
                        Cancel
                      </button>
                    </div>
                  )}

                  <div className="section-block" style={{ marginTop: 8 }}>
                    <p className="eyebrow">
                      <MessageSquare size={15} />
                      Chat
                    </p>
                    <ChatBox
                      roomId={booking._id}
                      userName={userData?.name || "User"}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No bookings found</h2>
          <p>Your confirmed spaces will appear here after checkout.</p>
        </div>
      )}

      {editingBooking && (
        <div className="modal-backdrop">
          <div className="modal-panel narrow">
            <div className="modal-header">
              <div>
                <p className="eyebrow">
                  <RotateCcw size={15} />
                  Reschedule
                </p>
                <h2 className="modal-title">Update booking time</h2>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={closeReschedule}
                aria-label="Close reschedule modal"
                title="Close"
              >
                <X size={17} />
              </button>
            </div>

            <div className="form-grid">
              <label className="input-with-icon">
                <CalendarDays size={18} />
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="field"
                />
              </label>
              <label className="input-with-icon">
                <Clock3 size={18} />
                <input
                  type="time"
                  value={rescheduleStartTime}
                  onChange={(e) => setRescheduleStartTime(e.target.value)}
                  className="field"
                />
              </label>
              <label className="input-with-icon">
                <Clock3 size={18} />
                <input
                  type="time"
                  value={rescheduleEndTime}
                  onChange={(e) => setRescheduleEndTime(e.target.value)}
                  className="field"
                />
              </label>

              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={handleReschedule}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-full"
                onClick={closeReschedule}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {invoiceBooking && (
        <InvoiceModal
          invoiceData={invoiceBooking}
          onClose={() => setInvoiceBooking(null)}
        />
      )}
    </main>
  );
}

export default MyBookings;
