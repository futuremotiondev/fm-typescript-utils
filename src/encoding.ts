/**
 * Type-safe object to access all valid Node.js BufferEncoding string literals.
 * Usage: EncodingHelper.utf8, EncodingHelper['utf-8'], etc.
 */

export const EncodingHelper = {
  ascii:     'ascii',
  utf8:      'utf8',
  'utf-8':   'utf-8',
  utf16le:   'utf16le',
  ucs2:      'ucs2',
  'ucs-2':   'ucs-2',
  base64:    'base64',
  base64url: 'base64url',
  latin1:    'latin1',
  binary:    'binary',
  hex:       'hex',
} as const;

// Export the BufferEncoding union type as well for convenience
export type BufferEncodingType = keyof typeof EncodingHelper | typeof EncodingHelper[keyof typeof EncodingHelper];

/**
 * Returns all BufferEncoding string literals.
 */
export function getAllBufferEncodings(): BufferEncoding[] {
  return Object.values(EncodingHelper) as BufferEncoding[];
}
