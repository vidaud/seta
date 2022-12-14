import React from "react";
import { Navigate, Route } from "react-router-dom";
import {isLoggedIn} from './auth';

export const PrivateRoute = (props) => {
    
  const token = localStorage.getItem("access_token");
  return <>{isLoggedIn() ? <Route {...props} /> : <Navigate to="/login" />}</>;
};

export default PrivateRoute;