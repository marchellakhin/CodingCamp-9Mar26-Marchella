# Design Document: Productivity Dashboard

## Overview

The Productivity Dashboard is a client-side web application built with vanilla JavaScript, HTML5, and CSS3. It provides four core productivity features: a time-aware greeting display, a 25-minute focus timer, a task management system, and a quick links manager. All data is persisted to browser Local Storage, enabling offline functionality without any backend dependencies.

### Key Design Principles

- **Simplicity**: Single-file architecture for HTML, CSS, and JavaScript
- **Performance**: Sub-100ms response times for all user interactions
- **Offline-First**: Zero network dependencies after initial load
- **Browser-Native**: No external libraries or build tools required
- **Responsive**: Functional on viewports 320px and wider

### Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Storage**: Browser Local Storage API
- **Deployment**: Static file hosting or browser extension

## Architecture

### System Architecture

The application follows a component-based architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│           index.html (Entry Point)          │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌────────▼─────────┐
│   styles.css   │    │   dashboard.js   │
│  (Presentation)│    │  (Application)   │
└────────────────┘    └──────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
│ GreetingDisplay│  │  FocusTimer     │  │  TaskManager    │
│   Component    │  │   Component     │  │   Component     │
└───────┬────────┘  └────────┬────────┘  └────────┬────────┘
        │                    │                     │
        └────────────────────┼─────────────────────┘
                             │
                    ┌────────▼────────┐
                    │ QuickLinksManager│
                    │    Component     │
                    └────────┬─────────┘
                             │
                    ┌────────▼────────┐
                    │  StorageManager │
                    │  (Local Storage)│
                    └─────────────────┘
```

### Component Responsibilities

**GreetingDisplay Component**
- Displays current time in 12-hour format with AM/PM
- Shows current date in readable format
- Determines and displays time-appropriate greeting (morning/afternoon/evening/night)
- Updates display every second via setInterval

**FocusTimer Component**
- Manages 25-minute countdown timer state
- Handles start, stop, and reset operations
- Formats and displays time in MM:SS format
- Updates display every second when running
- Signals completion when countdown reaches zero

**TaskManager Component**
- Creates new tasks from user input
- Enables task editing, completion toggling, and deletion
- Maintains task order (creation order)
- Renders tasks with visual distinction for completed items
- Persists all changes to Local Storage via StorageManager

**QuickLinksManager Component**
- Creates quick links from name and URL input
- Renders clickable link buttons
- Opens links in new tabs
- Handles link deletion
- Persists all changes to Local Storage via StorageManager

**StorageManager Module**
- Provides abstraction over Local Storage API
- Handles JSON serialization/deserialization
- Implements error handling for storage failures
- Manages consistent key naming scheme
- Gracefully handles corrupted or missing data

### Data Flow

1. **Initialization**: Components load data from StorageManager on page load
2. **User Interaction**: User actions trigger component methods
3. **State Update**: Components update internal state
4. **Persistence**: Components call StorageManager to persist changes
5. **UI Update**: Components re-render affected DOM elements

## Components and Interfaces

### GreetingDisplay Component

**Responsibilities**: Display current time, date, and time-appropriate greeting

**Interface**:
```javascript
class GreetingDisplay {
  constructor(containerElement)
  init()                    // Initialize and start clock
  updateDisplay()           // Update time, date, and greeting
  getGreeting(hour)         // Determine greeting based on hour (5-11: morning, 12-16: afternoon, 17-20: evening, 21-4: night)
  formatTime(date)          // Format time as 12-hour with AM/PM
  formatDate(date)          // Format date as readable string
  destroy()                 // Clean up interval timer
}
```

**DOM Structure**:
```html
<div class="greeting-display">
  <div class="time">HH:MM:SS AM/PM</div>
  <div class="date">Day, Month DD, YYYY</div>
  <div class="greeting">Good [morning|afternoon|evening|night]</div>
