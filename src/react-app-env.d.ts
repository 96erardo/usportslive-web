/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test',
    REACT_APP_API_SERVER: string,
    REACT_APP_OAUTH_GRANT: string,
    REACT_APP_OAUTH_CLIENT_ID: string,
    REACT_APP_OAUTH_REDIRECT_URL: string,
    REACT_APP_BASIC_AUTH_B64: string,
    REACT_APP_LOG_LEVEL: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'TRACE',
    REACT_APP_MEDIA_SERVER_HOST: string,
    REACT_APP_MEDIA_SERVER_PORT: string,
  }
}
