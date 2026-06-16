import React from "react";
import { IndianRupee, MapPin } from "lucide-react";

const fallbackImage =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop";

function SpaceCard({ title, location, price, image, actions }) {
  return (
    <article className="space-card">
      <div className="space-card-image">
        <img src={image || fallbackImage} alt={title || "Space"} />
      </div>

      <div className="space-card-body">
        <h2 className="space-card-title">{title}</h2>
        <p className="meta-row">
          <MapPin size={16} />
          {location}
        </p>
        <div className="price">
          <IndianRupee size={18} />
          {price}
        </div>
        {actions || <button className="btn btn-primary btn-full">Book Now</button>}
      </div>
    </article>
  );
}

export default SpaceCard;
