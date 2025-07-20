# Implementation Plan

- [x] 1. Create foundational UI components

  - Implement base UI components that will be reused throughout the application
  - Create Button, Card, Modal, Input, LoadingSpinner, and Badge components
  - Ensure all components follow the established design system and TailwindCSS patterns
  - _Requirements: 7.4, 8.1, 8.2, 8.3_

- [x] 1.1 Implement Button component with variants

  - Create Button component with primary, secondary, and danger variants
  - Add size variants (sm, md, lg) and loading/disabled states
  - Include proper TypeScript interfaces and accessibility attributes
  - _Requirements: 7.4_

- [x] 1.2 Implement Card component with hover effects

  - Create base Card component with consistent styling
  - Add hover effects and selected states using TailwindCSS transitions
  - Include proper spacing and border radius following design system
  - _Requirements: 7.4, 8.1_

- [x] 1.3 Implement Modal component for forms

  - Create reusable Modal component with backdrop and close functionality
  - Add proper focus management and keyboard navigation (ESC to close)
  - Implement responsive behavior for different screen sizes
  - _Requirements: 2.1, 7.4, 8.3_

- [x] 1.4 Implement Input component with validation display

  - Create Input component with label, error state, and validation messages
  - Support different input types (text, number, email)
  - Add proper styling for focus, error, and disabled states
  - _Requirements: 2.2, 4.4, 7.5_

- [x] 1.5 Implement LoadingSpinner and Badge components

  - Create LoadingSpinner component for async operations
  - Create Badge component for status indicators (live, active, won, lost)
  - Use appropriate colors from design system for different badge types
  - _Requirements: 1.3, 1.5, 3.5, 7.3_

- [x] 2. Create layout components and navigation

  - Implement Header, Navigation, and Layout wrapper components
  - Create responsive navigation that adapts to different screen sizes
  - Integrate with existing user balance and state management
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 8.1, 8.2, 8.3_

- [x] 2.1 Implement Header component with balance display

  - Create Header component showing current user balance
  - Add deposit button for quick access to balance management
  - Display loading state when balance is being updated
  - Format balance display in Brazilian Real (R$) currency
  - _Requirements: 4.6, 6.5_

- [x] 2.2 Implement responsive Navigation component

  - Create Navigation component with section switching functionality
  - Implement desktop layout (horizontal tabs) and mobile layout (bottom navigation)
  - Add active section highlighting and smooth transitions
  - Ensure touch-friendly button sizes for mobile (minimum 44px)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 8.2, 8.3_

- [x] 2.3 Implement Layout wrapper component

  - Create main Layout component that wraps all pages
  - Integrate Header and Navigation components
  - Handle responsive layout changes and proper spacing
  - Add proper semantic HTML structure for accessibility
  - _Requirements: 6.1, 8.1, 8.2, 8.3_

- [x] 3. Create mock data for development and testing

  - Generate realistic mock data for sports events with different sports and statuses
  - Create sample betting data for testing different scenarios
  - Ensure mock data covers edge cases and different states
  - _Requirements: 1.1, 1.2, 3.3_

- [x] 3.1 Create mock sports events data

  - Generate mock SportEvent objects for football, basketball, tennis, and volleyball
  - Include events with different statuses (upcoming, live, finished)
  - Add realistic team names, dates, and odds values
  - Create data utility functions to populate the store for development
  - _Requirements: 1.1, 1.6_

- [x] 3.2 Create mock betting data and scenarios

  - Generate sample Bet objects with different statuses (active, won, lost)
  - Create realistic betting scenarios for development and statistics calculations
  - Include edge cases like zero bets, all wins, all losses
  - Add utility functions to populate betting history for development
  - _Requirements: 3.1, 3.3, 3.6, 5.2, 5.3_

- [x] 4. Implement event-related components

  - Create EventList and EventCard components for displaying sports events
  - Integrate with existing event loading and state management
  - Handle different event statuses and loading states
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 4.1 Implement EventCard component

  - Create EventCard component displaying event information (teams, date, sport, odds)
  - Add visual indicators for event status (upcoming, live, finished)
  - Implement clickable odds buttons for each prediction type
  - Add proper hover effects and responsive design
  - _Requirements: 1.1, 1.5, 1.6_