</div>
```

### FocusTimer Component

**Responsibilities**: Manage 25-minute countdown timer with start/stop/reset controls

**Interface**:
```javascript
class FocusTimer {
  constructor(containerElement)
  init()                    // Initialize timer UI
  start()                   // Begin countdown
  stop()                    // Pause countdown
  reset()                   // Reset to 25 minutes
  tick()                    // Decrement timer by 1 second
  formatTime(seconds)       // Format seconds as MM:SS
  updateDisplay()           // Render current time
  onComplete()              // Handle timer completion
  destroy()                 // Clean up interval timer
}
```

**State**:
- `remainingSeconds`: Current countdown value (0-1500)
- `isRunning`: Boolean indicating if timer is active
- `intervalId`: Reference to setInterval for cleanup

**DOM Structure**:
```html
<div class="focus-timer">
  <div class="timer-display">MM:SS</div>
  <div class="timer-controls">
    <button class="btn-start">Start</button>
    <button class="btn-stop">Stop</button>
    <button class="btn-reset">Reset</button>
  </div>
  <div class="timer-complete" style="display:none">Timer Complete!</div>
</div>
```

### TaskManager Component

**Responsibilities**: CRUD operations for tasks with Local Storage persistence

**Interface**:
```javascript
class TaskManager {
  constructor(containerElement, storageManager)
  init()                    // Load tasks and render
  addTask(text)             // Create new task
  editTask(id, newText)     // Update task text
  toggleTask(id)            // Toggle completion status
  deleteTask(id)            // Remove task
  getTasks()                // Retrieve all tasks
  renderTasks()             // Update DOM with current tasks
  saveTasks()               // Persist to storage
}
```

**Task Data Model**:
```javascript
{
  id: string,              // Unique identifier (timestamp-based)
  text: string,            // Task description
  completed: boolean,      // Completion status
  createdAt: number        // Timestamp for ordering
}
```

**DOM Structure**:
```html
<div class="task-manager">
  <form class="task-form">
    <input type="text" class="task-input" placeholder="Add a new task...">
    <button type="submit" class="btn-add-task">Add</button>
  </form>
  <ul class="task-list">
    <li class="task-item" data-id="...">
      <input type="checkbox" class="task-checkbox">
      <span class="task-text">Task description</span>
      <button class="btn-edit-task">Edit</button>
      <button class="btn-delete-task">Delete</button>
    </li>
  </ul>
</div>
```

### QuickLinksManager Component

**Responsibilities**: Manage user-defined quick links with Local Storage persistence

**Interface**:
```javascript
class QuickLinksManager {
  constructor(containerElement, storageManager)
  init()                    // Load links and render
  addLink(name, url)        // Create new quick link
  deleteLink(id)            // Remove quick link
  openLink(url)             // Open URL in new tab
  getLinks()                // Retrieve all links
  renderLinks()             // Update DOM with current links
  saveLinks()               // Persist to storage
}
```

**Quick Link Data Model**:
```javascript
{
  id: string,              // Unique identifier (timestamp-based)
  name: string,            // Display name
  url: string,             // Target URL
  createdAt: number        // Timestamp for ordering
}
```

**DOM Structure**:
```html
<div class="quick-links-manager">
  <form class="link-form">
    <input type="text" class="link-name-input" placeholder="Link name...">
    <input type="url" class="link-url-input" placeholder="URL...">
    <button type="submit" class="btn-add-link">Add Link</button>
  </form>
  <div class="links-container">
    <div class="link-item" data-id="...">
      <button class="link-button">Link Name</button>
      <button class="btn-delete-link">×</button>
    </div>
  </div>
