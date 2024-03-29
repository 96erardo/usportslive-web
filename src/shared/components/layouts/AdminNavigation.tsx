import React, { useCallback } from 'react';
import { Navigation as NavigationBoost, styled } from '@8base/boost';
import Can from '../utilities/Can';
import { useHistory } from 'react-router-dom';

const Navigation = styled(NavigationBoost)`
  height: calc(100vh - 52px);
  position: sticky;
  top: 52px;
  z-index: 10;
`;

function AdminNavigation () {
  const history = useHistory();

  const navigate = useCallback((to) => () => history.push(to), [history]);

  return (
    <Navigation color="GRAY_60" expandedWidth="400px">
      <Can
        perform="admin-dashboard:visit"
        onYes={() => (
          <NavigationBoost.Item 
            onClick={navigate('/admin/dashboard')}
            iconSize="sm" 
            icon="Home" 
            label="Dashboard" 
          />
        )}
      />
      <Can
        perform="admin-sports:visit"
        onYes={() => (
          <NavigationBoost.Item 
            onClick={navigate('/admin/sports')} 
            iconSize="md" 
            icon="WhiteSoccer" 
            label="Deportes" 
          />
        )}
      />
      <Can
        perform="admin-teams:visit"
        onYes={() => (
          <NavigationBoost.Item 
            onClick={navigate('/admin/teams')} 
            iconSize="sm" 
            icon="Group" 
            label="Equipos" 
          />
        )}
      />
      <Can
        perform="admin-competitions:visit"
        onYes={() => (
          <NavigationBoost.Item 
            onClick={navigate('/admin/competitions')} 
            iconSize="md" 
            icon="WhiteTrophy" 
            label="Torneos" 
          />
        )}
      />
      <Can
        perform="admin-users:visit"
        onYes={() => (
          <NavigationBoost.Item 
            onClick={navigate('/admin/users')} 
            iconSize="sm" 
            icon="WhiteProfile" 
            label="Usuarios" 
          />          
        )}
      />
      <NavigationBoost.Item 
        onClick={navigate('/')} 
        iconSize="sm" 
        icon="ChevronLeft" 
        label="Regresar a la Aplicación"  
      />
    </Navigation>
  );
}

export default AdminNavigation;