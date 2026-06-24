import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  MessageSquare,
  QrCode,
  ReceiptText,
  ScanLine,
  Search,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

const highlights = [
  {
    title: "Find space fast",
    text: "Search parking, workspaces, and event spots by location, budget, and timing.",
    icon: Search,
  },
  {
    title: "Book with clarity",
    text: "See price, timing, location, reviews, and invoice details before committing.",
    icon: ShieldCheck,
  },
  {
    title: "Run owner operations",
    text: "Owners can list spaces, review bookings, and chat with guests from one dashboard.",
    icon: Building2,
  },
];

const bookingFlow = [
  { label: "Book Space", icon: CalendarCheck },
  { label: "Fake Razorpay", icon: WalletCards },
  { label: "Booking Saved", icon: ShieldCheck },
  { label: "QR Generated", icon: QrCode },
  { label: "Invoice Open", icon: ReceiptText },
  { label: "QR Display", icon: QrCode },
  { label: "Owner Scan QR", icon: ScanLine },
  { label: "Check-In Verified", icon: CheckCircle2 },
];

function LandingPage() {
  return (
    <>
      <section className="landing-hero">
        <div className="landing-inner">
          <div className="landing-copy">
            <p className="eyebrow">
              <CalendarCheck size={15} />
              Smart space marketplace
            </p>
            <h1 className="landing-title">SpotFlex</h1>
            <p className="landing-subtitle">
              Discover and book flexible short-term spaces across the city for
              parking, work, events, and last-minute plans.
            </p>

            <div className="hero-actions">
              <Link to="/home" className="btn btn-primary">
                Explore Spaces
                <ArrowRight size={17} />
              </Link>
              <Link to="/user-register" className="btn btn-secondary">
                Create Account
              </Link>
            </div>
          </div>

          <div className="landing-cards">
            <article className="landing-card">
              <h2>For Users</h2>
              <p>Book useful spaces for work, parking, meetings, and events.</p>
              <div className="action-row">
                <Link to="/user-login" className="btn btn-primary btn-sm">
                  Login
                </Link>
                <Link to="/user-register" className="btn btn-secondary btn-sm">
                  Register
                </Link>
              </div>
            </article>

            <article className="landing-card">
              <h2>For Owners</h2>
              <p>List space, manage bookings, and keep guest conversations tidy.</p>
              <div className="action-row">
                <Link to="/owner-login" className="btn btn-primary btn-sm">
                  Login
                </Link>
                <Link to="/owner-register" className="btn btn-secondary btn-sm">
                  Register
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <main className="page-shell">
        <section className="stats-strip">
          <article className="metric-card">
            <p className="metric-label">
              <Clock3 size={17} />
              Booking Access
            </p>
            <h2 className="metric-value">24/7</h2>
          </article>
          <article className="metric-card">
            <p className="metric-label">
              <CalendarCheck size={17} />
              Rental Modes
            </p>
            <h2 className="metric-value">Hourly</h2>
          </article>
          <article className="metric-card">
            <p className="metric-label">
              <WalletCards size={17} />
              Checkout
            </p>
            <h2 className="metric-value">Fast</h2>
          </article>
        </section>

        <section className="workflow-section">
          <div className="page-header compact">
            <div>
              <p className="eyebrow">
                <QrCode size={15} />
                Booking flow
              </p>
              <h2 className="section-title">From payment to verified entry</h2>
            </div>
          </div>

          <div className="workflow-track">
            {bookingFlow.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.label} className="workflow-step">
                  <span className="workflow-icon">
                    <Icon size={19} />
                  </span>
                  <strong>{item.label}</strong>
                </article>
              );
            })}
          </div>
        </section>

        <section className="showcase-band">
          <div className="showcase-image">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop"
              alt="Team using a flexible workspace"
            />
          </div>
          <div className="showcase-copy">
            <p className="eyebrow">
              <MessageSquare size={15} />
              Owner and user chat
            </p>
            <h2 className="section-title">Every booking keeps its conversation attached</h2>
            <div className="mini-chat-preview">
              <div className="mini-message their">Hi, is the entry gate open?</div>
              <div className="mini-message own">Yes, show the QR at arrival.</div>
              <div className="mini-message their">Great, reaching in 10 minutes.</div>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="page-header compact">
            <div>
              <p className="eyebrow">Why SpotFlex</p>
              <h2 className="section-title">Built for flexible city plans</h2>
            </div>
          </div>

          <div className="feature-grid">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="feature-card">
                  <div className="feature-icon">
                    <Icon size={21} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}

export default LandingPage;
