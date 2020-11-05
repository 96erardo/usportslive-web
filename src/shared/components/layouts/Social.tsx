import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import { styled } from '@8base/boost';

// Pages
import Home from '../../../modules/app/components/Home';
import GameView from '../../../modules/game/components/GameView';
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
        <Content>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/game/:id" component={GameView} />
            <Route component={PageNotFound} />
          </Switch>
        </Content>
      </Container>
    </>
  );
}

interface Props extends RouteComponentProps {};

export default Admin;