- [x] 4.2 Implement EventList component

  - Create EventList component that renders multiple EventCard components
  - Handle loading state with LoadingSpinner component
  - Display appropriate message when no events are available
  - Add error state handling with retry functionality
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 4.3 Integrate EventList with mock data and store

  - Connect EventList component to the existing Zustand store
  - Load mock events data on component mount
  - Handle event status updates and real-time changes
  - Add proper error handling and user feedback
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 5. Implement betting form and functionality

  - Create BetForm component for placing bets on events
  - Integrate with existing bet validation and placement logic
  - Handle form validation and error display
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 5.1 Implement BetForm component

  - Create BetForm component with amount input and prediction selection
  - Add form validation using existing Zod schemas
  - Display potential winnings calculation in real-time
  - Include confirmation step before placing bet
  - _Requirements: 2.1, 2.2, 2.6_

- [x] 5.2 Integrate BetForm with Modal and validation

  - Integrate BetForm component within Modal component
  - Add proper form validation with error message display
  - Handle insufficient balance scenarios with clear error messages
  - Add loading state during bet placement
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 5.3 Connect BetForm to store and handle bet placement

  - Connect BetForm to existing placeBet store action
  - Handle successful bet placement with toast notification
  - Update UI state after successful bet placement
  - Add proper error handling for bet placement failures
  - _Requirements: 2.3, 2.4, 2.5_

- [x] 6. Implement bet management components

  - Create BetList and BetCard components for displaying user bets
  - Add filtering functionality for different bet statuses
  - Handle empty states and loading scenarios
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 6.1 Implement BetCard component

  - Create BetCard component displaying bet details (event, amount, odds, status)
  - Add visual status indicators for active, won, and lost bets
  - Display potential winnings for active bets and actual winnings for won bets
  - Include event information within the bet card
  - _Requirements: 3.3, 3.5, 3.6_

- [x] 6.2 Implement BetList component with filtering

  - Create BetList component that renders multiple BetCard components
  - Add filter buttons for different bet statuses (all, active, won, lost)
  - Handle empty states with appropriate messages for each filter
  - Add loading state handling during bet data fetching
  - _Requirements: 3.1, 3.2, 3.4_

- [x] 6.3 Connect BetList to store and implement filtering logic

  - Connect BetList component to existing getBetsByStatus store function
  - Implement client-side filtering for bet status
  - Handle real-time updates when new bets are placed
  - Add proper error handling for bet data loading
  - _Requirements: 3.1, 3.2, 3.4_

- [x] 7. Implement balance management components

  - Create DepositForm component for adding funds to user balance
  - Integrate with existing balance management functionality
  - Handle form validation and success/error states
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 7.1 Implement DepositForm component

  - Create DepositForm component with amount input and validation
  - Use existing Zod deposit schema for form validation
  - Add confirmation step before processing deposit
  - Display current balance and new balance after deposit
  - _Requirements: 4.2, 4.3, 4.4, 4.6_

- [x] 7.2 Integrate DepositForm with Modal and store

  - Integrate DepositForm within Modal component
  - Connect to existing depositBalance store action
  - Handle successful deposits with toast notifications
  - Add loading state during deposit processing
  - _Requirements: 4.2, 4.3, 4.5_

- [x] 7.3 Create balance display component

  - Create dedicated component for displaying current balance
  - Format balance in Brazilian Real currency (R$)
  - Add visual emphasis for balance display
  - Include quick deposit button for easy access
  - _Requirements: 4.1, 4.6_

- [x] 8. Implement statistics display components

  - Create StatsCard component for displaying betting statistics
  - Calculate and display key metrics like win rate and total earnings
  - Handle scenarios with no betting history
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 8.1 Implement StatsCard component

  - Create StatsCard component displaying key betting metrics
  - Show total bets, win rate, total winnings, and total losses

  - Use color coding (green for wins, red for losses) for visual clarity
  - Add proper formatting for percentages and currency values
  - _Requirements: 5.1, 5.4_

- [x] 8.2 Connect StatsCard to store and handle edge cases

  - Connect StatsCard to existing getBettingStats store function
  - Handle scenarios with no betting history (display zeros with explanation)
  - Add loading state for statistics calculation
  - Handle division by zero scenarios in win rate calculation
  - _Requirements: 5.2, 5.3, 5.5_

- [x] 8.3 Create statistics page layout

  - Create comprehensive statistics page with multiple StatsCard components
  - Add breakdown of active bets value and potential winnings
  - Include visual separation between different metric categories
  - Add responsive layout for different screen sizes
  - _Requirements: 5.1, 5.5_

