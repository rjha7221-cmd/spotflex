import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  Clock3,
  Heart,
  IndianRupee,
  MapPin,
  Mic,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import FakeRazorpayPayment from "../components/FakeRazorpayPayment";
import InvoiceModal from "../components/InvoiceModal";

const fallbackImage =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop";

const toMinutes = (time) => {
  if (!time || !time.includes(":")) return NaN;

  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
};

const getUserId = (user) => String(user?.id || user?._id || "").trim();

function Home() {
  const [spaces, setSpaces] = useState([]);
  const [recommendedSpaces, setRecommendedSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("smart");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/spaces");
      const allSpaces = Array.isArray(res.data) ? res.data : [];

      setSpaces(allSpaces);

      const smartSorted = [...allSpaces].sort((a, b) => {
        const ratingA = Number(a.averageRating) || 0;
        const ratingB = Number(b.averageRating) || 0;
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        const scoreA = ratingA * 10 - priceA / 100;
        const scoreB = ratingB * 10 - priceB / 100;

        return scoreB - scoreA;
      });

      setRecommendedSpaces(smartSorted.slice(0, 3));
    } catch (error) {
      console.log(error);
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.start();

    recognition.onresult = (event) => {
      setQuery(event.results[0][0].transcript);
    };

    recognition.onerror = (event) => {
      console.log(event.error);
      alert("Voice search failed");
    };
  };

  const handleAddToWishlist = async (space) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return alert("Please login first");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/wishlist/add", {
        userId: user.id || user._id,
        spaceId: space._id,
        title: space.title,
        location: space.location,
        price: space.price,
        image: space.image,
      });

      alert(res.data.message);
    } catch (error) {
      console.log(error);
      alert("Failed to add wishlist");
    }
  };

  const filteredSpaces = useMemo(() => {
    const filtered = spaces.filter((space) => {
      const title = (space.title || "").toLowerCase();
      const location = (space.location || "").toLowerCase();
      const search = query.toLowerCase();
      const price = Number(space.price) || 0;
      const rating = Number(space.averageRating) || 0;
      const matchSearch = !search || title.includes(search) || location.includes(search);
      const matchPrice = !maxPrice || price <= Number(maxPrice);
      const matchRating = !minRating || rating >= Number(minRating);

      return matchSearch && matchPrice && matchRating;
    });

    return [...filtered].sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      const ratingA = Number(a.averageRating) || 0;
      const ratingB = Number(b.averageRating) || 0;

      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      if (sortBy === "rating-high") return ratingB - ratingA;

      return ratingB * 10 - priceB / 100 - (ratingA * 10 - priceA / 100);
    });
  }, [spaces, query, maxPrice, minRating, sortBy]);

  const resultStats = useMemo(() => {
    const prices = filteredSpaces.map((space) => Number(space.price) || 0);
    const ratings = filteredSpaces.map((space) => Number(space.averageRating) || 0);
    const averagePrice =
      prices.length > 0
        ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
        : 0;
    const bestRating = ratings.length > 0 ? Math.max(...ratings) : 0;

    return {
      averagePrice,
      bestRating,
      count: filteredSpaces.length,
    };
  }, [filteredSpaces]);

  const clearFilters = () => {
    setQuery("");
    setMaxPrice("");
    setMinRating("");
    setSortBy("smart");
  };

  const openBooking = (space) => {
    setSelectedSpace(space);
  };

  const closeBooking = () => {
    setSelectedSpace(null);
    setDate("");
    setStartTime("");
    setEndTime("");
    setReviewRating(5);
    setReviewComment("");
    setShowPayment(false);
    setShowInvoice(false);
    setInvoiceData(null);
    setBookingData(null);
  };

  const handleBooking = () => {
    const user = getStoredUser();
    const userId = getUserId(user);

    if (!userId) {
      return alert("Please login again before booking");
    }

    if (!date || !startTime || !endTime) {
      return alert("Fill all details");
    }

    const startMinutes = toMinutes(startTime);
    const endMinutes = toMinutes(endTime);

    if (endMinutes <= startMinutes) {
      return alert("End time must be greater");
    }

    const selectedStart = new Date(`${date}T${startTime}`);

    if (Number.isNaN(selectedStart.getTime())) {
      return alert("Choose a valid date and time");
    }

    if (selectedStart <= new Date()) {
      return alert("Choose a future time slot");
    }

    setBookingData({
      userId,
      userName: user?.name || "Customer",
      spaceId: selectedSpace._id,
      spaceTitle: selectedSpace.title,
      location: selectedSpace.location,
      price: Number(selectedSpace.price) || 0,
      date,
      startTime,
      endTime,
      image: selectedSpace.image,
    });

    setShowPayment(true);
  };

  const handlePaymentSuccess = (bookingId) => {
    const user = getStoredUser();

    setShowPayment(false);
    setInvoiceData({
      _id: bookingId,
      title: selectedSpace.title,
      location: selectedSpace.location,
      date,
      startTime,
      endTime,
      price: Number(selectedSpace.price) || 0,
      customer: user?.name || "Customer",
    });
    setShowInvoice(true);
  };

  const handleReview = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return alert("Please login");
    }

    try {
      await axios.post(`http://localhost:5000/api/spaces/${selectedSpace._id}/review`, {
        userId: user.id || user._id,
        userName: user.name,
        rating: reviewRating,
        comment: reviewComment,
      });

      alert("Review added");
      fetchSpaces();
      setReviewComment("");
      setReviewRating(5);
    } catch (error) {
      console.log(error);
      alert("Review failed");
    }
  };

  const bookingDurationLabel = useMemo(() => {
    const startMinutes = toMinutes(startTime);
    const endMinutes = toMinutes(endTime);

    if (
      Number.isNaN(startMinutes) ||
      Number.isNaN(endMinutes) ||
      endMinutes <= startMinutes
    ) {
      return "Select a valid time slot";
    }

    const hours = (endMinutes - startMinutes) / 60;
    const label = Number.isInteger(hours) ? String(hours) : hours.toFixed(1);

    return `${label} ${hours === 1 ? "hour" : "hours"}`;
  }, [startTime, endTime]);

  const renderSpaceCard = (space, isRecommended = false) => (
    <article key={space._id} className="space-card">
      <div className="space-card-image">
        <img src={space.image || fallbackImage} alt={space.title || "Space"} />
        {isRecommended && (
          <span className="space-card-badge">
            <Sparkles size={15} />
            Recommended
          </span>
        )}
      </div>

      <div className="space-card-body">
        <h2 className="space-card-title">{space.title}</h2>
        <p className="meta-row">
          <MapPin size={16} />
          {space.location}
        </p>
        <div className="price-line">
          <span className="price">
            <IndianRupee size={18} />
            {space.price}
          </span>
          <span className="badge badge-warning">
            <Star size={14} />
            {space.averageRating || 0}
          </span>
        </div>
        <div className="card-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openBooking(space)}
          >
            <CalendarDays size={17} />
            Book
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleAddToWishlist(space)}
          >
            <Heart size={17} />
            Wishlist
          </button>
        </div>
      </div>
    </article>
  );

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">
            <Sparkles size={15} />
            AI smart recommendations
          </p>
          <h1 className="page-title">Find flexible spaces</h1>
          <p className="page-subtitle">
            Compare nearby spaces, filter by budget, and book a slot without
            leaving the page.
          </p>
        </div>
      </header>

      <section className="toolbar" aria-label="Space filters">
        <label className="input-with-icon">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or location"
            className="field"
          />
        </label>

        <label className="input-with-icon">
          <IndianRupee size={18} />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max price"
            className="field"
          />
        </label>

        <label className="input-with-icon">
          <Star size={18} />
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="field"
            aria-label="Minimum rating"
          >
            <option value="">Any rating</option>
            <option value="4">4+ rating</option>
            <option value="3">3+ rating</option>
            <option value="2">2+ rating</option>
          </select>
        </label>

        <label className="input-with-icon">
          <SlidersHorizontal size={18} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="field"
            aria-label="Sort spaces"
          >
            <option value="smart">Smart sort</option>
            <option value="price-low">Price low to high</option>
            <option value="price-high">Price high to low</option>
            <option value="rating-high">Highest rated</option>
          </select>
        </label>

        <button
          type="button"
          onClick={startVoiceSearch}
          className="btn btn-secondary"
        >
          <Mic size={17} />
          Voice
        </button>

        <button type="button" className="btn btn-secondary" onClick={clearFilters}>
          Clear
        </button>
      </section>

      <section className="insight-strip" aria-label="Search insights">
        <div className="insight-item">
          <span className="insight-label">Matches</span>
          <strong className="insight-value">{resultStats.count}</strong>
        </div>
        <div className="insight-item">
          <span className="insight-label">Average price</span>
          <strong className="insight-value inline-icon">
            <IndianRupee size={18} />
            {resultStats.averagePrice}
          </strong>
        </div>
        <div className="insight-item">
          <span className="insight-label">Best rating</span>
          <strong className="insight-value inline-icon">
            <Star size={18} />
            {resultStats.bestRating}
          </strong>
        </div>
      </section>

      <section className="section-block">
        <div className="page-header compact">
          <div>
            <p className="eyebrow">
              <Sparkles size={15} />
              Recommended
            </p>
            <h2 className="section-title">Best matches right now</h2>
          </div>
        </div>

        {recommendedSpaces.length > 0 ? (
          <div className="space-grid">
            {recommendedSpaces.map((space) => renderSpaceCard(space, true))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No recommendations yet</h2>
            <p>Add spaces in the backend to populate smart recommendations.</p>
          </div>
        )}
      </section>

      <section className="section-block">
        <div className="page-header compact">
          <div>
            <p className="eyebrow">
              <SlidersHorizontal size={15} />
              All spaces
            </p>
            <h2 className="section-title">{filteredSpaces.length} available spaces</h2>
          </div>
        </div>

        {filteredSpaces.length > 0 ? (
          <div className="space-grid">
            {filteredSpaces.map((space) => renderSpaceCard(space))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No spaces found</h2>
            <p>Try a different location or increase the price filter.</p>
          </div>
        )}
      </section>

      {showPayment && bookingData && (
        <FakeRazorpayPayment
          booking={bookingData}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentClose={() => setShowPayment(false)}
        />
      )}

      {showInvoice && invoiceData && (
        <InvoiceModal invoiceData={invoiceData} onClose={closeBooking} />
      )}

      {selectedSpace && !showPayment && !showInvoice && (
        <div className="modal-backdrop">
          <div className="modal-panel">
            <div className="modal-header">
              <div>
                <p className="eyebrow">
                  <CalendarDays size={15} />
                  Booking
                </p>
                <h2 className="modal-title">{selectedSpace.title}</h2>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={closeBooking}
                aria-label="Close booking modal"
                title="Close"
              >
                <X size={17} />
              </button>
            </div>

            <div className="modal-grid">
              <section className="form-grid">
                <img
                  src={selectedSpace.image || fallbackImage}
                  alt={selectedSpace.title || "Space"}
                  className="modal-image"
                />
                <p className="meta-row">
                  <MapPin size={16} />
                  {selectedSpace.location}
                </p>
                <p className="price">
                  <IndianRupee size={18} />
                  {selectedSpace.price}
                </p>

                <label className="input-with-icon">
                  <CalendarDays size={18} />
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="field"
                  />
                </label>

                <label className="input-with-icon">
                  <Clock3 size={18} />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="field"
                  />
                </label>

                <label className="input-with-icon">
                  <Clock3 size={18} />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="field"
                  />
                </label>

                <div className="summary-box booking-preview">
                  <div className="summary-row">
                    <span>Date</span>
                    <strong>{date || "Not selected"}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Slot</span>
                    <strong>
                      {startTime && endTime ? `${startTime} - ${endTime}` : "Not selected"}
                    </strong>
                  </div>
                  <div className="summary-row">
                    <span>Duration</span>
                    <strong>{bookingDurationLabel}</strong>
                  </div>
                  <div className="summary-row total">
                    <span>Space price</span>
                    <strong className="inline-icon">
                      <IndianRupee size={16} />
                      {Number(selectedSpace.price) || 0}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-full"
                  onClick={handleBooking}
                >
                  Confirm Booking
                </button>
              </section>

              <section className="form-grid">
                <iframe
                  title="map"
                  className="map-frame"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    selectedSpace.location || ""
                  )}&output=embed`}
                />

                <div>
                  <h3 className="section-title">Add review</h3>
                  <p className="page-subtitle">
                    Share quick feedback for this space after your experience.
                  </p>
                </div>

                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="select"
                >
                  <option value={5}>5 Star</option>
                  <option value={4}>4 Star</option>
                  <option value={3}>3 Star</option>
                  <option value={2}>2 Star</option>
                  <option value={1}>1 Star</option>
                </select>

                <textarea
                  placeholder="Write review..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="textarea"
                />

                <div className="action-row">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleReview}
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={closeBooking}
                  >
                    Close
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;
