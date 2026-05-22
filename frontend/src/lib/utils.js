import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes safely (handles conflicts).
 * Usage: cn('px-4 py-2', isActive && 'bg-primary', className)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format "YYYY-MM" → "MM/YYYY"
 * @param {string} str – e.g. "2023-06"
 */
export function formatMonthYear(str) {
  if (!str) return ''
  const [y, m] = str.split('-')
  if (!y || !m) return str
  return `${m}/${y}`
}

/**
 * Calculate CV completeness score (0–100) and suggestions list.
 * Extracted from AIAssistant to be reusable.
 * @param {object} data – CV data object
 * @returns {{ score: number, suggestions: string[] }}
 */
export function calcCVScore(data) {
  let score = 0
  const suggestions = []
  const p = data?.personal || {}

  if (p.fullName)                         score += 10
  if (p.email)                            score += 8
  if (p.phone)                            score += 5
  if (p.address)                          score += 4
  if (p.jobTitle)                         score += 7
  if (p.summary && p.summary.length > 50) score += 10
  else suggestions.push('Bổ sung mục tiêu nghề nghiệp chi tiết hơn (ít nhất 50 ký tự)')

  const skills = data?.skills || []
  if (skills.length >= 5)       score += 15
  else if (skills.length >= 1)  { score += skills.length * 2; suggestions.push(`Thêm ít nhất ${5 - skills.length} kỹ năng nữa`) }
  else                          suggestions.push('Thêm ít nhất 3–5 kỹ năng chính')

  const exp = data?.experience || []
  if (exp.length > 0) score += 15
  else suggestions.push('Thêm kinh nghiệm làm việc để nổi bật hơn')

  const edu = data?.education || []
  if (edu.length > 0) score += 10
  else suggestions.push('Bổ sung thông tin học vấn')

  const projs = data?.projects || []
  if (projs.length >= 2)     score += 10
  else if (projs.length === 1) { score += 5; suggestions.push('Thêm thêm dự án cá nhân') }
  else                         suggestions.push('Thêm dự án cá nhân để nổi bật hơn')

  const certs = data?.certificates || []
  if (certs.length > 0) score += 5
  else suggestions.push('Thêm chứng chỉ nghề nghiệp liên quan')

  if (p.linkedin) score += 3
  else suggestions.push('Thêm link LinkedIn hoặc Portfolio')

  return { score: Math.min(score, 100), suggestions }
}

/**
 * Generate a short unique id.
 */
export function uid() {
  return `cv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

const PROVINCE_LABELS = {
  hanoi: 'Thành phố Hà Nội',
  caobang: 'Tỉnh Cao Bằng',
  tuyenquang: 'Tỉnh Tuyên Quang',
  dienbien: 'Tỉnh Điện Biên',
  laichau: 'Tỉnh Lai Châu',
  sonla: 'Tỉnh Sơn La',
  laocai: 'Tỉnh Lào Cai',
  thainguyen: 'Tỉnh Thái Nguyên',
  langson: 'Tỉnh Lạng Sơn',
  quangninh: 'Tỉnh Quảng Ninh',
  bacninh: 'Tỉnh Bắc Ninh',
  phutho: 'Tỉnh Phú Thọ',
  haiphong: 'Thành phố Hải Phòng',
  hungyen: 'Tỉnh Hưng Yên',
  ninhbinh: 'Tỉnh Ninh Bình',
  thanhhoa: 'Tỉnh Thanh Hóa',
  nghean: 'Tỉnh Nghệ An',
  hatinh: 'Tỉnh Hà Tĩnh',
  quangtri: 'Tỉnh Quảng Trị',
  hue: 'Thành phố Huế',
  danang: 'Thành phố Đà Nẵng',
  quangngai: 'Tỉnh Quảng Ngãi',
  gialai: 'Tỉnh Gia Lai',
  khanhhoa: 'Tỉnh Khánh Hòa',
  daklak: 'Tỉnh Đắk Lắk',
  lamdong: 'Tỉnh Lâm Đồng',
  dongnai: 'Tỉnh Đồng Nai',
  hcm: 'Thành phố Hồ Chí Minh',
  hochiminh: 'Thành phố Hồ Chí Minh',
  tphochiminh: 'Thành phố Hồ Chí Minh',
  tphcm: 'Thành phố Hồ Chí Minh',
  saigon: 'Thành phố Hồ Chí Minh',
  tayninh: 'Tỉnh Tây Ninh',
  dongthap: 'Tỉnh Đồng Tháp',
  vinhlong: 'Tỉnh Vĩnh Long',
  angiang: 'Tỉnh An Giang',
  cantho: 'Thành phố Cần Thơ',
  camau: 'Tỉnh Cà Mau',
}

const normalizeProvinceKey = (value) => {
  const stripped = String(value || '')
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .trim()
    .replace(/^(tinh|thanh pho|tp\.?|thu do)\s+/, '')

  return stripped.replace(/[^a-z0-9]/g, '')
}

export function formatProvinceLabel(province) {
  if (!province) return ''

  const key = normalizeProvinceKey(province)
  if (PROVINCE_LABELS[key]) return PROVINCE_LABELS[key]

  return province
}
