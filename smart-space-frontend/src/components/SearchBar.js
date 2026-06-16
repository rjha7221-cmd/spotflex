import React from "react";
import { Search } from "lucide-react";

function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form className="toolbar" onSubmit={onSubmit}>
      <div className="input-with-icon">
        <Search size={18} />
        <input
          className="field"
          type="text"
          placeholder="Search location..."
          value={value}
          onChange={onChange}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
