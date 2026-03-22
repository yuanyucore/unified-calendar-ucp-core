/**
 * The fully decoded data object returned by the UCP engine.
 */
export interface UCPData {
  ucpString: string;
  gregorian: string;
  xia: string;
  chinese: string;
  hindu: string;
  buddhist: string;
  saka: string;
  islamic: string;
}

export function decodeUCP(dateString: string): UCPData | null;
export function generateUCP(dateString: string): string;