</div>
```

### StorageManager Module

**Responsibilities**: Abstract Local Storage operations with error handling

**Interface**:
```javascript
const StorageManager = {
  KEYS: {
    TASKS: 'productivity-dashboard-tasks',
    LINKS: 'productivity-dashboard-links'
  },
  
  save(key, data)           // Serialize and store data
  load(key, defaultValue)   // Retrieve and deserialize data
  isAvailable()             // Check Local Storage availability
  clear(key)                // Remove specific key
  clearAll()                // Remove all app data
}
```

**Error Handling**:
- Returns `defaultValue` if key doesn't exist
- Returns `defaultValue` if JSON parsing fails
- Logs errors to console for debugging
- Throws error if Local Storage is unavailable (quota exceeded, disabled)

## Data Models

### Task Model

```javascript
{
  id: string,              // Format: "task-{timestamp}-{random}"
  text: string,            // 1-500 characters
  completed: boolean,      // Default: false
  createdAt: number        // Unix timestamp in milliseconds
}
```

**Validation Rules**:
- `id`: Must be unique, non-empty string
- `text`: Required, non-empty after trimming, max 500 characters
- `completed`: Boolean, defaults to false
- `createdAt`: Positive integer timestamp

**Storage Format**:
```json
[
  {
    "id": "task-1234567890-abc",
    "text": "Complete project documentation",
    "completed": false,
    "createdAt": 1234567890000
  }
]
```

### Quick Link Model

```javascript
{
  id: string,              // Format: "link-{timestamp}-{random}"
  name: string,            // Display name, 1-100 characters
  url: string,             // Valid URL format
  createdAt: number        // Unix timestamp in milliseconds
}
```

**Validation Rules**:
- `id`: Must be unique, non-empty string
- `name`: Required, non-empty after trimming, max 100 characters
- `url`: Required, must be valid URL format (http:// or https://)
- `createdAt`: Positive integer timestamp

**Storage Format**:
```json
[
  {
    "id": "link-1234567890-xyz",
    "name": "GitHub",
    "url": "https://github.com",
    "createdAt": 1234567890000
  }
]
```

### Timer State Model

```javascript
{
  remainingSeconds: number,  // 0-1500 (25 minutes)
  isRunning: boolean,        // Timer active state
  intervalId: number|null    // setInterval reference
}
```

**Note**: Timer state is NOT persisted to Local Storage. Each session starts with a fresh 25-minute timer.


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Greeting Display Properties

#### Property 1: Time Format Correctness

*For any* Date object, when formatted by the time formatter, the output SHALL contain hours in range 1-12, minutes 00-59, seconds 00-59, and either "AM" or "PM".

**Validates: Requirements 1.1**

#### Property 2: Date Format Readability

*For any* Date object, when formatted by the date formatter, the output SHALL contain the day of week, month name, day of month, and four-digit year.

**Validates: Requirements 1.2**

#### Property 3: Morning Greeting Range

*For any* time where the hour is between 5 AM (inclusive) and 11 AM (inclusive), the greeting function SHALL return "Good morning".

**Validates: Requirements 1.3**

#### Property 4: Afternoon Greeting Range

*For any* time where the hour is between 12 PM (inclusive) and 4 PM (inclusive), the greeting function SHALL return "Good afternoon".

**Validates: Requirements 1.4**

#### Property 5: Evening Greeting Range

*For any* time where the hour is between 5 PM (inclusive) and 8 PM (inclusive), the greeting function SHALL return "Good evening".

**Validates: Requirements 1.5**

#### Property 6: Night Greeting Range

*For any* time where the hour is between 9 PM (inclusive) and 4 AM (inclusive), the greeting function SHALL return "Good night".

**Validates: Requirements 1.6**

### Focus Timer Properties

#### Property 7: Timer Countdown Behavior

*For any* valid timer state with remaining seconds > 0, calling tick() SHALL decrement the remaining seconds by 1.

**Validates: Requirements 2.2**

#### Property 8: Timer Stop Preserves State

*For any* running timer with remaining time T, stopping the timer SHALL preserve the remaining time at T.

**Validates: Requirements 2.3**

#### Property 9: Timer Reset Restores Initial State

*For any* timer state, calling reset() SHALL set remaining seconds to 1500 (25 minutes) and set isRunning to false.

**Validates: Requirements 2.4**

#### Property 10: Timer Format Correctness

*For any* number of seconds in range 0-1500, the format function SHALL return a string in MM:SS format where MM is 00-25 and SS is 00-59.

**Validates: Requirements 2.6**

### Task Management Properties

#### Property 11: Task Creation Adds to List

*For any* valid task text (non-empty, trimmed), creating a task SHALL increase the task list length by 1 and the new task SHALL contain the provided text.

**Validates: Requirements 3.1**

#### Property 12: Task Edit Updates Text

*For any* existing task and any valid new text, editing the task SHALL update the task's text property to the new value while preserving the task's id and createdAt.

**Validates: Requirements 3.2**

#### Property 13: Task Toggle Round Trip

*For any* task, toggling completion status twice SHALL return the task to its original completion state.

**Validates: Requirements 3.3**

#### Property 14: Task Deletion Removes from List

*For any* task list and any task in that list, deleting the task SHALL result in a list that does not contain that task's id and has length reduced by 1.

**Validates: Requirements 3.4**

#### Property 15: Task Order Preservation

*For any* list of tasks, the tasks SHALL be ordered by their createdAt timestamp in ascending order (earliest first).

**Validates: Requirements 3.5**

#### Property 16: Task Completion Visual Distinction

*For any* rendered task, if the task is completed, it SHALL have a different CSS class or style attribute than an incomplete task.

**Validates: Requirements 3.6**

#### Property 17: Task Storage Round Trip

*For any* list of tasks, saving to Local Storage and then loading SHALL produce an equivalent list of tasks with the same ids, text, completion status, and order.

**Validates: Requirements 3.7, 3.8**

### Quick Links Properties

#### Property 18: Link Creation Adds to List

*For any* valid link name and URL, creating a quick link SHALL increase the links list length by 1 and the new link SHALL contain the provided name and URL.

**Validates: Requirements 4.1**

#### Property 19: Link Click Opens Correct URL

*For any* quick link with URL U, clicking the link SHALL invoke window.open with URL U and target "_blank".

**Validates: Requirements 4.2**

#### Property 20: Link Deletion Removes from List

*For any* links list and any link in that list, deleting the link SHALL result in a list that does not contain that link's id and has length reduced by 1.

**Validates: Requirements 4.3**

#### Property 21: Link Rendering as Buttons

*For any* list of quick links, each rendered link SHALL be represented by a button element with the link's name as text content.

**Validates: Requirements 4.4**

#### Property 22: Link Storage Round Trip

*For any* list of quick links, saving to Local Storage and then loading SHALL produce an equivalent list of links with the same ids, names, URLs, and order.

**Validates: Requirements 4.5, 4.6**

### Storage Properties

#### Property 23: Storage Key Consistency

*For any* storage operation (save or load), the operation SHALL use one of the predefined key constants from StorageManager.KEYS.

**Validates: Requirements 9.1**

#### Property 24: Task Storage Format

*For any* task list saved to Local Storage, the stored value SHALL be valid JSON that parses to an array of task objects.

**Validates: Requirements 9.3**

#### Property 25: Link Storage Format

*For any* quick links list saved to Local Storage, the stored value SHALL be valid JSON that parses to an array of link objects.

**Validates: Requirements 9.4**


## Error Handling

### Local Storage Errors

**Scenario**: Local Storage is unavailable (disabled, quota exceeded, private browsing)

**Handling**:
1. StorageManager.isAvailable() checks for Local Storage support on initialization
2. If unavailable, display prominent error message to user: "Local Storage is not available. Your data will not be saved."
3. Application continues to function with in-memory state only
4. All save operations fail silently (logged to console)

**Implementation**:
```javascript
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  return true;
} catch (e) {
  console.error('Local Storage unavailable:', e);
  return false;
}
```

### Corrupted Data Errors

**Scenario**: Data in Local Storage is invalid JSON or has incorrect structure

**Handling**:
1. Wrap JSON.parse() in try-catch block
2. If parsing fails, log error to console with details
3. Return default empty array: `[]`
4. Initialize component with empty state
5. User can add new data normally

**Implementation**:
```javascript
try {
  const data = JSON.parse(localStorage.getItem(key));
  return Array.isArray(data) ? data : defaultValue;
} catch (e) {
  console.error(`Failed to parse ${key}:`, e);
  return defaultValue;
}
```

### Missing Data Errors

**Scenario**: Expected key doesn't exist in Local Storage (first load, cleared data)

**Handling**:
1. Check if localStorage.getItem() returns null
2. Return default value (empty array for tasks/links)
3. No error message needed (normal first-run scenario)

### Input Validation Errors

**Scenario**: User submits invalid input (empty task, invalid URL)

**Handling**:

**Empty Task Text**:
- Trim input before validation
- If empty after trim, prevent submission
- Show brief error message: "Task cannot be empty"
- Keep focus on input field

**Invalid URL**:
- Validate URL format using URL constructor
- If invalid, show error message: "Please enter a valid URL (http:// or https://)"
- Keep focus on URL input field
- Allow user to correct

**Implementation**:
```javascript
// Task validation
const text = input.value.trim();
if (!text) {
  showError('Task cannot be empty');
  return;
}

