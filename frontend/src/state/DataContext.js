import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async (signal, page = 1, limit = 10, search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { q: search })
      });
      
      const res = await fetch(`/api/items?${params}`, { signal });
      const json = await res.json();
      
      setItems(json.items || []);
      setPagination(json.pagination || {});
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to fetch items:', error);
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

export const useData = () => useContext(DataContext);