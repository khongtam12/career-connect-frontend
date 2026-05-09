import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const RoleRedirect = () => {
    const { isAuthenticated, user, loading } = useUserStore();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    switch (user?.role) {
        case "ADMIN":
            return <Navigate to="/admin" replace />;

        case "EMPLOYER":
            return <Navigate to="/employer" replace />;

        case "CANDIDATE":
            return <Navigate to="/" replace />;

        default:
            return <Navigate to="/404" replace />;
    }
};

export default RoleRedirect;