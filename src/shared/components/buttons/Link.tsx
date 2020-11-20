import React, { useCallback } from 'react';
import { Button } from '@8base/boost';
import { useHistory } from 'react-router-dom';

export default function ButtonLink ({ to, children, ...rest }: Props) {
  const history = useHistory();

  const handleClick = useCallback(() => {
    history.push(to);
  }, [history, to]);

  return (
    <Button {...rest} onClick={handleClick}>
      {children}
    </Button>
  );
}

type Props = {
  to: string,
  children: React.ReactNode,
  color?: string,
  variant?: string,
};