import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/admin/AdminHeader'
import AdminSidebar from '../components/admin/AdminSidebar'

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main content */}
            <div className="flex flex-col flex-1 min-w-0">
                {/* Header */}
                <AdminHeader setSidebarOpen={setSidebarOpen} />

                {/* Content */}
                <main className="flex-1 overflow-y-auto scrollbar-hide">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}