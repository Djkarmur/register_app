import React, { useState } from "react";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ element}) => {

  const token =  localStorage.getItem('token') || '';

  if (!token) {
    return <Navigate to="/register" />;
  }


  return element;
};

export default ProtectedRoute;
