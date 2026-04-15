/**
 * Extract the localised value from a bilingual field.
 *
 * Handles both formats:
 *   - New: { en: "Hello", id: "Halo" }
 *   - Legacy: "Hello" (plain string)
 *
 * @param {string|object} field  The field value from MongoDB
 * @param {string}        lang   "en" or "id"
 * @returns {string}
 */
export function getLocalized(field, lang = 'en') {
  if (!field) return '';

  // Legacy: plain string — return as-is
  if (typeof field === 'string') return field;

  // New: object with language keys
  if (typeof field === 'object' && field !== null) {
    return field[lang] || field.en || field.id || Object.values(field)[0] || '';
  }

  return String(field);
}
