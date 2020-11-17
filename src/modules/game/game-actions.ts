import { authenticated, request } from '../../shared/config/axios';
import axios, { CancelTokenSource, AxiosResponse, } from 'axios';
import { 
  QueryResult, 
  PaginatedResponse, 
  Game, 
  Person as Player, 
  MutationResult, 
  Participation, 
  PersonPlaysGame, 
  Point,
  Likes
} from '../../shared/types';
import Logger from 'js-logger';
import qs from 'qs';
import { useAppStore } from '../app/app-store';
import { useAuthStore } from '../auth/auth-store';

/**
 * Fetches a games list
 * 
 * @param {number} page - The page to fetch the items from
 * @param {Array<string>} include - The relations to include in each game
 * @param {object} data - The data to create the filters from
 * @param {CancelTokenSource} source - The cancel token to cancel de request if needed
 * 
 * @return {Promise<QueryResult<PaginatedResponse<Game>>>} The list of games
 */
export async function fetchGames (
  page: number = 1,
  include: Array<string> = [],
  data: FilterData = {},
  source?: CancelTokenSource,
  orderBy?: string,
): Promise<QueryResult<PaginatedResponse<Game>>> {
  
  const { accessToken } = useAppStore.getState();
  const first = page !== 0 ? 10 : undefined;
  const skip = (page !== 0 && first) ? (first * (page - 1)) : undefined;
  const filters = createFilter(data);
  
  const query = qs.stringify({
    first,
    skip,
    include,
    filters,
    orderBy
  }, { encode: false, arrayFormat: 'brackets' })
  
  try {
    const res: AxiosResponse<PaginatedResponse<Game>> = await request.get(`/api/games?${query}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchGames', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.error('fetchGames (Canceled)', e);

      return [e, true];
    }

    Logger.error('fetchGames', e);

    return [e];
  }
}

function createFilter (data: FilterData) {
  return {
    ...(data.competition ? {
      competitionId: { eq: data.competition }
    } : {}),
    ...(data.isAfter || data.isBefore ? {
      date: { 
        ...(data.isAfter ? { gte: data.isAfter } : {}),
        ...(data.isBefore ? { lte: data.isBefore } : {}),
      },
    } : {}),
    ...(typeof data.isLive === 'boolean' ? {
      isLive: { eq: data.isLive }
    } : {}),
    ...(data.local ? {
      localId: data.local
    } : {}),
    ...(data.visitor ? {
      visitorId: data.visitor
    } : {}),
    ...(data.sport ? {
      competition: { sportId: { eq: data.sport} }
    } : {})
  }
}

export type FilterData = {
  competition?: number | string,
  sport?: number,
  isAfter?: string,
  isBefore?: string,
  isLive?: boolean,
  local?: {
    ne?: number | null,
    eq?: number | null,
  },
  visitor?: {
    ne?: number | null,
    eq?: number | null,
  }
}

/**
 * 
 * @param {number} id - The id of the game to fetch
 * @param {Array<string>} include - The relations to include with the game
 * @param {CancelTokenSource} source - The token to cancel the request if needed
 */
export async function fetchGame (
  id: number, 
  include: Array<string> = [],
  source?: CancelTokenSource
): Promise<QueryResult<{ game: Game | null }>> {

  const { accessToken } = useAppStore.getState();
  const query = qs.stringify({ include });

  try {
    const res: AxiosResponse<{ game: Game | null }> = await request.get(`/api/games/${id}?${query}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchGame', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.error('fetchGames (Canceled)', e);

      return [e, true];
    }

    Logger.error('fetchGames', e);

    return [e];
  }
}

/**
 * Fetches all the game events
 * 
 * @param {string} id - The game id
 * @param {CancelTokenSource} source - The cancel token
 * 
 * @returns {Promise} - The request result
 */
export async function fetchGameEvents (
  id: number,
  source?: CancelTokenSource
): Promise<QueryResult<PaginatedResponse<Point | PersonPlaysGame>>> {
  const { accessToken } = useAppStore.getState();

  try {
    const res: AxiosResponse<PaginatedResponse<Point | PersonPlaysGame>> = await request.get(`/api/games/${id}/events`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cancelToken: source ? source.token : undefined,
    });

    Logger.info('fetchGameEvents', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.error('fetchGames (Canceled)', e);

      return [e, true];
    }

    Logger.error('fetchGames', e);

    return [e];
  }
}

/**
 * Creates a new game object
 * 
 * @param {CreateGameInput} data - The data needed to create the gmae
 * 
 * @returns {Promise<MutationResult<Game>>} The request result
 */
