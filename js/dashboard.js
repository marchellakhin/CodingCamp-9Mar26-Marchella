/**
 * Productivity Dashboard
 * A client-side web application for productivity management
 */

/**
 * StorageManager Module
 * Provides abstraction over Local Storage API with error handling
 * 
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6
 */
const StorageManager = {
  /**
   * Storage key constants for consistent naming
   */
  KEYS: {
    TASKS: 'productivity-dashboard-tasks',
    LINKS: 'productivity-dashboard-links'
  },

  /**
   * Save data to Local Storage with JSON serialization
   * @param {string} key - Storage key (should use KEYS constants)
   * @param {*} data - Data to store (will be JSON serialized)
   * @throws {Error} If Local Storage is unavailable
   */
  save(key, data) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
    } catch (e) {
      console.error(`Failed to save data for key "${key}":`, e);
      throw new Error(`Local Storage save failed: ${e.message}`);
    }
  },

  /**
   * Load data from Local Storage with JSON parsing and error handling
   * @param {string} key - Storage key to retrieve
   * @param {*} defaultValue - Value to return if key doesn't exist or parsing fails
   * @returns {*} Parsed data or defaultValue
   */
  load(key, defaultValue) {
    try {
      const item = localStorage.getItem(key);
      
      // Return default if key doesn't exist
      if (item === null) {
        return defaultValue;
      }

      // Parse JSON data
      const parsed = JSON.parse(item);
      
      // Validate that parsed data is an array (for tasks and links)
      if (defaultValue !== undefined && Array.isArray(defaultValue)) {
        if (!Array.isArray(parsed)) {
          console.error(`Data for key "${key}" is not an array, returning default value`);
          return defaultValue;
        }
      }
      
      return parsed;
    } catch (e) {
      // Return default value if JSON parsing fails
      console.error(`Failed to load data for key "${key}":`, e);
      return defaultValue;
    }
  },

  /**
   * Check if Local Storage is available
   * @returns {boolean} True if Local Storage is available and functional
   */
  isAvailable() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.error('Local Storage is not available:', e);
      return false;
    }
  },

  /**
   * Remove a specific key from Local Storage
   * @param {string} key - Storage key to remove
   */
  clear(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Failed to clear key "${key}":`, e);
    }
  },

  /**
   * Remove all application data from Local Storage
   */
  clearAll() {
    try {
      this.clear(this.KEYS.TASKS);
      this.clear(this.KEYS.LINKS);
    } catch (e) {
      console.error('Failed to clear all data:', e);
    }
  }
};
