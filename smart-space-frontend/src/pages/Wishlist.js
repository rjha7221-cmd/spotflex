import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, IndianRupee, MapPin, Trash2 } from "lucide-react";

const fallbackImage =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!userData) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/wishlist/${userData.id || userData._id}`
      );
      setWishlist(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const removeWishlist = async (spaceId) => {
    if (!user) return;

    try {
      await axios.delete(`http://localhost:5000/api/wishlist/${user.id || user._id}/${spaceId}`);
      setWishlist(wishlist.filter((item) => item.spaceId !== spaceId));
      alert("Removed from wishlist");
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">
            <Heart size={15} />
            Saved spaces
          </p>
          <h1 className="page-title">My Wishlist</h1>
          <p className="page-subtitle">
            Keep promising spaces ready for the next booking.
          </p>
        </div>
      </header>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <h2>No spaces in wishlist</h2>
          <p>Add spaces from discovery to compare them later.</p>
        </div>
      ) : (
        <div className="space-grid">
          {wishlist.map((space) => (
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
                <button
                  type="button"
                  className="btn btn-danger btn-full"
                  onClick={() => removeWishlist(space.spaceId)}
                >
                  <Trash2 size={17} />
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Wishlist;
