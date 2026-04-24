import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import RecruiterHeader from '../components/employer/RecruiterHeader'
import RecruiterSidebar from '../components/employer/RecruiterSidebar'

export default function EmployerLayout() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const hideSidebarPaths = ['/employer', '/employer/pricing', '/employer/promotions', '/employer/payment'];
    const noPaddingPaths = ['/employer', '/employer/pricing', '/employer/promotions', '/employer/candidates'];
    const shouldHideSidebar = hideSidebarPaths.includes(location.pathname);
    const shouldRemovePadding = noPaddingPaths.includes(location.pathname);

    return (
        <div className="flex h-screen overflow-hidden">
            {!shouldHideSidebar && <RecruiterSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />}
            <div className="flex flex-col flex-1 min-w-0">
                <RecruiterHeader setSidebarOpen={setSidebarOpen} />
                <main className={`flex-1 overflow-y-auto bg-gray-100 ${shouldRemovePadding ? '' : 'p-4'}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}