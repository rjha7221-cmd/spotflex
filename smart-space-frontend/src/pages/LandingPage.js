import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Clock3,
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
