import React, { Children } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UserLayout = ({}) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Outlet />

    </div>
  );
};

export default UserLayout;
