import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useTypedSelector } from '../../utils';

function VisitorsRoute ({ component, ...rest}: Props) {
  const isLoggedIn: boolean = useTypedSelector(state => state.auth.isLoggedIn);
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