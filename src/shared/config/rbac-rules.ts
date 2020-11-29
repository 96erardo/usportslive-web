import { Game, User, Person, Comment } from "../types"

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
      'user:authenticated',
    ],
    dynamic: {
      'game-player:actions': ({ game }: { game: Game }) => {
        return game.isFinished;
      },
      'person:update': ({ user, person }: { user: User, person: Person }) => {
        return user.personId === person.id;
      },
      'comment:actions': ({ user, comment }: { user: User, comment: Comment }) => {
        return user.id === comment.userId || comment.parentId === null;
      },
      'comment:reply': ({ comment }: { comment: Comment }) => {
        return comment.parentId === null;
      },
      'comment:delete': ({ user, comment }: { user: User, comment: Comment }) => {
        return user.id === comment.userId;
      }
    }
  },
  Audiovisual: {
    static: [
      'admin-page:visit',
      'dashboard-page:visit',
      'user:authenticated'
    ],
    dynamic: {
      'game-player:actions': ({ game, status, participated }: { game: Game, status: 'playing' | 'bench', participated: boolean }) => {
        return (
          (game.isFinished && participated) || // Game has finished and the player participated
          (!game.isLive && !game.isFinished) || // Game has not started
          (game.isLive && status === 'playing') // Game is live and the player is not in the bench
        );
      },
      'game-player:lineup': ({ game }: { game: Game }) => {
        return !game.isFinished && !game.isLive;
      },
      'game-point:create': ({ game, status }: { game: Game, status: 'playing' | 'bench' }) => {
        return (game.isLive && status === 'playing');
      },
      'game-player:add': ({ game }: { game: Game }) => {
        return !game.isLive && !game.isFinished;
      },
      'game-player:remove': ({ game }: { game: Game }) => {
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
      'person:update': ({ user, person }: { user: User, person: Person }) => {
        return user.personId === person.id;
      },
      'comment:actions': ({ user, comment }: { user: User, comment: Comment }) => {
        return user.id === comment.userId || comment.parentId === null;
      },
      'comment:reply': ({ comment }: { comment: Comment }) => {
        return comment.parentId === null;
      },
      'comment:delete': ({ user, comment }: { user: User, comment: Comment }) => {
        return user.id === comment.userId;
      }
    }
  },
  Teacher: {
    static: [
      'admin-page:visit',
      'user:authenticated',
      'dashboard-page:visit',
    ],
    dynamic: {
      'game-player:actions': ({ game, status, participated }: { game: Game, status: 'playing' | 'bench', participated: boolean }) => {
        return (
          (game.isFinished && participated) || // Game has finished and the player participated
          (!game.isLive && !game.isFinished) || // Game has not started
          (game.isLive && status === 'playing') // Game is live and the player is not in the bench
        );
      },
      'game-player:lineup': ({ game }: { game: Game }) => {
        return !game.isFinished && !game.isLive;
      },
      'game-point:create': ({ game, status }: { game: Game, status: 'playing' | 'bench' }) => {
        return (game.isLive && status === 'playing');
      },
      'game-player:add': ({ game }: { game: Game }) => {
        return !game.isLive && !game.isFinished;
      },
      'game-player:remove': ({ game }: { game: Game }) => {
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
      'person:update': ({ user, person }: { user: User, person: Person }) => {
        return user.personId === person.id || person.userId === null;
      },
      'comment:actions': ({ user, comment }: { user: User, comment: Comment }) => {
        return user.id === comment.userId || comment.parentId === null;
      },
      'comment:reply': ({ comment }: { comment: Comment }) => {
        return comment.parentId === null;
      },
      'comment:delete': ({ user, comment }: { user: User, comment: Comment }) => {
        return user.id === comment.userId;
      }
    }
  },
  Administrator: {
    static: [
      'user:authenticated',
      'admin-page:visit',
      'dashboard-page:visit',
      // Actions
      'game-point:update',
      'game-point:delete',
      'comment:actions',
      'comment:delete'
    ],
    dynamic: {
      'game-player:actions': ({ game, status, participated }: { game: Game, status: 'playing' | 'bench', participated: boolean }) => {
        return (
          (game.isFinished && participated) || // Game has finished and the player participated
          (!game.isLive && !game.isFinished) || // Game has not started
          (game.isLive && status === 'playing') // Game is live and the player is not in the bench
        );
      },
      'game-player:add': ({ game }: { game: Game }) => {
        return !game.isLive && !game.isFinished;
      },
      'game-player:remove': ({ game }: { game: Game }) => {
        return !game.isLive && !game.isFinished;
      },
      'game-player:lineup': ({ game }: { game: Game }) => {
        return !game.isFinished && !game.isLive;
      },
      'game-player:substitute': ({ game }: { game: Game }) => {
        return game.isLive || game.isFinished;
      },
      'game-point:create': ({ game, status }: { game: Game, status: 'playing' | 'bench' }) => {
        return (
          (game.isLive && status === 'playing' ) || 
          game.isFinished
        );
      },
      'person:update': ({ user, person }: { user: User, person: Person }) => {
        return user.personId === person.id || person.userId === null;
      },
      'comment:reply': ({ comment }: { comment: Comment }) => {
        return comment.parentId === null;
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