// URL validation
try {
  new URL(url);
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    throw new Error('Invalid protocol');
  }
} catch (e) {
  showError('Please enter a valid URL');
  return;
}
```

### Timer Edge Cases

**Scenario**: Timer reaches zero

**Handling**:
1. Stop the interval timer
2. Set remainingSeconds to 0
3. Set isRunning to false
4. Display completion message
5. Play completion indicator (visual only, no audio)

**Scenario**: Multiple rapid clicks on start/stop

**Handling**:
1. Check isRunning state before starting
2. Clear existing interval before creating new one
3. Prevent multiple intervals running simultaneously

### DOM Manipulation Errors

**Scenario**: Required DOM elements not found

**Handling**:
1. Check for element existence before manipulation
2. Log error if element missing
3. Fail gracefully without crashing application

**Implementation**:
```javascript
const element = document.querySelector(selector);
if (!element) {
  console.error(`Element not found: ${selector}`);
  return;
}
```

## Testing Strategy

### Overview

The testing strategy employs a dual approach combining unit tests for specific scenarios and property-based tests for comprehensive input coverage. This ensures both concrete examples work correctly and universal properties hold across all valid inputs.

### Testing Framework Selection

**Unit Testing**: Jest (or Vitest for faster execution)
- Widely adopted, excellent browser API mocking
- Built-in assertion library
- Good DOM testing support with jsdom

**Property-Based Testing**: fast-check
- Mature JavaScript PBT library
- Excellent generator combinators
- Configurable iteration counts
- Good integration with Jest/Vitest

### Test Organization

```
tests/
├── unit/
│   ├── greeting-display.test.js
│   ├── focus-timer.test.js
│   ├── task-manager.test.js
│   ├── quick-links-manager.test.js
│   └── storage-manager.test.js
├── property/
│   ├── greeting-display.property.test.js
│   ├── focus-timer.property.test.js
│   ├── task-manager.property.test.js
│   ├── quick-links-manager.property.test.js
│   └── storage-manager.property.test.js
└── integration/
    └── dashboard.integration.test.js
