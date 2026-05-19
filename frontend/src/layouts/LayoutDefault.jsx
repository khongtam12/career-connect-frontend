import React from 'react'
import Header from "../components/user/Header"
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../components/user/Footer'
import ChatWidget from '../components/user/ChatWidget'


// Danh sách các route không hiện Footer
const NO_FOOTER_ROUTES = ['/cv-builder', '/cv-dashboard', '/profile']

export default function LayoutDefault() {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const isPrintMode = searchParams.get('print') === '1'

    const showFooter = !isPrintMode && !NO_FOOTER_ROUTES.includes(location.pathname)
    return (
        <div className='overflow-x-hidden'>
            {!isPrintMode && <Header />}
            <div className='main'>
                <Outlet />
            </div>
            {showFooter && <Footer />}
            
            {/* Tích hợp ChatWidget AI */}
            {!isPrintMode && <ChatWidget />}
        </div>
    )
}
