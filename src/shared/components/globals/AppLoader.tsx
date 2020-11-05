import React from 'react';
import { Column, Heading as BoostHeading, Loader, styled, COLORS } from '@8base/boost';
import { useAppStore } from '../../../modules/app/app-store';
import logo from '../../assets/images/logo_uneg.png';
import errorEmoji from '../../assets/images/sad_error.png';

const selectLoading = (state: any) => state.loading;
const selectError = (state: any) => state.error;

const Display = styled(Column)`
  width: 100vw;
  height: 100vh;
  ${(props: { background: string }) => props.background && `background-color: ${props.background};`}
`;

const Heading = styled(BoostHeading)`
  ${(props: { color: string }) => `color: ${props.color};`}
`;

function AppLoader (props: Props) {
  const loading = useAppStore(selectLoading);
  const error = useAppStore(selectError);

  if (loading) {
    return (
      <Display gap="lg" alignItems="center" justifyContent="center">
        <img alt="App Logo" src={logo} width="75" height="75" />
        <Loader color="PRIMARY" size="sm" />
      </Display>
    );
  }
  
  if (error) {
    return (
      <Display gap="sm" alignItems="center" justifyContent="center" background={COLORS.BLACK}>
        <img alt="Error sad face" src={errorEmoji} width="100" height="100" />
        <Heading color="#fff" type="h1" weight="bold">
          Un error ha ocurrido en la plataforma
        </Heading>
        <Heading color="#fff" type="h3">
          Recarga la página para acceder nuevamente
        </Heading>
      </Display>
    );
  }

  return (
    <>
      {props.children}
    </>
  );
}

type Props = {
  children: React.ReactNode
};

export default AppLoader;