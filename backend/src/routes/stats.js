const express = require('express');
const fs = require("fs").promises;
const fsSync = require("fs");
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, "../../../data/items.json");

let statsCache = {
  data: null,
  lastModified: null,
  calculating: false,
};

let fileWatcher = null;

function initFileWatcher() {
  if (fileWatcher) {
    fileWatcher.close();
  }

  try {
    fileWatcher = fsSync.watch(DATA_PATH, (eventType, filename) => {
      if (eventType === "change") {
        console.log("Data file changed, invalidating stats cache");
        statsCache.data = null;
        statsCache.lastModified = null;
      }
    });

    console.log("File watcher initialized for stats cache");
  } catch (error) {
    console.error("Failed to initialize file watcher:", error);
  }
}

initFileWatcher();

// Calculate stats from items data
function calculateStats(items) {
  if (!items || items.length === 0) {
    return { total: 0, averagePrice: 0 };
  }

  const total = items.length;
  const totalPrice = items.reduce((acc, cur) => acc + (cur.price || 0), 0);
  const averagePrice = Math.round((totalPrice / total) * 100) / 100; // Round to 2 decimals

  return {
    total,
    averagePrice,
    categories: getCategoryStats(items),
    priceRange: getPriceRange(items),
  };
}

// Get category statistics
function getCategoryStats(items) {
  const categoryCount = {};
  items.forEach((item) => {
    const category = item.category || "Unknown";
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });
  return categoryCount;
}

// Get price range statistics
function getPriceRange(items) {
  const prices = items
    .map((item) => item.price || 0)
    .filter((price) => price > 0);
  if (prices.length === 0) return { min: 0, max: 0 };

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

// Get file modification time
async function getFileModTime() {
  try {
    const stats = await fs.stat(DATA_PATH);
    return stats.mtime.getTime();
  } catch (error) {
    console.error("Error getting file modification time:", error);
    return null;
  }
}

// Check if cache is valid
async function isCacheValid() {
  if (!statsCache.data || !statsCache.lastModified) {
    return false;
  }

  const currentModTime = await getFileModTime();
  return currentModTime && currentModTime <= statsCache.lastModified;
}

// Update cache with fresh data
async function updateCache() {
  if (statsCache.calculating) {
    // If already calculating, wait for it to complete
    while (statsCache.calculating) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    return statsCache.data;
  }

  statsCache.calculating = true;

  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const items = JSON.parse(raw);
    const fileModTime = await getFileModTime();

    statsCache.data = calculateStats(items);
    statsCache.lastModified = fileModTime;

    console.log("Stats cache updated");
    return statsCache.data;
  } catch (error) {
    console.error("Error updating stats cache:", error);
    throw error;
  } finally {
    statsCache.calculating = false;
  }
}

// GET /api/stats - Cached version
router.get("/", async (req, res, next) => {
  try {
    // Check if cache is valid
    const cacheValid = await isCacheValid();

    if (cacheValid && statsCache.data) {
      // Return cached data with cache header
      res.set("X-Cache", "HIT");
      return res.json(statsCache.data);
    }

    // Cache miss or invalid - update cache
    res.set("X-Cache", "MISS");
    const stats = await updateCache();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// Optional: Endpoint to force cache refresh (useful for debugging)
router.post("/refresh", async (req, res, next) => {
  try {
    statsCache.data = null;
    statsCache.lastModified = null;
    const stats = await updateCache();
    res.json({ message: "Cache refreshed", stats });
  } catch (error) {
    next(error);
  }
});

// Cleanup function for graceful shutdown
function cleanup() {
  if (fileWatcher) {
    fileWatcher.close();
    console.log('File watcher closed');
  }
}

// Handle process termination
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

module.exports = router;