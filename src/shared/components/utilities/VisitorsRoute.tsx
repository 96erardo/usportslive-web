import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuthStore } from '../../../modules/auth/auth-store';

function VisitorsRoute ({ component, ...rest}: Props) {
  const isLoggedIn: boolean = useAuthStore(state => state.isLoggedIn);
  const Component = component;

  return (
    <Route 
      {...rest}
      render={(routeProps) => isLoggedIn ? (
        <Redirect to="/" />
      ) : (
        <Component {...routeProps} />
      )}
    />
  );
}

interface Props extends RouteProps {
  component: React.ComponentType<any>
}

export default VisitorsRoute; 