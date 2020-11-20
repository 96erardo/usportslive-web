import React, { useCallback, useEffect, useState } from 'react';
import { INITIAL_LIST_STATE } from '../../../shared/constants';
import { GamePost } from '../../game/components/GamePost';
import { onError } from '../../../shared/mixins';
import { Game, ListHooksState } from '../../../shared/types';
import { fetchTeamGames } from '../team-actions';
import axios, { CancelTokenSource } from 'axios';
import { Column, Row, Link, Loader } from '@8base/boost';

export const TeamGames: React.FC<Props> = ({ id }) => {
  const [page, setPage] = useState(1);
  const [{ items, loading, count, error }, setState] = useState<ListHooksState<Game>>(INITIAL_LIST_STATE);

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    setState(prevState => ({...prevState, loading: true }));

    const [err, canceled, data] = await fetchTeamGames(page, id, ['competition', 'local', 'visitor'], 'date_DESC', source);

    if (canceled) {
      return canceled;
    }

    if (err) {
      return setState(prevState => ({
        ...prevState,
        error: err,
        loading: false,
      }));
    }

    if (data) {
      return setState(prevState => ({
        ...prevState,
        error: null,
        loading: false,
        items: page === 1 ? data.items : [
          ...prevState.items,
          ...data.items
        ],
        count: data.count
      }));
    }

  }, [id, page]);

  const next = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    fetch(source);

    return () => source.cancel();
  }, [fetch]);

  return (
    <Column className="w-100">
      {items.map(item => (
        <GamePost game={item} />
      ))}
      {loading &&
        <Row className="w-100 my-2" alignItems="center" justifyContent="center">
          <Loader size="sm" color="primary" />
        </Row>
      }
      {!loading && items.length < count &&
        <Row className="w-100 my-2" alignItems="center" justifyContent="center">
          <Link onClick={next}>Cargar más</Link>
        </Row>
      }
    </Column>
  );
}

type Props = {
  id: number // The team id
}