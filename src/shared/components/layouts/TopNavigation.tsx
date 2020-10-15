import React, { useCallback } from 'react';
import { TopBar as TopBarBoost, Row, Avatar, styled } from '@8base/boost';
import logo from '../../assets/images/logo_uneg.png';
import { useAuthStore } from '../../../modules/auth/auth-store';
import { useHistory } from 'react-router-dom';

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

const Profile = styled.div`
  padding: 0px 8px;
`;

function TopNavigation () {
  const history = useHistory();
  const user = useAuthStore(state => state.user);

  const onBrandClick = useCallback(() => {
    history.push('/');
  }, [history]);

  return (
    <TopBar color="WHITE">
      <Row stretch alignItems="center" justifyContent="between">
        <Brand onClick={onBrandClick}>
          <img src={logo} alt="Logo" style={{ height: '100%' }} />
        </Brand>
        <Profile>
          <Avatar
            size="sm"
            src={user?.person.avatar?.smallUrl}
            firstName={user?.person.name}
            lastName={user?.person.lastname}
          />
        </Profile>
      </Row>
    </TopBar>
  );
}

export default TopNavigation;