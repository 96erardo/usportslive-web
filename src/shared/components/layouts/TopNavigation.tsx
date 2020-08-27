import React from 'react';
import { TopBar as TopBarBoost, Row, Avatar, styled } from '@8base/boost';
import logo from '../../assets/images/logo_uneg.png';
import { useAuthStore } from '../../../modules/auth/auth-store';

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
`;

const Profile = styled.div`
  padding: 0px 8px;
`;

function TopNavigation () {
  const user = useAuthStore(state => state.user);

  return (
    <TopBar color="WHITE">
      <Row stretch alignItems="center" justifyContent="between">
        <Brand>
          <img src={logo} alt="Logo" style={{ height: '100%' }} />
        </Brand>
        <Profile>
          <Avatar
            size="sm"
            firstName={user?.person.name}
            lastName={user?.person.lastname}
          />
        </Profile>
      </Row>
    </TopBar>
  );
}

export default TopNavigation;