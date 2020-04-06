import React from 'react';

const {
  REACT_APP_API_SERVER: server,
  REACT_APP_OAUTH_GRANT: grant,
  REACT_APP_OAUTH_CLIENT_ID: clientId,
  REACT_APP_OAUTH_REDIRECT_URL: redirectUri,
} = process.env;

function LoginButton (props: Props) {
  const redirect: string = encodeURIComponent(redirectUri ? redirectUri : '');
  const url: string = `${server}/oauth/authenticate?client_id=${clientId}&grant_type=${grant}&redirect_uri=${redirect}&response_type=code`;

  return (
    <button>
      <a href={url}>
        {props.children}
      </a>
    </button>
  );
}

type Props = {
  children: React.ReactNode
};

export default LoginButton;