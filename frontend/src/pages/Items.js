import React, { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { Link } from "react-router-dom";

function Items() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchItems = async (page = 1, limit = 10, search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (search) {
        params.append('q', search);
      }
      
      const res = await fetch(`/api/items?${params}`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const json = await res.json();
      
      setItems(Array.isArray(json.items) ? json.items : []);
      setPagination(json.pagination || {});
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setItems([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(currentPage, 10, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <form onSubmit={handleSearch}>
        <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="text"
            placeholder="Search items..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              padding: "8px",
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
              }}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {searchTerm && (
        <p style={{ marginBottom: "15px", color: "#666" }}>
          Showing results for "{searchTerm}" - {pagination.totalItems || 0} items found
        </p>
      )}

      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <div
          style={{
            height: "400px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          <Virtuoso
            style={{ height: "400px" }}
            totalCount={items.length}
            itemContent={(index) => {
              const item = items[index];
              return (
                <div
                  style={{
                    padding: "10px",
                    border: "1px solid #eee",
                    margin: "5px 0",
                    borderRadius: "4px",
                    backgroundColor: "white",
                  }}
                >
                  <Link to={`/items/${item.id}`} style={{ textDecoration: "none" }}>
                    <strong>{item.name}</strong> - {item.category} - ${item.price}
                  </Link>
                </div>
              );
            }}
          />
        </div>
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
            Page {pagination.currentPage || 1} of {pagination.totalPages || 1} ({pagination.totalItems || 0} total items)
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
