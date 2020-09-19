import React from 'react';
import { RouteComponentProps, Switch } from 'react-router-dom';
import ProtectedRoute from '../utilities/ProtectedRoute';
import AdminNavigation from './AdminNavigation';
import TopNavigation from './TopNavigation';
import { styled } from '@8base/boost';

// Pages
import SportsView from '../../../modules/sport/components/admin/SportsView';
import TeamsView from '../../../modules/team/components/admin/TeamsView';
import TeamDetails from '../../../modules/team/components/admin/TeamDetails';
import CompetitionsView from '../../../modules/competition/components/admin/CompetitionsView';
import Competition from '../../../modules/competition/components/admin/Competition';
import UsersView from '../../../modules/user/components/admin/UsersView';

const Container = styled.div`
  display: flex;
`;

const Content = styled.div`
  width: 100%;
`;

function Admin (props: Props) {
  return (
    <>
      <TopNavigation />
      <Container>
        <AdminNavigation />
        <Content>
          <Switch>
            <ProtectedRoute perform="admin-page" exact path="/admin/sports" component={SportsView} />
            <ProtectedRoute perform="admin-page" exact path="/admin/teams" component={TeamsView} />
            <ProtectedRoute perform="admin-page" exact path="/admin/team/:id" component={TeamDetails} />
            <ProtectedRoute perform="admin-page" exact path="/admin/competitions" component={CompetitionsView} />
            <ProtectedRoute perform="admin-page" exact path="/admin/competition/:id?" component={Competition} />
            <ProtectedRoute perform="admin-page" exact path="/admin/users" component={UsersView} />
          </Switch>
        </Content>
      </Container>
    </>
  );
}

interface Props extends RouteComponentProps {};

export default Admin;