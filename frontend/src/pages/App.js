import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';

function App() {
  return (
    <DataProvider>
      <nav
        style={{
          padding: "20px 32px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderBottom: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "white",
              fontSize: "24px",
              fontWeight: "700",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.textShadow = "0 2px 4px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.textShadow = "none";
            }}
          >
            🛍️ Adulfo's Item Store
          </Link>
          <div
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Browse • Search • Discover
          </div>
        </div>
      </nav>
      <main
        style={{
          minHeight: "calc(100vh - 84px)",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </main>
    </DataProvider>
  );
}

export default App;