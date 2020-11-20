import React, { useEffect } from 'react';
import { Column, Heading as BoostHeading, Loader, styled, COLORS } from '@8base/boost';
import { useAppStore, Store } from '../../../modules/app/app-store';
import errorEmoji from '../../assets/images/sad_error.png';
import { APP_LOGO, APP_TITLE } from '../../constants';

const selectLoading = (state: Store) => state.loading;
const selectLogo = (state: Store) => state.settings[APP_LOGO];
const selectError = (state: Store) => state.error;
const selectTitle = (state: Store) => state.settings[APP_TITLE];

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
  const logo = useAppStore(selectLogo);
  const title = useAppStore(selectTitle);

  useEffect(() => {
    if (!loading) {
      if (title) {
        document.title = title.value;
      }
    } else {
      document.title = 'Cargando...';
    }
  }, [loading, title]);

  if (loading) {
    return (
      <Display gap="lg" alignItems="center" justifyContent="center">
        {logo && 
          <img alt="App Logo" src={logo.value} width="75" height="75" />
        }
        <Loader color="PRIMARY" size="sm" />
      </Display>
    );
  }
  
  if (error) {
    return (
      <Display gap="sm" alignItems="center" justifyContent="center" background={COLORS.GRAY_70}>
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