import React, { useEffect } from 'react';
import { useTypedSelector } from '../../shared/utils';
import { RouteComponentProps } from 'react-router';
import { useDispatch } from 'react-redux';
import { exchageCodeForToken } from '../../redux/actions/auth';
import { AppDispatch } from '../../shared/types';
import { } from '../../config/axios';
import qs from 'query-string';

const {
  REACT_APP_OAUTH_GRANT: grant,
  REACT_APP_OAUTH_CLIENT_ID: clientId,
  REACT_APP_OAUTH_REDIRECT_URL: redirectUri
} = process.env;

function AuthCallback (props: Props) {
  const isLoggedIn: boolean = useTypedSelector(state => state.auth.isLoggedIn);
  const dispatch: AppDispatch = useDispatch();
  const q = qs.parse(props.location.search);

  useEffect(() => {
    if (isLoggedIn) {
      props.history.replace('/');
    } else {

      if (!q.code || !q.state) {
        props.history.replace('/');
      }

      dispatch(exchageCodeForToken(q.code, grant as string, q.state, redirectUri as string, clientId as string))
        .then(() => console.log('authenticated'))
        .catch(() => console.log('error'));
    }
  }, [isLoggedIn, props.history, q, dispatch]);
  
  console.log('props', props);

  return <p>Loading...</p>
}

interface Props extends RouteComponentProps {}

export default AuthCallback;