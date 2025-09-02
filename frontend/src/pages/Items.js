import React, { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { Link } from "react-router-dom";
import "../styles/Items.css";

const ItemSkeleton = () => (
  <div
    style={{
      padding: "16px",
      border: "1px solid #f0f0f0",
      margin: "8px 0",
      borderRadius: "12px",
      backgroundColor: "#fafafa",
      animation: "pulse 1.5s ease-in-out infinite alternate",
    }}
  >
    <div
      style={{
        height: "20px",
        backgroundColor: "#e0e0e0",
        borderRadius: "4px",
        marginBottom: "8px",
        width: "70%",
      }}
    />
    <div
      style={{
        height: "16px",
        backgroundColor: "#e0e0e0",
        borderRadius: "4px",
        width: "40%",
      }}
    />
  </div>
);

const LoadingSkeleton = ({ count = 5 }) => (
  <div>
    {Array.from({ length: count }, (_, i) => (
      <ItemSkeleton key={i} />
    ))}
  </div>
);

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
    return (
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#1a1a1a",
              marginBottom: "8px",
            }}
          >
            Items
          </h1>
          <p style={{ color: "#666", fontSize: "16px" }}>
            Loading your items...
          </p>
        </div>
        <LoadingSkeleton count={8} />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#1a1a1a",
            marginBottom: "8px",
          }}
        >
          Items
        </h1>
        <p style={{ color: "#666", fontSize: "16px", marginBottom: "24px" }}>
          Browse and search through our collection
        </p>
      </div>

      <form onSubmit={handleSearch} role="search" aria-label="Search items">
        <div 
          className="search-container"
          style={{ 
            marginBottom: "24px", 
            display: "flex", 
            alignItems: "center", 
            gap: "12px",
            flexWrap: "wrap"
          }}
        >
          <input
            type="text"
            placeholder="Search items..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search items by name, category, or price"
            className="search-input"
            style={{
              padding: "12px 16px",
              border: "2px solid #e1e5e9",
              borderRadius: "8px",
              fontSize: "16px",
              width: "320px",
              outline: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch(e);
              }
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            aria-label="Search items"
            style={{
              padding: "12px 24px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(0,123,255,0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#0056b3";
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 8px rgba(0,123,255,0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#007bff";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 4px rgba(0,123,255,0.3)";
            }}
          >
            🔍 Search
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSearchInput("");
                setCurrentPage(1);
              }}
              className="btn-secondary"
              style={{
                padding: "12px 20px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#545b62";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#6c757d";
                e.target.style.transform = "translateY(0)";
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>
      </form>

      {searchTerm && (
        <p style={{ marginBottom: "15px", color: "#666" }}>
          Showing results for "{searchTerm}" - {pagination.totalItems || 0}{" "}
          items found
        </p>
      )}

      {items.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            border: "2px dashed #dee2e6",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
          <h3 style={{ color: "#495057", marginBottom: "8px" }}>
            No items found
          </h3>
          <p style={{ color: "#6c757d" }}>
            {searchTerm
              ? `No results for "${searchTerm}"`
              : "No items available"}
          </p>
        </div>
      ) : (
        <div
          style={{
            height: "500px",
            border: "2px solid #e9ecef",
            borderRadius: "12px",
            backgroundColor: "white",
            boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
          }}
        >
          <Virtuoso
            style={{ height: "500px", borderRadius: "12px" }}
            totalCount={items.length}
            itemContent={(index) => {
              const item = items[index];
              return (
                <div
                  className="item-card"
                  style={{
                    padding: "16px",
                    border: "none",
                    borderBottom: index < items.length - 1 ? "1px solid #f1f3f4" : "none",
                    backgroundColor: "white",
                    transition: "all 0.2s ease",
                    animation: "fadeIn 0.3s ease-out",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <Link
                    to={`/items/${item.id}`}
                    style={{
                      textDecoration: "none",
                      display: "block",
                      color: "inherit",
                    }}
                    aria-label={`View details for ${item.name}`}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin: "0 0 4px 0",
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#1a1a1a",
                          }}
                        >
                          {item.name}
                        </h3>
                        <span
                          style={{
                            color: "#6c757d",
                            fontSize: "14px",
                            backgroundColor: "#e9ecef",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontWeight: "500",
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: "700",
                          color: "#28a745",
                        }}
                      >
                        ${item.price}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }}
          />
        </div>
      )}

      {pagination.totalPages > 1 && (
        <nav 
          style={{ marginTop: "32px", textAlign: "center" }}
          role="navigation"
          aria-label="Items pagination"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            aria-label="Go to previous page"
            style={{
              padding: "12px 20px",
              margin: "0 8px",
              backgroundColor: pagination.hasPrevPage ? "#007bff" : "#e9ecef",
              color: pagination.hasPrevPage ? "white" : "#6c757d",
              border: "none",
              borderRadius: "8px",
              cursor: pagination.hasPrevPage ? "pointer" : "not-allowed",
              fontSize: "16px",
              fontWeight: "500",
              transition: "all 0.2s ease",
              boxShadow: pagination.hasPrevPage ? "0 2px 4px rgba(0,123,255,0.3)" : "none",
            }}
            onMouseEnter={(e) => {
              if (pagination.hasPrevPage) {
                e.target.style.backgroundColor = "#0056b3";
                e.target.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (pagination.hasPrevPage) {
                e.target.style.backgroundColor = "#007bff";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            ← Previous
          </button>
          <span style={{ 
            margin: "0 16px", 
            fontSize: "16px",
            color: "#495057",
            fontWeight: "500",
            padding: "12px 16px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #dee2e6"
          }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNextPage}
            aria-label="Go to next page"
            style={{
              padding: "12px 20px",
              margin: "0 8px",
              backgroundColor: pagination.hasNextPage ? "#007bff" : "#e9ecef",
              color: pagination.hasNextPage ? "white" : "#6c757d",
              border: "none",
              borderRadius: "8px",
              cursor: pagination.hasNextPage ? "pointer" : "not-allowed",
              fontSize: "16px",
              fontWeight: "500",
              transition: "all 0.2s ease",
              boxShadow: pagination.hasNextPage ? "0 2px 4px rgba(0,123,255,0.3)" : "none",
            }}
            onMouseEnter={(e) => {
              if (pagination.hasNextPage) {
                e.target.style.backgroundColor = "#0056b3";
                e.target.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (pagination.hasNextPage) {
                e.target.style.backgroundColor = "#007bff";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
}

export default Items;
