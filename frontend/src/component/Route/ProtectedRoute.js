import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuth, loading, user, children }) => {
  if (!loading) {
    if (!isAuth) {
      return <Navigate to="/login" replace />;
    } else if (user != null) {
      if (user.role !== "admin") {
        return <Navigate to="/" replace />;
      } else {
        return children;
      }
    } else {
      return children;
    }
  }
};

export default ProtectedRoute;
