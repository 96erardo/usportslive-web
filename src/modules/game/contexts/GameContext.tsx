import React, { createContext } from 'react';
import { Game } from '../../../shared/types';

export const GameContext = createContext<Game | null>(null);

export class GameProvider extends React.Component<Props> {  
  render () {
    return (
      <GameContext.Provider value={this.props.game}>
        {this.props.children}
      </GameContext.Provider>
    );
  }
}

type Props = {
  children: React.ReactNode
  game: Game,
}