import { Navigate } from 'react-router-dom'
import { useUserStore } from '../stores/useUserStore'

const PrivateCandidateRouteRedirect = ({ children }) => {
    const { isAuthenticated, user } = useUserStore();

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (user?.role !== "CANDIDATE") return <Navigate to="/404" replace />;

    return children;
}

export default PrivateCandidateRouteRedirect