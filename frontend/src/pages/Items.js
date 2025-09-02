import React, { useEffect, useState } from "react";
import { useData } from "../state/DataContext";
import { Link } from "react-router-dom";

function Items() {
  const { items, pagination, loading, fetchItems } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const abortController = new AbortController();

    fetchItems(abortController.signal, currentPage, 10, searchTerm);

    return () => {
      abortController.abort();
    };
  }, [fetchItems, currentPage, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search items..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{
            padding: "8px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "300px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSearchInput("");
              setCurrentPage(1);
            }}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            Clear
          </button>
        )}
      </form>

      {searchTerm && (
        <p style={{ marginBottom: "15px", color: "#666" }}>
          Showing results for "{searchTerm}" - {pagination.totalItems} items
          found
        </p>
      )}

      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                padding: "10px",
                border: "1px solid #eee",
                marginBottom: "5px",
                borderRadius: "4px",
              }}
            >
              <Link to={"/items/" + item.id} style={{ textDecoration: "none" }}>
                <strong>{item.name}</strong> - {item.category} - ${item.price}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {pagination.totalPages > 1 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            style={{
              padding: "8px 12px",
              margin: "0 5px",
              backgroundColor: pagination.hasPrevPage ? "#007bff" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: pagination.hasPrevPage ? "pointer" : "not-allowed",
            }}
          >
            Previous
          </button>

          <span style={{ margin: "0 15px", fontSize: "14px" }}>
            Page {pagination.currentPage} of {pagination.totalPages}(
            {pagination.totalItems} total items)
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNextPage}
            style={{
              padding: "8px 12px",
              margin: "0 5px",
              backgroundColor: pagination.hasNextPage ? "#007bff" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: pagination.hasNextPage ? "pointer" : "not-allowed",
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Items;
