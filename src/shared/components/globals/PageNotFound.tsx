import React from 'react';
import { Column, Heading as BoostHeading, styled, COLORS } from '@8base/boost';
import notFound from '../../assets/images/not_found.png';

const Display = styled(Column)`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
  ${(props: { background: string }) => props.background && `background-color: ${props.background};`}
`;

const Heading = styled(BoostHeading)`
  ${(props: { color: string }) => `color: ${props.color};`}
`;

export const PageNotFound: React.FC = () => {
  return (
    <Display background={COLORS.BLACK} alignItems="center" justifyContent="center">
      <img alt="Resource not found" src={notFound} width="100" height="100" />
      <Heading type="h1" weight="bold" color="#fff">
        404
      </Heading>
      <Heading type="h3" color="#fff">
        La ruta a la que tratas de acceder no existe
      </Heading>
    </Display>
  );
}