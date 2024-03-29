import React, { useCallback } from 'react';
import { TopBar as TopBarBoost, Button, Menu, Tag, Row, Grid, Dropdown, Text, styled, useModal } from '@8base/boost';
import { Avatar } from '../globals';
import { SearchBar } from '../form/SearchBar';
import Can from '../utilities/Can';
import { useAuthStore } from '../../../modules/auth/auth-store';
import { useHistory } from 'react-router-dom';
import AuthButton from '../../../modules/auth/components/AuthButton';
import { modalId } from '../../../modules/user/components/SigninDialog';
import { APP_LOGO } from '../../constants';
import { useAppStore } from '../../../modules/app/app-store';

const TopBar = styled(TopBarBoost)`
  padding: 8px 0px;
  position: sticky;
  top: 0px;
  z-index: 20;
`;

const Brand = styled.div`
  width: 60px;
  height: 36px;
  padding: 0px 8px;
  cursor: pointer;
`;

const colors = {
  'Normal': { color: 'BLUE_40', label: 'Usuario' },
  'Audiovisual': { color: 'MAGENTA_10', label: 'Audiovisual' },
  'Teacher': { color: 'PRIMARY', label: 'Profesor' },
  'Administrator': { color: 'PURPLE_40', label: 'Administrador' },
}

function TopNavigation () {
  const history = useHistory();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const logo = useAppStore(state => state.settings[APP_LOGO]);
  const { openModal } = useModal(modalId);

  const toProfile = useCallback(() => {
    if (user) {
      history.push(`/profile/${user.person.id}`)
    }
  }, [history, user]);
  
  const toAdmin = useCallback(() => {
      history.push(`/admin/dashboard`)
  }, [history]);

  const onBrandClick = useCallback(() => {
    history.push('/');
  }, [history]);

  const signin = useCallback(() => openModal(modalId), [openModal]);

  return (
    <TopBar color="WHITE">
      <Row stretch alignItems="center" justifyContent="between">
        <Brand onClick={onBrandClick}>
          <img src={logo.value} alt="Logo" style={{ height: '100%' }} />
        </Brand>
        <SearchBar />
        <Row className="pr-4" alignItems="center" gap="lg">
          <Can 
            perform="user:authenticated"
            onYes={() => (
              <Dropdown defaultOpen={false}>
                <Dropdown.Head>
                  <Avatar
                    size="sm"
                    src={user?.person.avatar?.smallUrl}
                    firstName={user?.person.name}
                    lastName={user?.person.lastname}
                  />
                </Dropdown.Head>
                <Dropdown.Body width={275} background="white" pin="right" closeOnClickOutside>
                  <Grid.Layout 
                    className="p-4 border-bottom"
                    columns="auto"
                    areas={[
                      ['avatar', 'name'],
                      ['avatar', 'role']
                    ]}
                  >
                    <Grid.Box area="avatar">
                      <Avatar
                        size="md"
                        src={user?.person.avatar?.mediumUrl}
                        firstName={user?.person.name}
                        lastName={user?.person.lastname}
                      />
                    </Grid.Box>
                    <Grid.Box className="ml-4" area="name" direction="row" justifyContent="center">
                      <Text text={`${user?.person.name} ${user?.person.lastname}`} />
                    </Grid.Box>
                    <Grid.Box className="ml-4" area="role" direction="row" justifyContent="center">
                      <Tag color={colors[(user && user.role) ? user.role.name : 'Normal'].color}>
                        {colors[(user && user.role) ? user.role.name : 'Normal'].label}
                      </Tag>
                    </Grid.Box>
                  </Grid.Layout>
                  <Menu>
                    <Menu.Item onClick={toProfile}>
                      Perfil
                    </Menu.Item>
                    <Can 
                      perform="admin-page:visit"
                      onYes={() => (
                        <Menu.Item onClick={toAdmin}>
                          Administrar
                        </Menu.Item>
                      )}
                    />
                    <Menu.Item onClick={logout}>
                      Cerrar Sesión
                    </Menu.Item>
                  </Menu>
                </Dropdown.Body>
              </Dropdown>
            )}
            onNo={() => (
              <>
                <Button size="sm" color="primary" onClick={signin}>
                  Registrate
                </Button>
                <AuthButton size="sm" variant="link" />
              </>
            )}
          />
        </Row>
      </Row>
    </TopBar>
  );
}

export default TopNavigation;