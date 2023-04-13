import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import { StyledCircularProgress } from 'components/StyledComponents';

export const PrivateRoute = () => {
  const { isAuth } = useAuth();

  if (isAuth === null) return <StyledCircularProgress color="primary" />;

  if (isAuth) return <Outlet />;

  return <Navigate to="/" replace />;
};
