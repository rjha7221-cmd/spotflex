import React, { useState } from "react";
import {
  CheckCircle2,
  Download,
  IndianRupee,
  Printer,
  ReceiptText,
  X,
} from "lucide-react";

const InvoiceModal = ({ invoiceData, onClose }) => {
  const [isPrinting, setIsPrinting] = useState(false);

  const price = Number(invoiceData.price) || 0;
  const gst = price * 0.18;
  const total = price + gst;
  const invoiceNumber = invoiceData._id?.substring(0, 8).toUpperCase() || "INV001";

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

Invoice #: ${invoiceNumber}
Date: ${new Date().toLocaleDateString()}

BILLING TO:
${invoiceData.customer}

BOOKING DETAILS:
Space: ${invoiceData.title}
Location: ${invoiceData.location}
Date: ${invoiceData.date}
Time: ${invoiceData.startTime} - ${invoiceData.endTime}

AMOUNT SUMMARY:
Base Amount: INR ${price.toFixed(2)}
GST (18%): INR ${gst.toFixed(2)}
Total: INR ${total.toFixed(2)}

Payment Status: PAID

Thank you for using SpotFlex!
`,
      ],
      { type: "text/plain" }
    );

    element.href = URL.createObjectURL(file);
    element.download = `invoice_${invoiceNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel medium">
        <div className="modal-header">
          <div>
            <p className="eyebrow">
              <ReceiptText size={15} />
              Invoice
            </p>
            <h2 className="modal-title">Booking receipt</h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close invoice"
            title="Close"
          >
            <X size={17} />
          </button>
        </div>

        <div className="invoice-section">
          <h3>Invoice Details</h3>
          <div className="summary-box">
            <div className="summary-row">
              <span>Invoice #</span>
              <strong>{invoiceNumber}</strong>
            </div>
            <div className="summary-row">
              <span>Date</span>
              <strong>{new Date().toLocaleDateString()}</strong>
            </div>
            <div className="summary-row">
              <span>Bill to</span>
              <strong>{invoiceData.customer}</strong>
            </div>
          </div>
        </div>

        <div className="invoice-section">
          <h3>Booking Details</h3>
          <table className="invoice-table">
            <tbody>
              <tr>
                <td>Space Name</td>
                <td>{invoiceData.title}</td>
              </tr>
              <tr>
                <td>Location</td>
                <td>{invoiceData.location}</td>
              </tr>
              <tr>
                <td>Date</td>
                <td>{invoiceData.date}</td>
              </tr>
              <tr>
                <td>Time</td>
                <td>
                  {invoiceData.startTime} - {invoiceData.endTime}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="invoice-section">
          <h3>Amount Summary</h3>
          <div className="summary-box">
            <div className="summary-row">
              <span>Base Amount</span>
              <strong className="inline-icon">
                <IndianRupee size={15} />
                {price.toFixed(2)}
              </strong>
            </div>
            <div className="summary-row">
              <span>GST (18%)</span>
              <strong className="inline-icon">
                <IndianRupee size={15} />
                {gst.toFixed(2)}
              </strong>
            </div>
            <div className="summary-row total">
              <span>Total Amount</span>
              <strong className="inline-icon">
                <IndianRupee size={16} />
                {total.toFixed(2)}
              </strong>
            </div>
          </div>
        </div>

        <div className="invoice-section">
          <span className="badge badge-success">
            <CheckCircle2 size={15} />
            Paid
          </span>
        </div>

        <div className="form-grid">
          <button
            type="button"
            className="btn btn-primary btn-full"
            onClick={handlePrint}
            disabled={isPrinting}
          >
            <Printer size={17} />
            Print Invoice
          </button>
          <button
            type="button"
            className="btn btn-success btn-full"
            onClick={handleDownload}
          >
            <Download size={17} />
            Download Invoice
          </button>
          <button type="button" className="btn btn-secondary btn-full" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
