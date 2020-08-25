import React, { useCallback } from 'react';
import { Button } from '@8base/boost';
import { useAuthStore } from '../auth-store';

const {
  REACT_APP_API_SERVER: server,
  REACT_APP_OAUTH_GRANT: grant,
  REACT_APP_OAUTH_CLIENT_ID: clientId,
  REACT_APP_OAUTH_REDIRECT_URL: redirectUri,
} = process.env;

const redirect: string = encodeURIComponent(redirectUri ? redirectUri : '');
const url: string = `${server}/oauth/authenticate?client_id=${clientId}&grant_type=${grant}&redirect_uri=${redirect}&response_type=code`;

function AuthButton () {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const logout = useAuthStore(state => state.logout);

  const onClick = useCallback(() => {
    if (isLoggedIn) {
      logout();
    } else {
      window.location.href = url;
    }
  }, [logout, isLoggedIn]);

  return (
    <Button onClick={onClick}>
        {isLoggedIn ? 'Cerrar Sesión' : 'Iniciar Sesión'}
    </Button>
  );
}

export default AuthButton;