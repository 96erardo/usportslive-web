import React from 'react';
import Can from './Can';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuthStore } from '../../../modules/auth/auth-store';

function ProtectedRoute ({ component, perform, ...rest}: Props) {
  const isLoggedIn: boolean = useAuthStore(state => state.isLoggedIn);
  const Component = component;

  return (
    <Route 
      {...rest}
      render={(routeProps) => isLoggedIn ? (
        <Can 
          perform={`${perform}:visit`}
          onYes={() => <Component {...routeProps}/>}
          onNo={() => <Redirect to={{
              pathname: '/',
            }}
          />}
        />
      ) : (
        <Redirect
          to={{
            pathname: '/',
            state: { from: routeProps.location }
          }}
        />
      )}
    />
  )
}

interface Props extends RouteProps {
  component: React.ComponentType<any>,
  perform: string,
} 

export default ProtectedRoute;