import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { } from '../../../shared/config/axios';
import { useAuthStore } from '../auth-store';
import qs from 'query-string';

const {
  REACT_APP_OAUTH_GRANT: grant,
  REACT_APP_OAUTH_CLIENT_ID: clientId,
  REACT_APP_OAUTH_REDIRECT_URL: redirectUri
} = process.env;

function AuthCallback (props: Props) {
  const isLoggedIn: boolean = useAuthStore(state => state.isLoggedIn);
  const authenticate = useAuthStore(state => state.authenticate);

  useEffect(() => {
    if (isLoggedIn) {
      props.history.replace('/');
    } else {
      const q = qs.parse(props.location.search);

      if (!q.code || !q.state) {
        props.history.replace('/');
      }

      authenticate(
        q.code, 
        grant as string, 
        q.state, 
        redirectUri as string, 
        clientId as string
      );
    }
  }, [isLoggedIn, authenticate, props]);
  
  return <p>Loading...</p>
}

interface Props extends RouteComponentProps {}

export default AuthCallback;