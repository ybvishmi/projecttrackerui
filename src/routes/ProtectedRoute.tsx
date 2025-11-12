import { Navigate } from "react-router-dom";
import {JSX} from "react";

interface Props {
    children: JSX.Element;
    role?: string;
    userRole?: string;
}

const ProtectedRoute = ({ children, role, userRole }: Props) => {
    if (role && role !== userRole) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedRoute;
