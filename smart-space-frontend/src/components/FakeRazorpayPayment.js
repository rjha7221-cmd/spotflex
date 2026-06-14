import React, { useState } from "react";
import axios from "axios";

const FakeRazorpayPayment = ({ booking, onPaymentSuccess, onPaymentClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState("confirm"); // confirm, processing, success

  const handleFakePayment = async () => {
    setIsProcessing(true);
    setPaymentStep("processing");

    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        // Create booking in database
        const response = await axios.post(
          "http://localhost:5000/api/bookings/create",
          {
            userId: user.id || user._id,
            userName: user.name,
            spaceId: booking.spaceId,
            spaceTitle: booking.spaceTitle,
            location: booking.location,
            price: booking.price,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            paymentStatus: "PAID",
            paymentMethod: "Fake Razorpay",
          }
        );

        setPaymentStep("success");
        setIsProcessing(false);

        // Auto close after 2 seconds
        setTimeout(() => {
          onPaymentSuccess(response.data.bookingId || booking._id);
        }, 2000);
      } catch (error) {
        console.error("Error creating booking:", error);
        alert("Payment failed");
        setPaymentStep("confirm");
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        {paymentStep === "confirm" && (
          <>
            <h2 style={styles.title}>💳 Razorpay Payment (Demo)</h2>

            <div style={styles.bookingDetails}>
              <div style={styles.detailRow}>
                <span>Space:</span>
                <strong>{booking.spaceTitle}</strong>
              </div>
              <div style={styles.detailRow}>
                <span>Location:</span>
                <strong>{booking.location}</strong>
              </div>
              <div style={styles.detailRow}>
                <span>Date:</span>
                <strong>{booking.date}</strong>
              </div>
              <div style={styles.detailRow}>
                <span>Time:</span>
                <strong>
                  {booking.startTime} - {booking.endTime}
                </strong>
              </div>
              <div style={styles.priceRow}>
                <span>Amount:</span>
                <strong style={{ color: "#38bdf8" }}>₹{booking.price}</strong>
              </div>
            </div>

            <p style={styles.infoText}>
              ⚠️ This is a demo payment. Click "Pay Now" to simulate payment.
            </p>

            <button style={styles.payBtn} onClick={handleFakePayment}>
              Pay Now (₹{booking.price})
            </button>

            <button style={styles.cancelBtn} onClick={onPaymentClose}>
              Cancel
            </button>
          </>
        )}

        {paymentStep === "processing" && (
          <div style={styles.processingContainer}>
            <div style={styles.spinner}></div>
            <h3 style={styles.processingText}>Processing Payment...</h3>
            <p style={styles.processingSubtext}>
              Please wait while we process your payment
            </p>
          </div>
        )}

        {paymentStep === "success" && (
          <div style={styles.successContainer}>
            <div style={styles.successIcon}>✓</div>
            <h3 style={styles.successText}>Payment Successful!</h3>
            <p style={styles.successSubtext}>
              Your booking has been confirmed. Redirecting...
            </p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modalContent: {
    background: "#0f172a",
    padding: "30px",
    borderRadius: "20px",
    width: "400px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
    color: "white",
  },

  title: {
    marginBottom: "20px",
    fontSize: "22px",
    textAlign: "center",
  },

  bookingDetails: {
    background: "rgba(255,255,255,0.05)",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "20px",
    border: "1px solid #1e293b",
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "14px",
  },

  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    paddingTop: "15px",
    borderTop: "1px solid #1e293b",
    fontSize: "16px",
    fontWeight: "bold",
  },

  infoText: {
    background: "rgba(56,189,248,0.1)",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "15px",
    color: "#cbd5e1",
    textAlign: "center",
  },

  payBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(90deg, #2563eb, #38bdf8)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "10px",
  },

  cancelBtn: {
    width: "100%",
    padding: "14px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },

  processingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px",
  },

  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #1e293b",
    borderTop: "4px solid #38bdf8",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },

  processingText: {
    fontSize: "18px",
    marginBottom: "10px",
  },

  processingSubtext: {
    color: "#cbd5e1",
    fontSize: "14px",
  },

  successContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px",
  },

  successIcon: {
    width: "60px",
    height: "60px",
    background: "#16a34a",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    marginBottom: "15px",
  },

  successText: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#16a34a",
  },

  successSubtext: {
    color: "#cbd5e1",
    fontSize: "14px",
  },
};

export default FakeRazorpayPayment;
