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

/**
 * GreetingDisplay Component
 * Displays current time, date, and time-appropriate greeting
 * 
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7
 */
class GreetingDisplay {
  /**
   * Create a GreetingDisplay instance
   * @param {HTMLElement} containerElement - DOM element to render the greeting display
   */
  constructor(containerElement) {
    this.container = containerElement;
    this.intervalId = null;
  }

  /**
   * Initialize the greeting display and start the clock
   * Creates DOM structure and starts interval timer
   */
  init() {
    // Create DOM structure
    this.container.innerHTML = `
      <div class="greeting-display">
        <div class="time"></div>
        <div class="date"></div>
        <div class="greeting"></div>
      </div>
    `;

    // Cache DOM references
    this.timeElement = this.container.querySelector('.time');
    this.dateElement = this.container.querySelector('.date');
    this.greetingElement = this.container.querySelector('.greeting');

    // Initial display update
    this.updateDisplay();

    // Start interval timer to update every second
    this.intervalId = setInterval(() => {
      this.updateDisplay();
    }, 1000);
  }

  /**
   * Update the display with current time, date, and greeting
   */
  updateDisplay() {
    const now = new Date();
    
    // Update time display
    if (this.timeElement) {
      this.timeElement.textContent = this.formatTime(now);
    }

    // Update date display
    if (this.dateElement) {
      this.dateElement.textContent = this.formatDate(now);
    }

    // Update greeting display
    if (this.greetingElement) {
      const hour = now.getHours();
      this.greetingElement.textContent = this.getGreeting(hour);
    }
  }

  /**
   * Format time in 12-hour format with AM/PM
   * @param {Date} date - Date object to format
   * @returns {string} Formatted time string (e.g., "3:45:12 PM")
   */
  formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    // Determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // 0 should be 12
    
    // Pad minutes and seconds with leading zeros
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');
    
    return `${hours}:${minutesStr}:${secondsStr} ${ampm}`;
  }

  /**
   * Format date as readable string
   * @param {Date} date - Date object to format
   * @returns {string} Formatted date string (e.g., "Monday, March 15, 2024")
   */
  formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();
    
    return `${dayName}, ${monthName} ${dayOfMonth}, ${year}`;
  }

  /**
   * Get time-appropriate greeting based on hour
   * @param {number} hour - Hour in 24-hour format (0-23)
   * @returns {string} Greeting message
   */
  getGreeting(hour) {
    // 5-11: morning
    if (hour >= 5 && hour <= 11) {
      return 'Good morning';
    }
    // 12-16: afternoon
    else if (hour >= 12 && hour <= 16) {
      return 'Good afternoon';
    }
    // 17-20: evening
    else if (hour >= 17 && hour <= 20) {
      return 'Good evening';
    }
    // 21-4: night
    else {
      return 'Good night';
    }
  }

  /**
   * Clean up interval timer
   * Should be called when component is no longer needed
   */
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

/**
 * Initialize Dashboard Components
 * This code runs when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Check if Local Storage is available
  if (!StorageManager.isAvailable()) {
    alert('Local Storage is not available. Your data will not be saved.');
  }

  // Initialize GreetingDisplay component
  const greetingSection = document.querySelector('.greeting-section');
  if (greetingSection) {
    const greetingDisplay = new GreetingDisplay(greetingSection);
    greetingDisplay.init();
  }
});
