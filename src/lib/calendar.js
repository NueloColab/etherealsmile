// Shared calendar utilities used by both customer Book form and admin diary

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }
  return days
}

export function isDateInPast(year, month, day) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const check = new Date(year, month, day)
  return check < today
}

/**
 * Convert a UTC timestamp to a UK-local date string (YYYY-MM-DD).
 * Handles BST (UTC+1) and GMT (UTC+0) correctly.
 * Uses native Intl so no extra dependencies needed.
 */
export function getBookingDateKey(date) {
  if (!date) return null
  return new Date(date).toLocaleDateString('sv-SE', { timeZone: 'Europe/London' })
}

/**
 * Check if two dates represent the same calendar day in UK time.
 */
export function isSameDay(dateA, dateB) {
  return getBookingDateKey(dateA) === getBookingDateKey(dateB)
}