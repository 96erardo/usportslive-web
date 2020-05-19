import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { RootState } from '../../config/redux/reducers';
import { signout } from '../../config/redux/actions/auth'
import { AppDispatch } from '../../types';

const {
  REACT_APP_API_SERVER: server,
  REACT_APP_OAUTH_GRANT: grant,
  REACT_APP_OAUTH_CLIENT_ID: clientId,
  REACT_APP_OAUTH_REDIRECT_URL: redirectUri,
} = process.env;

const redirect: string = encodeURIComponent(redirectUri ? redirectUri : '');
const url: string = `${server}/oauth/authenticate?client_id=${clientId}&grant_type=${grant}&redirect_uri=${redirect}&response_type=code`;

function AuthButton () {
  const isLoggedIn = useSelector<RootState>(state => state.auth.isLoggedIn);
  const dispatch: AppDispatch = useDispatch();

  const onClick = useCallback(() => {
    if (isLoggedIn) {
      dispatch(signout());
    } else {
      window.location.href = url;
    }
  }, [isLoggedIn, dispatch]);

  return (
    <Button
      color="primary"
      variant="outlined"
      onClick={onClick}
    >
        {isLoggedIn ? 'Cerrar Sesión' : 'Iniciar Sesión'}
    </Button>
  );
}

export default AuthButton;