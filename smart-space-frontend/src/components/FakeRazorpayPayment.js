import React, { useState } from "react";
import axios from "axios";
import { CheckCircle2, CreditCard, IndianRupee, LoaderCircle, X } from "lucide-react";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
};

const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message === "Network Error") {
    return "Booking service is not reachable. Make sure the backend server is running.";
  }

  return error?.message || "Payment failed";
};

const FakeRazorpayPayment = ({ booking, onPaymentSuccess, onPaymentClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState("confirm");

  const handleFakePayment = async () => {
    setIsProcessing(true);
    setPaymentStep("processing");

    setTimeout(async () => {
      try {
        const user = getStoredUser();
        const userId = String(booking.userId || user?.id || user?._id || "").trim();
        const userName = String(booking.userName || user?.name || "Customer").trim();

        if (!userId) {
          alert("Please login again before booking.");
          setPaymentStep("confirm");
          setIsProcessing(false);
          return;
        }

        const response = await axios.post("http://localhost:5000/api/bookings/create", {
          userId,
          userName,
          spaceId: booking.spaceId,
          spaceTitle: booking.spaceTitle,
          location: booking.location,
          price: booking.price,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          paymentStatus: "PAID",
          paymentMethod: "Fake Razorpay",
        });

        setPaymentStep("success");
        setIsProcessing(false);

        setTimeout(() => {
          onPaymentSuccess(response.data?.bookingId || response.data?.booking?._id);
        }, 2000);
      } catch (error) {
        console.error("Error creating booking:", error);
        alert(getErrorMessage(error));
        setPaymentStep("confirm");
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel narrow">
        {paymentStep === "confirm" && (
          <>
            <div className="modal-header">
              <div>
                <p className="eyebrow">
                  <CreditCard size={15} />
                  Demo payment
                </p>
                <h2 className="modal-title">Confirm your booking</h2>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={onPaymentClose}
                aria-label="Close payment"
                title="Close"
              >
                <X size={17} />
              </button>
            </div>

            <div className="summary-box">
              <div className="summary-row">
                <span>Space</span>
                <strong>{booking.spaceTitle}</strong>
              </div>
              <div className="summary-row">
                <span>Location</span>
                <strong>{booking.location}</strong>
              </div>
              <div className="summary-row">
                <span>Date</span>
                <strong>{booking.date}</strong>
              </div>
              <div className="summary-row">
                <span>Time</span>
                <strong>
                  {booking.startTime} - {booking.endTime}
                </strong>
              </div>
              <div className="summary-row total">
                <span>Amount</span>
                <strong className="inline-icon">
                  <IndianRupee size={16} />
                  {booking.price}
                </strong>
              </div>
            </div>

            <p className="page-subtitle">
              This is a demo Razorpay flow. Use Pay Now to simulate a successful
              payment and create the booking.
            </p>

            <div className="form-grid" style={{ marginTop: 18 }}>
              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={handleFakePayment}
                disabled={isProcessing}
              >
                <CreditCard size={17} />
                Pay Now
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-full"
                onClick={onPaymentClose}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {paymentStep === "processing" && (
          <div className="empty-state">
            <LoaderCircle size={42} style={{ animation: "spin 1s linear infinite" }} />
            <h2>Processing payment</h2>
            <p>Please wait while we confirm the transaction.</p>
          </div>
        )}

        {paymentStep === "success" && (
          <div className="empty-state">
            <CheckCircle2 size={44} color="var(--success)" />
            <h2>Payment successful</h2>
            <p>Your booking has been confirmed. Opening invoice...</p>
          </div>
        )}

        <style>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default FakeRazorpayPayment;
