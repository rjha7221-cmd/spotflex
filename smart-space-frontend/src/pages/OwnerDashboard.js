import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  Clock3,
  Edit3,
  Image,
  IndianRupee,
  MapPin,
  MessageSquare,
  Plus,
  ReceiptIndianRupee,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";

import ChatBox from "../components/ChatBox";

const fallbackImage =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop";

function OwnerDashboard() {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editingSpace, setEditingSpace] = useState(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    fetchSpaces();
    fetchBookings();
  }, []);

  const fetchSpaces = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/spaces");
      setSpaces(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings");
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
    }
  };

  const totalEarning = bookings.reduce((sum, booking) => {
    if (booking.status !== "cancelled") {
      return sum + (Number(booking.price) || 0);
    }

    return sum;
  }, 0);

  const deleteSpace = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/spaces/${id}`);

      if (res.data.success) {
        alert("Space deleted");
        setSpaces((prev) => prev.filter((space) => space._id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const openEdit = (space) => {
    setEditingSpace(space);
    setTitle(space.title);
    setLocation(space.location);
    setPrice(space.price);
    setImage(space.image);
  };

  const closeEdit = () => {
    setEditingSpace(null);
    setTitle("");
    setLocation("");
    setPrice("");
    setImage("");
  };

  const updateSpace = async () => {
    try {
      await axios.put(`http://localhost:5000/api/spaces/${editingSpace._id}`, {
        title,
        location,
        price,
        image,
      });

      alert("Space updated");
      closeEdit();
      fetchSpaces();
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  const currentUser = JSON.parse(localStorage.getItem("user"));

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">
            <Building2 size={15} />
            Owner workspace
          </p>
          <h1 className="page-title">Owner Dashboard</h1>
          <p className="page-subtitle">
            Track listings, booking demand, revenue, and guest conversations in
            one place.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/add-space")}
        >
          <Plus size={17} />
          Add Space
        </button>
      </header>

      <section className="metric-grid">
        <article className="metric-card">
          <p className="metric-label">
            <Building2 size={17} />
            Total Spaces
          </p>
          <h2 className="metric-value">{spaces.length}</h2>
        </article>
        <article className="metric-card">
          <p className="metric-label">
            <CalendarDays size={17} />
            Total Bookings
          </p>
          <h2 className="metric-value">{bookings.length}</h2>
        </article>
        <article className="metric-card">
          <p className="metric-label">
            <WalletCards size={17} />
            Total Earning
          </p>
          <h2 className="metric-value inline-icon">
            <IndianRupee size={28} />
            {totalEarning}
          </h2>
        </article>
      </section>

      <section className="section-block">
        <div className="page-header compact">
          <div>
            <p className="eyebrow">
              <Building2 size={15} />
              Listed spaces
            </p>
            <h2 className="section-title">Manage marketplace inventory</h2>
          </div>
        </div>

        {spaces.length > 0 ? (
          <div className="space-grid">
            {spaces.map((space) => (
              <article key={space._id} className="space-card">
                <div className="space-card-image">
                  <img src={space.image || fallbackImage} alt={space.title || "Space"} />
                </div>
                <div className="space-card-body">
                  <h2 className="space-card-title">{space.title}</h2>
                  <p className="meta-row">
                    <MapPin size={16} />
                    {space.location}
                  </p>
                  <p className="price">
                    <IndianRupee size={18} />
                    {space.price}
                  </p>
                  <div className="card-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => openEdit(space)}
                    >
                      <Edit3 size={17} />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => deleteSpace(space._id)}
                    >
                      <Trash2 size={17} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No spaces yet</h2>
            <p>Add your first space to start accepting bookings.</p>
          </div>
        )}
      </section>

      <section className="section-block">
        <div className="page-header compact">
          <div>
            <p className="eyebrow">
              <ReceiptIndianRupee size={15} />
              Booking activity
            </p>
            <h2 className="section-title">Recent guest reservations</h2>
          </div>
        </div>

        {bookings.length > 0 ? (
          <div className="booking-grid">
            {bookings.map((booking) => (
              <article key={booking._id} className="space-card booking-card">
                <div className="space-card-image">
                  <img
                    src={booking.image || booking.spaceImage || fallbackImage}
                    alt={booking.spaceTitle || "Booked space"}
                  />
                  <span className="space-card-badge">
                    {booking.status || "upcoming"}
                  </span>
                </div>
                <div className="booking-card-body">
                  <h2 className="space-card-title">{booking.spaceTitle}</h2>
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

                  <div className="section-block" style={{ marginTop: 8 }}>
                    <p className="eyebrow">
                      <MessageSquare size={15} />
                      Guest chat
                    </p>
                    <ChatBox roomId={booking._id} userName={currentUser?.name || "Owner"} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No bookings yet</h2>
            <p>New reservations will show up here when guests book spaces.</p>
          </div>
        )}
      </section>

      {editingSpace && (
        <div className="modal-backdrop">
          <div className="modal-panel narrow">
            <div className="modal-header">
              <div>
                <p className="eyebrow">
                  <Edit3 size={15} />
                  Edit listing
                </p>
                <h2 className="modal-title">Update space details</h2>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={closeEdit}
                aria-label="Close edit modal"
                title="Close"
              >
                <X size={17} />
              </button>
            </div>

            <div className="form-grid">
              <label className="input-with-icon">
                <Building2 size={18} />
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="field"
                />
              </label>
              <label className="input-with-icon">
                <MapPin size={18} />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="field"
                />
              </label>
              <label className="input-with-icon">
                <IndianRupee size={18} />
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  className="field"
                />
              </label>
              <label className="input-with-icon">
                <Image size={18} />
                <input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Image URL"
                  className="field"
                />
              </label>

              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={updateSpace}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-full"
                onClick={closeEdit}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default OwnerDashboard;
