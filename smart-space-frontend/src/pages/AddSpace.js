import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Building2, Image, IndianRupee, MapPin, Plus } from "lucide-react";

function AddSpace() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const handleAddSpace = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/spaces/add", {
        title,
        location,
        price: Number(price),
        image,
      });

      if (res.data.success) {
        alert("Space added successfully.");
        navigate("/owner-dashboard");
      } else {
        alert("Failed to add space");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <main className="page-shell">
      <form className="surface-card form-panel form-grid" onSubmit={handleAddSpace}>
        <div>
          <p className="eyebrow">
            <Plus size={15} />
            New listing
          </p>
          <h1 className="section-title">Add New Space</h1>
          <p className="page-subtitle">
            Publish a flexible space with a clear title, location, price, and
            image.
          </p>
        </div>

        <label className="input-with-icon">
          <Building2 size={18} />
          <input
            type="text"
            placeholder="Space title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="field"
            required
          />
        </label>

        <label className="input-with-icon">
          <MapPin size={18} />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="field"
            required
          />
        </label>

        <label className="input-with-icon">
          <IndianRupee size={18} />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="field"
            required
          />
        </label>

        <label className="input-with-icon">
          <Image size={18} />
          <input
            type="url"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="field"
            required
          />
        </label>

        <button type="submit" className="btn btn-primary btn-full">
          <Plus size={17} />
          Add Space
        </button>
      </form>
    </main>
  );
}

export default AddSpace;
