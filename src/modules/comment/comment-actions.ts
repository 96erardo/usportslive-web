import axios, { AxiosResponse, CancelTokenSource } from 'axios';
import { request, authenticated } from '../../shared/config/axios';
import { useAppStore } from '../app/app-store';
import qs from 'qs';
import { PaginatedResponse, QueryResult, Comment, MutationResult } from '../../shared/types';
import Logger from 'js-logger';
import { useAuthStore } from '../auth/auth-store';

/**
 * Fetches comments
 * 
 * @param {number} page - The page to fetch the comments
 * @param {string} orderBy - The order way to present results
 * @param {Array<string>} include - The relations to include with every item
 * @param {FetchCommentsFilterData} data - Data to create a filter
 * @param {CancelTokenSource} source - The cancel token source
 * 
 * @returns {Promise<QueryResult<PaginatedResponse<Comment>>>} The request result
 */
export async function fetchComments (
  page: number = 1, 
  orderBy: string = 'createdAt_DESC',
  include: Array<string> = [],
  data: FetchCommentsFilterData = {},
  source?: CancelTokenSource
): Promise<QueryResult<PaginatedResponse<Comment>>> {
  const { accessToken } = useAppStore.getState();
  const first = 10;
  const skip = first * (page - 1);
  const filters = createFilter(data);

  const query = qs.stringify({ first, skip, include, filters, orderBy }, { encode: false, arrayFormat: 'brackets' });

  try {
    const res: AxiosResponse = await request.get(`/api/comments?${query}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cancelToken: source ? source.token : undefined
    });

    Logger.info('fetchComments', res.data);

    return [null, false, res.data];

  } catch (e) {
    if (axios.isCancel(e)) {
      Logger.error('fetchComments (Canceled)', e);

      return [e, true];
    }

    Logger.error('fetchComments', e);

    return [e];
  }
}

function createFilter (data: FetchCommentsFilterData) {
  return {
    ...(data.game ? { 
      gameId: { 
        eq: data.game 
      } 
    } : {}),
    ...(data.parent !== undefined ? {
      parentId: { 
        eq: data.parent === null ? '_null_' : data.parent
      } 
    } : {}),

  };
}

export type FetchCommentsFilterData = {
  game?: number,
  parent?: number | null,
}

/**
 * Creates a new comment
 * 
 * @param {CreateCommentInputData} data - The data to create the comment
 * 
 * @returns {Promise<MutationResult<Comment>>} The request result
 */
export async function createComment (data: CreateCommentInputData): Promise<MutationResult<Comment>> {
  const { accessToken } = useAuthStore.getState();
  const { game, ...comment } = data;

  try {
    const res: AxiosResponse<Comment> = await authenticated.post(`/api/comments/game/${data.game}`, {
      content: comment.content,
      parentId: comment.parent
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('createComment', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('createComment', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}

type CreateCommentInputData = {
  game: number,
  content: string,
  parent?: number,
}

/**
 * Deletes the specified comment
 * 
 * @param {number} id - The comment id
 * 
 * @returns {Promise<MutationResult<void>>} The request result
 */
export async function deleteComment (id: number): Promise<MutationResult<void>> {
  const { accessToken } = useAuthStore.getState();

  try {
    const res: AxiosResponse<void> = await authenticated.delete(`/api/comments/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    Logger.info('deleteComment', res.data);

    return [null, res.data];

  } catch (e) {
    Logger.error('deleteComment', e);

    if (e.response) {
      return [e.response.data]
    
    } else if (e.request) {
      return [new Error('Algo ocurrió en la comunicación con el servidor, intente nuevamente')]
    } else {
      return [e];
    }
  }
}