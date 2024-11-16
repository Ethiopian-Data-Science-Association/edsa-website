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