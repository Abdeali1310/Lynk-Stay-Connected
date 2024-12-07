/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectRouteProps {
  children?: ReactNode;
  user: any; 
  redirect?: string;
}

const ProtectRoute: React.FC<ProtectRouteProps> = ({ children, user, redirect = "login" }) => {
  if (!user) {
    return <Navigate to={redirect} />;
  }
  return children ? children : <Outlet />;
};

export default ProtectRoute;
