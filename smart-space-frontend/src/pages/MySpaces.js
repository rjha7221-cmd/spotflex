import React, { useEffect, useState } from "react";
import axios from "axios";
import { Building2 } from "lucide-react";

import SpaceCard from "../components/SpaceCard";

function MySpaces() {
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/spaces")
      .then((res) => {
        setSpaces(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">
            <Building2 size={15} />
            Inventory
          </p>
          <h1 className="page-title">My Added Spaces</h1>
          <p className="page-subtitle">
            Review the spaces currently available in the marketplace.
          </p>
        </div>
      </header>

      {spaces.length > 0 ? (
        <div className="space-grid">
          {spaces.map((space) => (
            <SpaceCard
              key={space._id}
              title={space.title}
              location={space.location}
              price={space.price}
              image={space.image}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No spaces found</h2>
          <p>Add a space from the owner dashboard to see it here.</p>
        </div>
      )}
    </main>
  );
}

export default MySpaces;
