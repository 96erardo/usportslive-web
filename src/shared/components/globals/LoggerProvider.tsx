import React, { useEffect } from 'react';
import Logger from 'js-logger';

function LoggerProvider (props: Props) {
  useEffect(() => {
    Logger.useDefaults({
      defaultLevel: Logger[props.level],
    });
  }, [props.level])

  return (
    <>
      {props.children}
    </>
  );
}

type Props = {
  children: React.ReactNode,
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'TRACE';
};

export default LoggerProvider;