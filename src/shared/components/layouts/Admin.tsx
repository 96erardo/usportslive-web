import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import ProtectedRoute from '../utilities/ProtectedRoute';
import AdminNavigation from './AdminNavigation';
import TopNavigation from './TopNavigation';
import { styled } from '@8base/boost';

// Pages
import { AdminDashboard } from '../../../modules/app/components/AdminDashboard';
import SportsView from '../../../modules/sport/components/admin/SportsView';
import TeamsView from '../../../modules/team/components/admin/TeamsView';
import TeamDetails from '../../../modules/team/components/admin/TeamDetails';
import CompetitionsView from '../../../modules/competition/components/admin/CompetitionsView';
import Competition from '../../../modules/competition/components/admin/Competition';
import UsersView from '../../../modules/user/components/admin/UsersView';
import { PageNotFound } from '../globals/PageNotFound';

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
            <ProtectedRoute 
              perform="admin-dashboard" 
              exact 
              path="/admin/dashboard"
              redirect="/admin/teams"
              component={AdminDashboard} 
            />
            <ProtectedRoute 
              perform="admin-sports" 
              exact 
              path="/admin/sports"
              redirect="/admin/teams"
              component={SportsView} 
            />
            <ProtectedRoute 
              perform="admin-teams" 
              exact 
              path="/admin/teams" 
              redirect="/admin/teams"
              component={TeamsView} 
            />
            <ProtectedRoute 
              perform="admin-team"
              exact 
              path="/admin/team/:id" 
              redirect="/admin/teams"
              component={TeamDetails} 
            />
            <ProtectedRoute 
              perform="admin-competitions"
              exact 
              path="/admin/competitions" 
              redirect="/admin/teams"
              component={CompetitionsView} 
            />
            <ProtectedRoute 
              perform="admin-page" 
              exact 
              path="/admin/competition/:id?" 
              redirect="/admin/teams"
              component={Competition} 
            />
            <ProtectedRoute 
              perform="admin-users"
              exact 
              path="/admin/users" 
              redirect="/admin/teams"
              component={UsersView} 
            />
            <Route component={PageNotFound} />
          </Switch>
        </Content>
      </Container>
    </>
  );
}

interface Props extends RouteComponentProps {};

export default Admin;