import dayjs from 'dayjs';

/**
 * Converts a Firestore timestamp to a human-readable date format.
 * @param {Object} timestamp - The Firestore timestamp object with seconds and nanoseconds fields.
 * @returns {string} The formatted date string.
 */
export function formatFirestoreTimestamp(timestamp) {
  if (!timestamp || typeof timestamp.seconds !== 'number') {
    throw new Error('Invalid timestamp format');
  }

  // Convert seconds to milliseconds and format using Day.js
  return dayjs(timestamp.seconds * 1000).format('MMMM D, YYYY h:mm A');
}

/**
 * Utility function to convert Firebase timestamp to JavaScript Date
 * @param {Object} timestamp - The Firestore timestamp object with seconds and nanoseconds fields.
 * @returns {Date} The formatted date Date || Null.
 */
export const convertFirebaseTimestampToDate = (timestamp) => {
  if (timestamp && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  return null;
};

/**
 * Utility function to format Date for datetime-local input
 * @param {Date} timestamp - The Firestore timestamp object with seconds and nanoseconds fields.
 * @returns {string} The formatted date string.
 */
export const formatDateTimeForInput = (date) => {
  if (!date) return null;
  return date.toISOString().slice(0, 16); // Format to "yyyy-MM-ddThh:mm"
};