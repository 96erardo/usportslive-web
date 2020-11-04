import { Game } from "../types"

const rules: Rules = {
  Visitor: {
    static: [
      'dashboard-page:visit',
      'user:login',
      'user:signup',
    ],
  },
  Normal: {
    static: [
      'dashboard-page:visit',
      'user:authenticated'
    ]
  },
  Audiovisual: {
    static: [
      'admin-page:visit',
      'dashboard-page:visit',
      'user:authenticated'
    ],
    dynamic: {
      'game-player:actions': ({ game, status }: { game: Game, status: 'playing' | 'bench' }) => {
        return (
          (!game.isFinished && !game.isLive) ||
          (game.isLive && status === 'playing')
        );
      },
      'game-player:initial': ({ game }: { game: Game }) => {
        return !game.isFinished && !game.isLive;
      },
      'game-player:add': ({ game }: { game: Game }) => {
        return !game.isLive && !game.isFinished;
      },
      'game-player:substitute': ({ game }: { game: Game }) => {
        return game.isLive;
      },
      'game-point:create': ({ game, status }: { game: Game, status: 'playing' | 'bench' }) => {
        return (game.isLive && status === 'playing');
      },
      'game-point:update': ({ game }: { game: Game }) => {
        return game.isLive;
      },
      'game-point:delete': ({ game }: { game: Game }) => {
        return game.isLive;
      },
    }
  },
  Teacher: {
    static: [
      'admin-page:visit',
      'user:authenticated',
      'dashboard-page:visit',
    ],
    dynamic: {
      'game-player:actions': ({ game }: { game: Game }) => {
        return !game.isFinished;
      },
      'game-player:initial': ({ game }: { game: Game }) => {
        return !game.isFinished && !game.isLive;
      },
      'game-player:add': ({ game }: { game: Game }) => {
        return !game.isLive && !game.isFinished;
      },
      'game-player:substitute': ({ game }: { game: Game }) => {
        return game.isLive;
      },
      'game-point:update': ({ game }: { game: Game }) => {
        return game.isLive;
      },
      'game-point:delete': ({ game }: { game: Game }) => {
        return game.isLive;
      },
    }
  },
  Administrator: {
    static: [
      'user:authenticated',
      'admin-page:visit',
      'dashboard-page:visit',
      // Actions
      'game-player:actions',
      'game-player:add',
      'game-player:substitute',
      'game-point:create',
      'game-point:update',
      'game-point:delete',
    ],
    dynamic: {
      'game-player:initial': ({ game }: { game: Game }) => {
        return !game.isFinished && !game.isLive;
      },
    }
  }
};

export type Rules = {
  [key: string]: {
    static?: Array<string>,
    dynamic?: {
      [key: string]: (data: any) => boolean,
    }
  }
}

export default rules;