import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext({
  items: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  loading: false,
  fetchItems: () => {}
});

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async (signal, page = 1, limit = 10, search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (search) {
        params.append('q', search);
      }
      
      const res = await fetch(`/api/items?${params}`, { signal });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const json = await res.json();
      
      // Ensure we always have valid data structures
      setItems(Array.isArray(json.items) ? json.items : []);
      setPagination({
        currentPage: json.pagination?.currentPage || page,
        totalPages: json.pagination?.totalPages || 1,
        totalItems: json.pagination?.totalItems || 0,
        hasNextPage: json.pagination?.hasNextPage || false,
        hasPrevPage: json.pagination?.hasPrevPage || false
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to fetch items:', error);
        // Reset to safe defaults on error
        setItems([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasNextPage: false,
          hasPrevPage: false
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DataContext.Provider value={{ items, pagination, loading, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};