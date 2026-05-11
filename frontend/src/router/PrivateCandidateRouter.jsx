import { Navigate } from 'react-router-dom'
import { useUserStore } from '../stores/useUserStore'
import { useEffect } from 'react'

const PrivateCandidateRoute = ({ children }) => {
    const { isAuthenticated, openAuthDialog, user } = useUserStore();

    useEffect(() => {
        if (!isAuthenticated) {
            openAuthDialog({ closable: false }); // bắt buộc login, không cho đóng
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) return null; // Không redirect, modal sẽ hiện

    if (user?.role !== "CANDIDATE") return <Navigate to="/404" replace />;

    return children;
}

export default PrivateCandidateRoute