export async function createGame (data: CreateGameInput): Promise<MutationResult<Game>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<Game> = await authenticated.post('/api/games', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('createGame', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('createGame', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

export type CreateGameInput = {
  date: string,
  competitionId: number | string,
  localId?: number | null,
  visitorId?: number | null,
}

/**
 * Updates the specified game registry
 * 
 * @param {UpdateGameInput} data - Data needed to update a game object
 * 
 * @returns {Promise<MutationResult<Game>>} - The updated game
 */
export async function updateGame (data: UpdateGameInput): Promise<MutationResult<Game>> {
  const { accessToken } = useAuthStore.getState();
  const { id, ...rest } = data;

  try {
    const res: AxiosResponse<Game> = await authenticated.patch(`/api/games/${id}`, {
      ...rest
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    Logger.info('updateGame', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('updateSport', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

type UpdateGameInput = {
  id: number,
  date?: string,
  competitionId: number,
  localId?: number | null,
  visitorId?: number | null,
}

/**
 * Deletes the specified game
 * 
 * @param {number} id - The id of the game to delete
 * 
 * @returns {Promise<MutationResult<{ success: boolean }>>} The request result
 */
export async function deleteGame (id: number): Promise<MutationResult<{ success: boolean }>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<{ success: boolean }> = await authenticated.delete(`/api/games/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('deleteGame', res.data);

    return [null, { success: true }]

  } catch (e) {
    Logger.error('updateSport', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

/**
 * Adds a player to a game
 * 
 * @param {number} playerId - The player id
 * @param {number} gameId - The game id
 * @param {number} teamId - The team id
 * 
 * @returns {Promise<MutationResult<Participation>>} The request result
 */
export async function addPlayerToGame (
  playerId: number,
  gameId: number,
  teamId: number,
): Promise<MutationResult<Participation>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<Participation> = await authenticated.post(
      `/api/games/${gameId}/team/${teamId}/player/${playerId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    Logger.info('addPlayerToGame', res.data);
    
    return [null, res.data];

  } catch (e) {
    Logger.error('addPlayerToGame', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

/**
 * Removes a player from a game
 * 
 * @param {number} player - The player id
 * @param {number} team - The team id
 * @param {number} game - The game id
 * 
 * @returns {Promise<MutationResult<Participation>>} - The request result
 */
export async function removePlayerFromGame (
  player: number,
  team: number,
  game: number,
): Promise<MutationResult<Participation>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<Participation> = await authenticated.delete(`/api/games/${game}/team/${team}/player/${player}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('removePlayerFromGame', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('removePlayerFromGame', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

/**
 * Fetches the team players in a game
 * 
 * @param {number} gameId - The game id
 * @param {number} teamId - The team id
 * 
 * @returns {Promise<QueryResult<Player>>} The players in the game
 */
export async function fetchPlayersInGame (
  gameId: number, 
  teamId: number,
  type: 'playing' | 'bench' | '' = '',
  source?: CancelTokenSource
): Promise<QueryResult<PaginatedResponse<Player>>> {

  const { accessToken } = useAppStore.getState();
  const query = qs.stringify({ type }, { encode: false, arrayFormat: 'brackets' })

  try {
    const res: AxiosResponse<PaginatedResponse<Player>> = await request.get(`/api/games/${gameId}/team/${teamId}?${query}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cancelToken: source ? source.token : undefined
    });

    Logger.info(`fetchPlayersInGame [${type}]`, res.data);

    return [null, false, res.data];

  } catch (e) { 

    if (axios.isCancel(e)) {
      Logger.error(`fetchPlayersInGame [${type}] (Canceled)`, e);

      return [e, true];
    }

    Logger.error(`fetchPlayersInGame [${type}]`, e);

    return [e];
  }
};

/**
 * Performs substitution in a game
 * 
 * @param {SubstituteData} data - The data needed to perform the substitution
 * 
 * @returns {Promise<MutationResult<void>>} The request result
 */
export async function performSubstitution (data: SubstituteData): Promise<MutationResult<void>> {
  const { accessToken } = useAuthStore.getState();

  try {

    const { gameId, teamId, ...rest } = data;

    const res: AxiosResponse<void> = await authenticated.post(`/api/games/${gameId}/team/${teamId}/substitution`, rest, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    Logger.info('performSubstitution', res.data);

    return [null];

  } catch (e) {
    Logger.error('performSubstitution', e);

    if (e.response) {
      return [e.response.data];
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

export type SubstituteData = {
  gameId: number,
  teamId: number,
  in: number,
  out: number,
  minute: number,
}

/**
 * Updates the specified substitution minute
 * 
 * @param {UpdateSubMinuteData} data - The data needed to update the substitution minute
 * 
 * @returns {Promise<MutationResult<PersonPlaysGame>>} The request result
 */
export async function updateSubstitutionMinute (data: UpdateSubMinuteData): Promise<MutationResult<PersonPlaysGame>> {
  const { accessToken } = useAuthStore.getState();
  const { game, team, player, minute, type } = data;

  try {
    const res: AxiosResponse<PersonPlaysGame> = await authenticated.patch(
      `/api/games/${game}/team/${team}/player/${player}/substitution`,
      {
        [type]: minute,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    Logger.info('updateSubstitutionMinute', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('performSubstitution', e);

    if (e.response) {
      return [e.response.data];
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

export type UpdateSubMinuteData ={
  game: number,
  team: number,
  player: number,
  minute: number,
  type: 'inMinute' | 'outMinute'
}

/**
 * Fetches a game playlist to see if is available for  streaming
 * 
 * @param {string} streamKey - The game stream key
 * 
 * @returns {Promise<QueryResult<void>>} The request result
 */
export async function fetchGamePlaylist (streamKey: string): Promise<QueryResult<void>> {
  try {
    const res: AxiosResponse<void> = await axios.get(
      `${process.env.REACT_APP_MEDIA_SERVER_HOST}/${streamKey}.m3u8`,
    );

    Logger.info('fetchGamePlaylist', res.data);

    return [null, false, res.data];

  } catch (e) {
    Logger.error('fetchGamePlaylist', e);

    return [e, false];
  }
}

/**
 * Fetches a game thumbnail to see if is available for streaming
 * 
 * @param {string} streamkey - The game stream key
 * 
 * @returns {Promise<QueryResult<void>>} The request result
 */
export async function fetchGameThumbnail (streamkey: string): Promise<QueryResult<void>> {
  try {
    const res: AxiosResponse<void> = await axios.get(
      `${process.env.REACT_APP_MEDIA_SERVER_HOST}/${streamkey}.m3u8`
    );

    Logger.info('fetchGameThumbnail', res.data);

    return [null, false, res.data];

  } catch (e) {
    Logger.error('fetchGameThumbnail', e);

    return [e, false];
  }
}

/**
 * Fetches games from the specified player
 * 
 * @param {number} player - The player id
 * @param {number} page - The page id
 * @param {CancelTokenSource} source - The cancel token source
 * 
 * @returns {Promise<QueryResult<PaginatedResponse<Game>>>} The request result
 */
export async function fetchPlayerGames (
  player: number, 
  page: number = 1, 
  source?: CancelTokenSource
): Promise<QueryResult<PaginatedResponse<Game>>> {
  const { accessToken } = useAppStore.getState();

  const first = 10;
  const skip = first * (page - 1);
  const orderBy = 'date_DESC';

  const query = qs.stringify({
    first,
    skip,
    orderBy,
    include: ['local', 'visitor', 'local.logo', 'visitor.logo'],
    filters: { players: { id: { eq: player } }, isFinished: { eq: true } },
  }, { encode: false, arrayFormat: 'brackets' })

  try {
    const res: AxiosResponse<PaginatedResponse<Game>> = await request.get(`/api/games?${query}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cancelToken: source ? source.token : undefined,
    });

    Logger.info('fetchPlayerGames', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.error('fetchPlayerGames (Canceled)', e);

      return [e, true];
    }

    Logger.error('fetchPlayerGames', e);

    return [e];
  }
}

/**
 * Fetches the likes count in a game and if the currently authenticated user liked
 * 
 * @param {number} game - The game id
 * @param {CancelTokenSource} source - The token source to cancel the request if needed
 * 
 * @returns {Promise<QueryResult<Likes>>} The request result
 */
export async function fetchGameLikes (
  game: number,
  source?: CancelTokenSource
): Promise<QueryResult<Likes>> {
  const { accessToken: userAccessToken } = useAuthStore.getState();
  const { accessToken: clientAccessToken } = useAppStore.getState();

  try {
    const res: AxiosResponse<Likes> = await request.get(`/api/games/${game}/likes`, {
      headers: {
        Authorization: `Bearer ${userAccessToken || clientAccessToken}`
      },
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchGamesLikes', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.error('fetchGameLikes (Canceled)', e);

      return [e, true];
    }

    Logger.error('fetchGameLikes', e);

    return [e];
  }
};

/**
 * Marks the specified game as liked by the user who triggered the event
 * 
 * @param {number} game - The game id
 * 
 * @returns {Promise<MutationResult<Likes>>} The current likes count
 */
export async function likeGame (game: number): Promise<MutationResult<Likes>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<Likes> = await authenticated.post(`/api/games/${game}/like`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('likeGame', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('likeGame', e);

    if (e.response) {
      return [e.response.data];
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

/**
 * Removes the like given by the authenticated user from the specified game
 * 
 * @param {number} game - The game id
 * 
 * @returns {Promise<MutationResult<Likes>>} The current likes count
 */
export async function dislikeGame (game: number): Promise<MutationResult<Likes>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<Likes> = await authenticated.delete(`/api/games/${game}/like`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('dislikeGame', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('dislikeGame', e);

    if (e.response) {
      return [e.response.data];
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}