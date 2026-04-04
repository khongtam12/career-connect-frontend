import { useState } from 'react'

function Post() {
    const [formData, setFormData] = useState({
        position: 'Kinh doanh Domain/Hosting/Server',
        level: 'Nhân viên',
        deadline: '17/04/2026',
        isContinuous: false,
        quantity: 2,
        budgetFrom: '',
        budgetTo: '',
        budgetSource: 'company',
        consultNeeds: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
    }

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Form Section */}
            <div className="flex-1 bg-white p-12 overflow-y-auto">
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-normal text-gray-800 mb-2">
                        Xin chào, <span className="text-emerald-500 font-medium">Tâm Không</span>
                    </h1>
                    <p className="text-gray-600 text-sm leading-relaxed mb-8">
                        Hãy cung cấp thông tin về đơt tuyển dụng sắp tới để chúng tôi hỗ trợ bạn tốt hơn
                    </p>

                    <div className="mb-8">
                        <h2 className="text-xl font-medium text-gray-800 mb-2">Nhu cầu tuyển dụng</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Đây là thông tin về vị trí bạn đang cần ứu tiên tuyển nhất hiện tại. Bạn hoàn toàn có thể bổ sung hoặc chỉnh sửa các vị trí khác tại{' '}
                            <a href="#" className="text-emerald-500 hover:underline">Quản lý nhu cầu tuyển dụng</a>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Position */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-800 font-medium">
                                Bạn đang tuyển dụng vị trí chuyên môn nào? <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.position}
                                onChange={(e) => updateField('position', e.target.value)}
                                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white transition-colors focus:outline-none focus:border-emerald-500 appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22%3E%3Cpath fill=%22%23666%22 d=%22M6 9L1 4h10z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center] pr-9"
                            >
                                <option>Kinh doanh Domain/Hosting/Server</option>
                                <option>Marketing</option>
                                <option>IT Support</option>
                                <option>Developer</option>
                            </select>
                        </div>

                        {/* Level */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-800 font-medium">
                                Cấp bậc <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.level}
                                onChange={(e) => updateField('level', e.target.value)}
                                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white transition-colors focus:outline-none focus:border-emerald-500 appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22%3E%3Cpath fill=%22%23666%22 d=%22M6 9L1 4h10z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center] pr-9"
                            >
                                <option>Nhân viên</option>
                                <option>Trưởng nhóm</option>
                                <option>Quản lý</option>
                                <option>Giám đốc</option>
                            </select>
                        </div>

                        {/* Deadline and Quantity Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Deadline */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-800 font-medium">
                                    Thời gian cần tuyển xong là khi nào? <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.deadline}
                                    onChange={(e) => updateField('deadline', e.target.value)}
                                    className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 transition-colors focus:outline-none focus:border-emerald-500"
                                    placeholder="DD/MM/YYYY"
                                />
                                <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer mt-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isContinuous}
                                        onChange={(e) => updateField('isContinuous', e.target.checked)}
                                        className="w-4 h-4 cursor-pointer accent-emerald-500"
                                    />
                                    <span>Tuyển liên tục</span>
                                </label>
                            </div>

                            {/* Quantity */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-800 font-medium">
                                    Số lượng cần tuyển <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                                    <button
                                        type="button"
                                        onClick={() => updateField('quantity', Math.max(1, formData.quantity - 1))}
                                        className="px-4 py-2.5 text-gray-600 transition-colors hover:bg-gray-100"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => updateField('quantity', parseInt(e.target.value) || 1)}
                                        min="1"
                                        className="flex-1 text-center text-sm py-2.5 border-0 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => updateField('quantity', formData.quantity + 1)}
                                        className="px-4 py-2.5 text-gray-600 transition-colors hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Budget Range */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-800 font-medium">Ngân sách tuyển dụng cho vị trí này của bạn là?</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={formData.budgetFrom}
                                    onChange={(e) => updateField('budgetFrom', e.target.value)}
                                    placeholder="Từ"
                                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 transition-colors focus:outline-none focus:border-emerald-500"
                                />
                                <span className="text-gray-600 text-sm">−</span>
                                <input
                                    type="text"
                                    value={formData.budgetTo}
                                    onChange={(e) => updateField('budgetTo', e.target.value)}
                                    placeholder="Đến"
                                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 transition-colors focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Budget Source */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-800 font-medium">Chọn nguồn ngân sách tuyển dụng của bạn</label>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="budgetSource"
                                        value="company"
                                        checked={formData.budgetSource === 'company'}
                                        onChange={(e) => updateField('budgetSource', e.target.value)}
                                        className="w-4 h-4 cursor-pointer accent-emerald-500"
                                    />
                                    <span>Công ty</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="budgetSource"
                                        value="personal"
                                        checked={formData.budgetSource === 'personal'}
                                        onChange={(e) => updateField('budgetSource', e.target.value)}
                                        className="w-4 h-4 cursor-pointer accent-emerald-500"
                                    />
                                    <span>Cá nhân</span>
                                </label>
                            </div>
                        </div>

                        {/* Consultation */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-800 font-medium">Bạn có nhu cầu cần tư vấn ký hợp về vấn đề nào không?</label>
                            <select
                                value={formData.consultNeeds}
                                onChange={(e) => updateField('consultNeeds', e.target.value)}
                                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 bg-white transition-colors focus:outline-none focus:border-emerald-500 appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22%3E%3Cpath fill=%22%23666%22 d=%22M6 9L1 4h10z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center] pr-9"
                            >
                                <option value="">Chọn nhu cầu tư vấn</option>
                                <option>Hợp đồng lao động</option>
                                <option>Chế độ bảo hiểm</option>
                                <option>Chính sách lương thưởng</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full mt-3 bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium text-base transition-colors hover:bg-emerald-600 active:bg-emerald-700"
                        >
                            Hoàn thành
                        </button>
                    </form>
                </div>
            </div>

            {/* Illustration Section */}
            <div className="flex-shrink-0 w-96 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 flex items-center justify-center p-12">
                <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-sm">
                    <defs>
                        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4CAF50" />
                            <stop offset="50%" stopColor="#45A049" />
                            <stop offset="100%" stopColor="#2E7D32" />
                        </linearGradient>
                    </defs>

                    <rect width="400" height="400" fill="url(#bgGradient)" />

                    <ellipse cx="200" cy="380" rx="120" ry="15" fill="rgba(0,0,0,0.1)" />

                    <rect x="120" y="200" width="160" height="100" rx="8" fill="#66BB6A" opacity="0.8" />
                    <rect x="125" y="205" width="150" height="60" rx="4" fill="#81C784" />

                    <rect x="140" y="280" width="30" height="50" fill="#558B2F" rx="4" />
                    <rect x="230" y="280" width="30" height="50" fill="#558B2F" rx="4" />

                    <ellipse cx="95" cy="330" rx="25" ry="8" fill="rgba(0,0,0,0.1)" />
                    <ellipse cx="155" cy="330" rx="22" ry="7" fill="rgba(0,0,0,0.1)" />
                    <ellipse cx="245" cy="330" rx="22" ry="7" fill="rgba(0,0,0,0.1)" />
                    <ellipse cx="305" cy="330" rx="25" ry="8" fill="rgba(0,0,0,0.1)" />

                    <circle cx="95" cy="320" r="25" fill="#66BB6A" />
                    <path d="M 70 325 Q 70 340, 95 340 Q 120 340, 120 325" fill="#558B2F" />
                    <rect x="88" y="340" width="14" height="30" fill="#795548" rx="3" />
                    <rect x="70" y="367" width="50" height="10" fill="#5D4037" rx="5" />

                    <circle cx="155" cy="160" r="20" fill="#FFCCBC" />
                    <path d="M 145 175 L 165 175 L 165 210 L 145 210 Z" fill="white" />
                    <path d="M 142 185 L 125 205 L 130 210 L 145 195 Z" fill="white" />
                    <path d="M 168 185 L 185 205 L 180 210 L 165 195 Z" fill="white" />
                    <rect x="145" y="210" width="10" height="35" fill="#1976D2" rx="2" />
                    <rect x="155" y="210" width="10" height="35" fill="#1976D2" rx="2" />
                    <rect x="142" y="242" width="14" height="25" fill="#1565C0" rx="3" />
                    <rect x="154" y="242" width="14" height="25" fill="#1565C0" rx="3" />

                    <circle cx="245" cy="180" r="18" fill="#FFCCBC" />
                    <path d="M 236 195 L 254 195 L 254 225 L 236 225 Z" fill="white" />
                    <path d="M 233 200 L 218 215 L 222 220 L 236 210 Z" fill="white" />
                    <path d="M 257 200 L 272 215 L 268 220 L 254 210 Z" fill="white" />
                    <rect x="236" y="225" width="9" height="32" fill="#424242" rx="2" />
                    <rect x="245" y="225" width="9" height="32" fill="#424242" rx="2" />
                    <rect x="233" y="255" width="13" height="23" fill="#212121" rx="3" />
                    <rect x="244" y="255" width="13" height="23" fill="#212121" rx="3" />

                    <ellipse cx="320" cy="305" rx="18" ry="35" fill="#2E7D32" opacity="0.6" />
                    <path d="M 310 270 Q 305 250, 315 240 Q 325 245, 320 270 Z" fill="#43A047" />
                    <circle cx="318" cy="242" r="8" fill="#66BB6A" />
                </svg>
            </div>

            {/* Responsive: Stack on smaller screens */}
            <style>{`
        @media (max-width: 1024px) {
          .flex {
            flex-direction: column;
          }

          .flex-shrink-0 {
            flex-shrink: 1;
            width: 100%;
            min-height: 400px;
          }

          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    )
}

export default Post