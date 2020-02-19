import React, { useEffect }  from 'react';

function Home (props: any) {
  useEffect((): void => {
    console.log('params', props.params);
  }, [props.params]);

  const {
    REACT_APP_API_SERVER: server,
    REACT_APP_OAUTH_GRANT: grant,
    REACT_APP_OAUTH_CLIENT_ID: clientId,
    REACT_APP_OAUTH_REDIRECT_URL: redirectUri,
  } = process.env;

  const redirect: string = encodeURIComponent(redirectUri ? redirectUri : '');
  const url: string = `${server}/oauth/authenticate?client_id=${clientId}&grant_type=${grant}&redirect_uri=${redirect}&response_type=code`;
  
  return (
    <div>
      <a href={url}>
        Login
      </a>
    </div>
  );
}

export default Home;