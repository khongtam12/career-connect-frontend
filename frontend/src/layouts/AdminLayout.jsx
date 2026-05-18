import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/admin/AdminHeader'
import AdminSidebar from '../components/admin/AdminSidebar'

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen min-h-screen overflow-hidden bg-slate-50">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main content */}
            <div className="flex flex-col flex-1 min-w-0 min-h-0">
                {/* Header */}
                <AdminHeader setSidebarOpen={setSidebarOpen} />

                {/* Content */}
                <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide">
                    <div className="w-full p-4 sm:p-5 lg:p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
