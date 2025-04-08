import React from "react";

const SearchBox = ({
  city,
  onInputChange,
  onSearch,
  onKeyPress,
  loading,
  hasResults,
}) => {
  const styles = {
    searchContainer: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      background: "rgba(255, 255, 255, 0.1)", // Transparent background
      padding: "1rem",
      zIndex: 10,
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    inputContainer: {
      maxWidth: "800px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
    },
    input: {
      background: "rgba(255, 255, 255, 0.2)", // Slightly transparent input background
      border: "1px solid rgba(255, 255, 255, 0.5)", // White border
      borderRadius: "25px",
      padding: "12px 20px",
      width: "100%",
      color: "white", // Bright white text
      fontSize: "1rem",
      outline: "none",
      transition: "all 0.3s ease",
    },
    button: {
      background: "rgba(33, 150, 243, 0.8)",
      border: "none",
      borderRadius: "25px",
      padding: "12px 25px",
      color: "white",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      outline: "none",
      whiteSpace: "nowrap",
    },
  };

  return (
    <div style={styles.searchContainer}>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter city name (e.g., Paris, Tokyo, New York)"
          style={styles.input}
          value={city}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
        />
        <button
          style={styles.button}
          onClick={onSearch}
          disabled={loading}
          onMouseOver={(e) => {
            e.target.style.background = "rgba(33, 150, 243, 1)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "rgba(33, 150, 243, 0.8)";
          }}
        >
          {loading ? "..." : "Explore"}
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
