import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from './auth'; // Adjust import as needed

const PrivateRoute = ({ element, cPublic }) => {
    const loggedIn = isLoggedIn();
    
    if (cPublic) {
        return loggedIn ? <Navigate to="/dashboard" /> : element;
    } else {
        return loggedIn ? element : <Navigate to="/login" />;
    }
};

export default PrivateRoute;