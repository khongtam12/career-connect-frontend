import React from 'react'
import Header from "../components/user/Header"
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../components/user/Footer'


// Danh sách các route không hiện Footer
const NO_FOOTER_ROUTES = ['/cv-builder', '/cv-dashboard']

export default function LayoutDefault() {
    const location = useLocation()
    const showFooter = !NO_FOOTER_ROUTES.includes(location.pathname)

    return (
        <div className='overflow-x-hidden'>
            <Header />
            <div className='main'>
                <Outlet />
            </div>
            {showFooter && <Footer />}
        </div>
    )
}
