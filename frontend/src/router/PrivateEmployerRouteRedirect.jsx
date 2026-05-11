import { Navigate } from 'react-router-dom'
import { useUserStore } from '../stores/useUserStore'

const PrivateEmployerRouteRedirect = ({ children }) => {
    const { isAuthenticated, user } = useUserStore();

    // Chưa login -> về trang login employer
    if (!isAuthenticated) {
        return <Navigate to="/employer/login" replace />
    }

    // Sai role
    if (user?.role !== "EMPLOYER") {
        return <Navigate to="/404" replace />
    }

    return children;
}

export default PrivateEmployerRouteRedirect