```

### Unit Testing Approach

Unit tests focus on:
- **Specific examples**: Concrete test cases that demonstrate correct behavior
- **Edge cases**: Boundary conditions (timer at 0, empty lists, midnight hour transitions)
- **Error conditions**: Invalid inputs, storage failures, missing DOM elements
- **Integration points**: Component interactions with StorageManager

**Example Unit Tests**:
- Timer initializes to exactly 25 minutes (1500 seconds)
- Greeting at exactly 5:00 AM returns "Good morning"
- Greeting at exactly 11:59 AM returns "Good morning"
- Greeting at exactly 12:00 PM returns "Good afternoon"
- Empty task submission is rejected
- Invalid URL format is rejected
- Corrupted JSON in storage returns empty array
- Missing storage key returns default value

### Property-Based Testing Approach

Property tests verify universal properties across randomized inputs:
- **Minimum 100 iterations per test** (due to randomization)
- **Each test references its design property** using comment tags
- **Generators create valid random inputs** (dates, times, tasks, links)
- **Properties verify invariants** that must hold for all inputs

**Tag Format**:
```javascript
// Feature: productivity-dashboard, Property 1: Time Format Correctness
test('time format contains all required components', () => {
  fc.assert(
    fc.property(fc.date(), (date) => {
      const formatted = formatTime(date);
      // assertions...
    }),
    { numRuns: 100 }
  );
});
```

### Property Test Implementation

**Greeting Display Properties**:
- Generate random dates across full range
- Verify time format (12-hour, AM/PM)
- Verify date format (readable components)
- Verify greeting correctness for all hour ranges

**Focus Timer Properties**:
- Generate random timer states (0-1500 seconds)
- Verify tick decrements correctly
- Verify stop preserves state
- Verify reset returns to 1500
- Verify format output for all second values

**Task Manager Properties**:
- Generate random task lists
- Generate random task text (valid and invalid)
- Verify creation increases list length
- Verify edit updates text only
- Verify toggle round trip
- Verify deletion removes task
- Verify order preservation
- Verify storage round trip

**Quick Links Properties**:
- Generate random link lists
- Generate random names and URLs
- Verify creation increases list length
- Verify deletion removes link
- Verify storage round trip
- Verify rendering as buttons

**Storage Properties**:
- Generate random data structures
- Verify JSON serialization round trip
- Verify key consistency
- Verify array format

### Custom Generators

**Task Generator**:
```javascript
const taskGenerator = fc.record({
  id: fc.string({ minLength: 1 }),
  text: fc.string({ minLength: 1, maxLength: 500 }),
  completed: fc.boolean(),
  createdAt: fc.integer({ min: 0 })
});
```

**Link Generator**:
```javascript
const linkGenerator = fc.record({
  id: fc.string({ minLength: 1 }),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  url: fc.webUrl(),
  createdAt: fc.integer({ min: 0 })
});
```

**Time Generator**:
```javascript
const hourGenerator = fc.integer({ min: 0, max: 23 });
const minuteGenerator = fc.integer({ min: 0, max: 59 });
const secondGenerator = fc.integer({ min: 0, max: 59 });
```

### Mocking Strategy

**Local Storage Mock**:
```javascript
const localStorageMock = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = value; },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};
global.localStorage = localStorageMock;
```

**Timer Mock**:
```javascript
jest.useFakeTimers();
// Test timer behavior
jest.advanceTimersByTime(1000);
jest.useRealTimers();
```

**DOM Mock**:
- Use jsdom for DOM environment
- Create container elements for component mounting
- Clean up after each test

### Integration Testing

**Scope**: End-to-end workflows across multiple components

**Test Scenarios**:
1. Create task → Verify in DOM → Reload page → Verify persistence
2. Create link → Click link → Verify window.open called
3. Start timer → Wait → Stop → Verify time preserved
4. Create multiple tasks → Verify order → Toggle completion → Verify visual distinction

### Test Coverage Goals

- **Line Coverage**: Minimum 90%
- **Branch Coverage**: Minimum 85%
- **Function Coverage**: 100% (all public methods tested)
- **Property Coverage**: 100% (all design properties have corresponding tests)

### Continuous Testing

- Run unit tests on every commit
- Run property tests on every commit (100 iterations)
- Run integration tests before merge to main
- Generate coverage reports in CI/CD pipeline

### Edge Cases to Test

1. **Timer at zero**: Completion indicator shown, timer stopped
2. **Empty task list**: Renders empty state correctly
3. **Empty links list**: Renders empty state correctly
4. **Midnight hour transition**: Greeting changes from "Good night" to "Good night" (21:00-04:00)
5. **Noon hour transition**: Greeting changes from "Good morning" to "Good afternoon"
6. **Maximum task text length**: 500 characters accepted
7. **Task text with only whitespace**: Rejected
8. **URL without protocol**: Rejected
9. **Storage quota exceeded**: Error message displayed
10. **Corrupted JSON in storage**: Defaults to empty array
11. **Multiple rapid timer clicks**: No duplicate intervals

### Manual Testing Checklist

- [ ] Test in Chrome stable
- [ ] Test in Firefox stable
- [ ] Test in Edge stable
- [ ] Test in Safari stable
- [ ] Test on viewport 320px wide
- [ ] Test on viewport 1920px wide
- [ ] Verify no horizontal scrolling at 320px
- [ ] Verify font sizes are readable
- [ ] Verify color contrast meets WCAG AA
- [ ] Verify no network requests after load
- [ ] Test with Local Storage disabled
- [ ] Test with browser extension deployment

