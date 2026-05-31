const NodeCache = require('node-cache');

// Create a NodeCache instance with stdTTL of 300 seconds
const cache = new NodeCache({ stdTTL: 300 });

/**
 * cacheMiddleware - factory function for Express response caching
 * @param {number} duration - cache TTL in seconds
 */
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    // Skips caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Uses req.originalUrl as the cache key
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    // Returns cached response if found
    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Save the original res.json function
    const originalJson = res.json;

    // Wrap res.json to cache the response before sending
    res.json = function (body) {
      // Revert to original res.json to avoid recursion
      res.json = originalJson;
      
      // Cache the response if it was successful (2xx status)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        if (duration) {
          cache.set(key, body, duration);
        } else {
          cache.set(key, body);
        }
      }
      
      return res.json(body);
    };

    next();
  };
};

module.exports = {
  cache,
  cacheMiddleware
};
