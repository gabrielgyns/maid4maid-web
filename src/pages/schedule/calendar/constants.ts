// Start and end hours for the week and day views
export const START_HOUR = 6; // 6 AM
export const END_HOUR = 24; // 11 PM (to show 10 PM slot)

// Calendar view constants
export const HOUR_HEIGHT = 80; // pixels per hour

// Number of days to show in the agenda view
export const AGENDA_DAYS_TO_SHOW = 30;

// Event/Job constants
export const MIN_EVENT_HEIGHT = 30; // Minimum height for events in pixels
export const EVENT_GAP = 2; // Gap between events in pixels

// Calendar CSS custom properties
export const CSS_VARIABLES = {
  '--event-height': `${MIN_EVENT_HEIGHT}px`,
  '--event-gap': `${EVENT_GAP}px`,
  '--hour-height': `${HOUR_HEIGHT}px`,
} as const;
