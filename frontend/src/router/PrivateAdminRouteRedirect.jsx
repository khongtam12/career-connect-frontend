import { Navigate } from 'react-router-dom'
import { useUserStore } from '../stores/useUserStore'

const PrivateAdminRouteRedirect = ({ children }) => {
    const { isAuthenticated, user } = useUserStore();

    // Chưa login -> về login admin
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />
    }

    // Sai role
    if (user?.role !== "ADMIN") {
        return <Navigate to="/404" replace />
    }

    return children;
}

export default PrivateAdminRouteRedirect