- [x] 9. Create main application pages

  - Implement HomePage, BetsPage, StatsPage, and BalancePage
  - Integrate all components into cohesive page layouts
  - Handle page-level state management and navigation
  - _Requirements: 6.1, 6.2, 6.3, 8.1, 8.2, 8.3_

- [x] 9.1 Implement HomePage with events

  - Create HomePage component integrating EventList and BetForm
  - Add page title and description for sports betting
  - Handle bet form modal opening from event card clicks
  - Add proper page layout with responsive design
  - _Requirements: 1.1, 2.1, 6.1_

- [x] 9.2 Implement BetsPage with filtering

  - Create BetsPage component integrating BetList with filtering
  - Add page title and betting summary information
  - Include filter controls for different bet statuses
  - Add responsive layout for bet cards on different screen sizes
  - _Requirements: 3.1, 3.2, 6.1_

- [x] 9.3 Implement StatsPage and BalancePage

  - Create StatsPage component with comprehensive statistics display
  - Create BalancePage component with balance management and deposit form
  - Add proper page layouts with responsive design
  - Include navigation between related sections
  - _Requirements: 4.1, 5.1, 6.1_

- [x] 10. Implement responsive design and mobile optimization

  - Ensure all components work properly on mobile devices
  - Add touch-friendly interactions and proper spacing
  - Test and optimize for different screen sizes
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 10.1 Optimize mobile layouts and touch interactions

  - Review all components for mobile usability and touch targets
  - Ensure minimum 44px touch targets for all interactive elements
  - Add proper spacing and padding for mobile screens
  - Optimize swipe gestures and mobile-specific interactions
  - _Requirements: 8.3, 8.4_

- [x] 10.2 Optimize responsive breakpoints and layouts

  - Review all components across different screen sizes (mobile, tablet, desktop)
  - Verify proper layout adaptation at each breakpoint
  - Ensure content remains readable and accessible at all sizes
  - Add horizontal scroll handling for tables/lists on small screens
  - _Requirements: 8.1, 8.2, 8.5_

- [x] 11. Add comprehensive error handling and loading states


  - Implement consistent error handling across all components
  - Add proper loading states for all async operations
  - Create user-friendly error messages and recovery options
  - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [x] 11.1 Implement error boundaries and fallback UI

  - Add React error boundaries for component error handling
  - Create fallback UI components for error states
  - Add retry functionality for recoverable errors
  - Implement proper error logging and user feedback
  - _Requirements: 7.2, 7.3_

- [x] 11.2 Add comprehensive loading states

  - Review all async operations and add appropriate loading indicators
  - Implement skeleton loading for better user experience
  - Add loading states for form submissions and data fetching
  - Ensure loading states are accessible and informative
  - _Requirements: 7.3_

- [ ] 12. Integrate toast notifications and user feedback








  - Implement toast notifications for all user actions
  - Add proper success and error messaging throughout the application
  - Ensure consistent feedback patterns across all features
  - _Requirements: 7.1, 7.2, 7.5_

- [ ] 12.1 Add toast notifications for all user actions



  - Integrate react-hot-toast for bet placement confirmations
  - Add success notifications for deposits and other transactions
  - Implement error notifications with actionable messages
  - Add proper toast positioning and timing configuration
  - _Requirements: 7.1, 7.2_

- [ ] 12.2 Implement form validation feedback

  - Add real-time validation feedback for all forms
  - Display specific error messages for validation failures
  - Add visual indicators for form field states (valid, invalid, pending)
  - Ensure validation messages are clear and actionable
  - _Requirements: 7.5_

- [ ] 13. Final integration and testing

  - Connect all components to the main App component
  - Test complete user workflows end-to-end
  - Ensure proper state management and data flow
  - _Requirements: All requirements integration_

- [ ] 13.1 Update main App component with new UI

  - Replace placeholder App component with new Layout and page components
  - Implement proper routing/navigation between different sections
  - Add proper state initialization and data loading on app start
  - Ensure proper integration with existing Zustand store
  - _Requirements: All requirements_

- [ ] 13.2 Final validation of user workflows
  - Validate complete user journey from viewing events to placing bets
  - Verify balance management and deposit functionality
  - Validate statistics calculation and display accuracy
  - Ensure proper error handling in all user scenarios
  - _Requirements: All requirements_
