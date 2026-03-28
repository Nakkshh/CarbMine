import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../context/Firebase';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useFirebase();
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;