# Implementation Plan: Productivity Dashboard

## Overview

This implementation plan breaks down the Productivity Dashboard into discrete coding tasks. The dashboard is a vanilla JavaScript application with HTML and CSS, featuring a greeting display, focus timer, task manager, and quick links manager. All data persists to browser Local Storage. Tasks are ordered to build incrementally, with early validation through property-based tests.

## Tasks

- [x] 1. Set up project structure and HTML foundation
  - Create root directory structure: `css/`, `js/`, and root level
  - Create `index.html` with semantic HTML5 structure and all component containers
  - Link stylesheet and JavaScript file with proper paths
  - Include meta tags for viewport and charset
  - _Requirements: 8.1, 8.2, 8.3, 7.6_

- [x] 2. Create base CSS styling and layout
  - Create `css/styles.css` with CSS reset and base styles
  - Implement responsive layout with CSS Grid or Flexbox
  - Define color scheme and typography (minimum 14px body text)
  - Style all component containers with clear visual hierarchy
  - Ensure responsive behavior for viewports 320px and wider
  - _Requirements: 7.1, 7.2, 7.3, 7.5, 7.6_

- [x] 3. Implement StorageManager module
  - [x] 3.1 Create `js/dashboard.js` and implement StorageManager object
    - Define KEYS constant object with task and link key names
    - Implement `save(key, data)` method with JSON serialization
    - Implement `load(key, defaultValue)` method with JSON parsing and error handling
    - Implement `isAvailable()` method to check Local Storage support
    - Implement `clear(key)` and `clearAll()` methods
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ]* 3.2 Write property tests for StorageManager
    - **Property 23: Storage Key Consistency**
    - **Validates: Requirements 9.1**
    - **Property 24: Task Storage Format**
    - **Validates: Requirements 9.3**
    - **Property 25: Link Storage Format**
    - **Validates: Requirements 9.4**

- [ ] 4. Implement GreetingDisplay component
  - [ ] 4.1 Create GreetingDisplay class with constructor and initialization
    - Implement constructor accepting container element
    - Implement `init()` method to set up DOM structure
    - Implement `formatTime(date)` to return 12-hour format with AM/PM
    - Implement `formatDate(date)` to return readable date string
    - Implement `getGreeting(hour)` with time-based logic (5-11: morning, 12-16: afternoon, 17-20: evening, 21-4: night)
    - Implement `updateDisplay()` to refresh time, date, and greeting
    - Implement `destroy()` to clean up interval timer
    - Start interval timer in `init()` to update every second
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [ ]* 4.2 Write property tests for GreetingDisplay
    - **Property 1: Time Format Correctness**
    - **Validates: Requirements 1.1**
    - **Property 2: Date Format Readability**
    - **Validates: Requirements 1.2**
    - **Property 3: Morning Greeting Range**
    - **Validates: Requirements 1.3**
    - **Property 4: Afternoon Greeting Range**
    - **Validates: Requirements 1.4**
    - **Property 5: Evening Greeting Range**
    - **Validates: Requirements 1.5**
    - **Property 6: Night Greeting Range**
    - **Validates: Requirements 1.6**

- [ ] 5. Implement FocusTimer component
  - [ ] 5.1 Create FocusTimer class with timer state management
    - Implement constructor accepting container element
    - Initialize state: `remainingSeconds` (1500), `isRunning` (false), `intervalId` (null)
    - Implement `init()` method to set up DOM structure and button event listeners
    - Implement `start()` method to begin countdown with interval
    - Implement `stop()` method to pause countdown and preserve state
    - Implement `reset()` method to restore 25 minutes and stop timer
    - Implement `tick()` method to decrement seconds and check for completion
    - Implement `formatTime(seconds)` to return MM:SS format
    - Implement `updateDisplay()` to render current time
    - Implement `onComplete()` to show completion indicator
    - Implement `destroy()` to clean up interval timer
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 5.2 Write property tests for FocusTimer
    - **Property 7: Timer Countdown Behavior**
    - **Validates: Requirements 2.2**
    - **Property 8: Timer Stop Preserves State**
    - **Validates: Requirements 2.3**
    - **Property 9: Timer Reset Restores Initial State**
    - **Validates: Requirements 2.4**
    - **Property 10: Timer Format Correctness**
    - **Validates: Requirements 2.6**

- [ ] 6. Checkpoint - Verify greeting and timer functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement TaskManager component
  - [ ] 7.1 Create TaskManager class with CRUD operations
    - Implement constructor accepting container element and storageManager
    - Initialize tasks array as empty
    - Implement `init()` method to load tasks from storage and render
    - Implement `addTask(text)` to create task with unique ID and timestamp
    - Implement `editTask(id, newText)` to update task text
    - Implement `toggleTask(id)` to flip completion status
    - Implement `deleteTask(id)` to remove task from array
    - Implement `getTasks()` to return tasks sorted by createdAt
    - Implement `renderTasks()` to update DOM with task list
    - Implement `saveTasks()` to persist to StorageManager
    - Add input validation: trim text, reject empty, max 500 characters
    - Add event listeners for form submission and task interactions
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ]* 7.2 Write property tests for TaskManager
    - **Property 11: Task Creation Adds to List**
    - **Validates: Requirements 3.1**
    - **Property 12: Task Edit Updates Text**
    - **Validates: Requirements 3.2**
    - **Property 13: Task Toggle Round Trip**
    - **Validates: Requirements 3.3**
    - **Property 14: Task Deletion Removes from List**
    - **Validates: Requirements 3.4**
    - **Property 15: Task Order Preservation**
    - **Validates: Requirements 3.5**
    - **Property 16: Task Completion Visual Distinction**
    - **Validates: Requirements 3.6**
    - **Property 17: Task Storage Round Trip**
    - **Validates: Requirements 3.7, 3.8**

- [ ] 8. Style TaskManager component
  - Add CSS for task form, input, and submit button
  - Style task list items with checkbox, text, and action buttons
  - Add visual distinction for completed tasks (strikethrough, opacity, or color)
  - Style edit and delete buttons with clear icons or labels
  - Ensure responsive layout and touch-friendly button sizes
  - _Requirements: 3.6, 7.3, 7.4_

- [ ] 9. Implement QuickLinksManager component
  - [ ] 9.1 Create QuickLinksManager class with link management
    - Implement constructor accepting container element and storageManager
    - Initialize links array as empty
    - Implement `init()` method to load links from storage and render
    - Implement `addLink(name, url)` to create link with unique ID and timestamp
    - Implement `deleteLink(id)` to remove link from array
    - Implement `openLink(url)` to open URL in new tab with window.open
    - Implement `getLinks()` to return all links
    - Implement `renderLinks()` to update DOM with link buttons
    - Implement `saveLinks()` to persist to StorageManager
    - Add input validation: trim name/url, reject empty, validate URL format
    - Add event listeners for form submission and link interactions
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 9.2 Write property tests for QuickLinksManager
    - **Property 18: Link Creation Adds to List**
    - **Validates: Requirements 4.1**
    - **Property 19: Link Click Opens Correct URL**
    - **Validates: Requirements 4.2**
    - **Property 20: Link Deletion Removes from List**
    - **Validates: Requirements 4.3**
    - **Property 21: Link Rendering as Buttons**
    - **Validates: Requirements 4.4**
    - **Property 22: Link Storage Round Trip**
    - **Validates: Requirements 4.5, 4.6**

- [ ] 10. Style QuickLinksManager component
  - Add CSS for link form with name and URL inputs
  - Style link buttons as clickable elements with hover states
  - Style delete buttons for each link
  - Implement responsive grid or flexbox layout for link buttons
  - Ensure visual consistency with overall dashboard design
  - _Requirements: 7.3, 7.4_

- [ ] 11. Wire all components together in main initialization
  - Create DOMContentLoaded event listener in dashboard.js
  - Check StorageManager.isAvailable() and display error if unavailable
  - Instantiate GreetingDisplay with container element
  - Instantiate FocusTimer with container element
  - Instantiate TaskManager with container element and StorageManager
  - Instantiate QuickLinksManager with container element and StorageManager
  - Call init() on all component instances
  - _Requirements: 9.2, 10.1, 10.2, 10.3_

- [ ] 12. Checkpoint - Verify all components integrated
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Implement error handling and edge cases
  - Add error message display for Local Storage unavailable
  - Add error handling for corrupted JSON data in storage
  - Add validation error messages for empty task and invalid URL
  - Handle timer completion edge case (display indicator, stop timer)
  - Prevent multiple timer intervals from running simultaneously
  - Handle missing DOM elements gracefully with console errors
  - _Requirements: 9.2, 9.5, 9.6_

- [ ] 14. Add responsive design refinements
  - Test layout at 320px viewport width
  - Adjust font sizes and spacing for mobile devices
  - Ensure no horizontal scrolling at minimum viewport
  - Test touch interactions on mobile (button sizes, tap targets)
  - Verify all components stack properly on narrow screens
  - _Requirements: 7.6, 6.2_

- [ ] 15. Performance optimization
  - Minimize DOM manipulations by batching updates
  - Ensure all user interactions respond within 100ms
  - Optimize renderTasks() and renderLinks() for large lists
  - Verify initial page load completes within 1 second
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ]* 16. Write integration tests
  - Test complete task workflow: create → persist → reload → verify
  - Test complete link workflow: create → click → verify window.open
  - Test timer workflow: start → stop → verify state preserved
  - Test multiple tasks with order preservation
  - Test task completion visual distinction
  - _Requirements: 3.1-3.8, 4.1-4.6, 2.1-2.7_

- [ ] 17. Final checkpoint - Complete testing and validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property-based tests use fast-check library with minimum 100 iterations
- All components use vanilla JavaScript (ES6+) with no external dependencies
- Testing framework: Jest or Vitest with jsdom for DOM testing
- Manual browser testing required for Requirements 5.1-5.4 (Chrome, Firefox, Edge, Safari)
