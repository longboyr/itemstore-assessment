import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const Breadcrumbs = ({ item }) => (
  <nav
    aria-label="Breadcrumb"
    style={{
      marginBottom: "24px",
      fontSize: "14px",
      color: "#666",
    }}
  >
    <ol
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        listStyle: "none",
        padding: 0,
        margin: 0,
      }}
    >
      <li>
        <Link
          to="/"
          style={{
            color: "#3b82f6",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#1d4ed8")}
          onMouseLeave={(e) => (e.target.style.color = "#3b82f6")}
        >
          Items
        </Link>
      </li>
      <li style={{ color: "#ccc" }}>›</li>
      <li style={{ color: "#1a1a1a", fontWeight: "500" }}>
        {item?.name || "Item Details"}
      </li>
    </ol>
  </nav>
);

const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 20px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #e9ecef",
      borderRadius: "8px",
      color: "#495057",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      marginBottom: "24px",
    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = "#e9ecef";
      e.target.style.transform = "translateY(-1px)";
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = "#f8f9fa";
      e.target.style.transform = "translateY(0)";
    }}
    aria-label="Go back to items list"
  >
    ← Back to Items
  </button>
);

const LoadingSkeleton = () => (
  <div
    style={{
      padding: "20px",
      maxWidth: "800px",
      margin: "0 auto",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}
  >
    <div
      style={{
        height: "40px",
        backgroundColor: "#f0f0f0",
        borderRadius: "8px",
        marginBottom: "24px",
        animation: "pulse 1.5s ease-in-out infinite alternate",
      }}
    />
    <div
      style={{
        height: "24px",
        backgroundColor: "#f0f0f0",
        borderRadius: "4px",
        marginBottom: "16px",
        width: "60%",
        animation: "pulse 1.5s ease-in-out infinite alternate",
      }}
    />
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "32px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          height: "32px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
          marginBottom: "24px",
          width: "80%",
          animation: "pulse 1.5s ease-in-out infinite alternate",
        }}
      />
      <div
        style={{
          height: "20px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
          marginBottom: "16px",
          width: "40%",
          animation: "pulse 1.5s ease-in-out infinite alternate",
        }}
      />
      <div
        style={{
          height: "20px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
          width: "30%",
          animation: "pulse 1.5s ease-in-out infinite alternate",
        }}
      />
    </div>
  </div>
);

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch('/api/items/' + id)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate('/');
      });
  }, [id, navigate]);

  const handleBackClick = () => {
    navigate('/');
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!item) {
    return (
      <div
        style={{
          padding: "20px",
          maxWidth: "800px",
          margin: "0 auto",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#dc3545", marginBottom: "16px" }}>Item Not Found</h2>
        <p style={{ color: "#666", marginBottom: "24px" }}>
          The item you're looking for doesn't exist or has been removed.
        </p>
        <BackButton onClick={handleBackClick} />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <BackButton onClick={handleBackClick} />
      <Breadcrumbs item={item} />
      
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #f0f0f0",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#1a1a1a",
            marginBottom: "24px",
            lineHeight: "1.2",
          }}
        >
          {item.name}
        </h1>
        
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#666",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Category
            </h3>
            <p
              style={{
                fontSize: "18px",
                color: "#1a1a1a",
                fontWeight: "500",
                margin: 0,
              }}
            >
              {item.category}
            </p>
          </div>
          
          <div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#666",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Price
            </h3>
            <p
              style={{
                fontSize: "24px",
                color: "#10b981",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              ${item.price.toLocaleString()}
            </p>
          </div>
        </div>
        
        {item.description && (
          <div style={{ marginTop: "32px" }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#666",
                marginBottom: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Description
            </h3>
            <p
              style={{
                fontSize: "16px",
                color: "#4a5568",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              {item.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemDetail;