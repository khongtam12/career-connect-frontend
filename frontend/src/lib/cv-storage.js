/**
 * CV Storage — localStorage persistence layer.
 * Single source of truth for all CV CRUD operations.
 */

const KEY = 'cv_list'

/** @returns {Array} */
export function getAllCVs() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

/** @param {string} id @returns {object|undefined} */
export function getCVById(id) {
  return getAllCVs().find(c => c.id === id)
}

/**
 * Save (create or update) a CV entry.
 * @param {{ id?: string, name: string, templateId: number, data: object }} entry
 * @returns {string} The saved id
 */
export function saveCV(entry) {
  const list = getAllCVs()
  const id = entry.id || `cv_${Date.now()}`
  const record = { ...entry, id, updatedAt: new Date().toISOString() }
  const idx = list.findIndex(c => c.id === id)
  if (idx >= 0) list[idx] = record
  else list.unshift(record)
  localStorage.setItem(KEY, JSON.stringify(list))
  return id
}

/** @param {string} id */
export function deleteCV(id) {
  const list = getAllCVs().filter(c => c.id !== id)
  localStorage.setItem(KEY, JSON.stringify(list))
}
