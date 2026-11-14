import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { manager, loading } = useAuth();

    if (loading) {
        return <div className="p-6 text-slate-500">Loading...</div>;
    }

    if (!manager) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;