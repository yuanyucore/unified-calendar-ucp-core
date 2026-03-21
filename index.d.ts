/**
 * The fully decoded data object returned by the UCP engine.
 */
export interface UCPData {
  ucpString: string;
  western: string;
  chinese: string;
  buddhist: string;
  indian: string;
  islamic: string;
}

/**
 * Takes a UTC date string and returns the full UCP decoded data object.
 * @param dateString A date string in ISO format (e.g., "2026-03-21T14:30:00Z").
 * @returns A `UCPData` object, or `null` if the date is invalid.
 */
export function decodeUCP(dateString: string): UCPData | null;

/**
 * Takes a UTC date string and returns only the UCP protocol string.
 * @param dateString A date string in ISO format.
 * @returns The generated UCP string.
 */
export function generateUCP(dateString: string): string;