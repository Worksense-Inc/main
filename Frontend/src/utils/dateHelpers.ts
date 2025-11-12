/**
 * Format date string (YYYY-MM-DD) to locale date string
 */
export const formatDate = (dateStr: string, options?: Intl.DateTimeFormatOptions): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format date with short month and day (e.g., "Jan 15")
 */
export const formatShortDate = (dateStr: string): string => {
  return formatDate(dateStr, { month: 'short', day: 'numeric' });
};

/**
 * Format date with full weekday and date (e.g., "Monday, January 15")
 */
export const formatLongDate = (dateStr: string): string => {
  return formatDate(dateStr, { weekday: 'long', month: 'long', day: 'numeric' });
};

/**
 * Format date with short weekday and date (e.g., "Mon, Jan 15")
 */
export const formatMediumDate = (dateStr: string): string => {
  return formatDate(dateStr, { weekday: 'short', month: 'short', day: 'numeric' });
};

/**
 * Get today's date as YYYY-MM-DD
 */
export const getTodayString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};
