import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import { Footer } from './Footer';
import { styled } from '@8base/boost';

// Pages
import Home from '../../../modules/app/components/Home';
import GameView from '../../../modules/game/components/GameView';
import { PlayerView } from '../../../modules/player/components/PlayerView';
import { CompetitionView } from '../../../modules/competition/components/CompetitionView';
import { SearchView } from '../../../modules/app/components/SearchView';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  width: 100%;
  min-height: calc(100vh - 52px);
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
            <Route exact path="/profile/:id" component={PlayerView} />
            <Route exact path="/player/:id" component={PlayerView} />
            <Route exact path="/competition/:id" component={CompetitionView} />
            <Route exact path="/search" component={SearchView} />
          </Switch>
        </Content>
        <Footer />
      </Container>
    </>
  );
}

interface Props extends RouteComponentProps {};

export default Admin;