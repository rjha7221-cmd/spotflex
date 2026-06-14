import React, { useState } from "react";

const InvoiceModal = ({ invoiceData, onClose }) => {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    window.print();
    setTimeout(() => setIsPrinting(false), 1000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [
        `
      SPOTFLEX INVOICE
      ================
      
      Invoice #: ${invoiceData._id?.substring(0, 8).toUpperCase() || "INV001"}
      Date: ${new Date().toLocaleDateString()}
      
      BILLING TO:
      ${invoiceData.customer}
      
      BOOKING DETAILS:
      Space: ${invoiceData.title}
      Location: ${invoiceData.location}
      Date: ${invoiceData.date}
      Time: ${invoiceData.startTime} - ${invoiceData.endTime}
      
      AMOUNT SUMMARY:
      Base Amount: ₹${invoiceData.price}
      GST (18%): ₹${(invoiceData.price * 0.18).toFixed(2)}
      Total: ₹${(invoiceData.price * 1.18).toFixed(2)}
      
      Payment Status: PAID
      
      Thank you for using SpotFlex!
    `,
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `invoice_${invoiceData._id?.substring(0, 8)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const gst = invoiceData.price * 0.18;
  const total = invoiceData.price + gst;

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.header}>
          <h2>📄 Invoice</h2>
          <button style={styles.closeIconBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={styles.invoiceBody}>
          <div style={styles.section}>
            <h3>Invoice Details</h3>
            <p>
              <strong>Invoice #:</strong> {invoiceData._id?.substring(0, 8).toUpperCase() || "INV001"}
            </p>
            <p>
              <strong>Date:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>

          <div style={styles.section}>
            <h3>Bill To</h3>
            <p>
              <strong>{invoiceData.customer}</strong>
            </p>
          </div>

          <div style={styles.section}>
            <h3>Booking Details</h3>
            <table style={styles.table}>
              <tbody>
                <tr>
                  <td>Space Name:</td>
                  <td>{invoiceData.title}</td>
                </tr>
                <tr>
                  <td>Location:</td>
                  <td>{invoiceData.location}</td>
                </tr>
                <tr>
                  <td>Date:</td>
                  <td>{invoiceData.date}</td>
                </tr>
                <tr>
                  <td>Time:</td>
                  <td>
                    {invoiceData.startTime} - {invoiceData.endTime}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={styles.section}>
            <h3>Amount Summary</h3>
            <div style={styles.summaryBox}>
              <div style={styles.summaryRow}>
                <span>Base Amount:</span>
                <span>₹{invoiceData.price.toFixed(2)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>GST (18%):</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
                <strong>Total Amount:</strong>
                <strong>₹{total.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3>Payment Status</h3>
            <p style={styles.statusBadge}>✓ PAID</p>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button style={styles.printBtn} onClick={handlePrint} disabled={isPrinting}>
            🖨️ Print Invoice
          </button>
          <button style={styles.downloadBtn} onClick={handleDownload}>
            📥 Download Invoice
          </button>
          <button style={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
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
    zIndex: 1001,
    overflowY: "auto",
  },

  modalContent: {
    background: "#0f172a",
    padding: "30px",
    borderRadius: "20px",
    width: "600px",
    maxWidth: "95%",
    maxHeight: "90vh",
    overflowY: "auto",
    color: "white",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
    margin: "20px auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid #1e293b",
  },

  closeIconBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "24px",
    cursor: "pointer",
  },

  invoiceBody: {
    marginBottom: "20px",
  },

  section: {
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid #1e293b",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },

  summaryBox: {
    background: "rgba(37,99,235,0.1)",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #2563eb",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "14px",
  },

  totalRow: {
    marginTop: "10px",
    paddingTop: "10px",
    borderTop: "1px solid #2563eb",
    fontSize: "16px",
    fontWeight: "bold",
  },

  statusBadge: {
    display: "inline-block",
    background: "#16a34a",
    color: "white",
    padding: "8px 15px",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "14px",
  },

  buttonGroup: {
    display: "flex",
    gap: "10px",
    flexDirection: "column",
  },

  printBtn: {
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  downloadBtn: {
    padding: "12px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  closeBtn: {
    padding: "12px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default InvoiceModal;
