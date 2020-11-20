import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader, Text, Row, Icon } from '@8base/boost';
import { fetchGameLikes, likeGame, dislikeGame } from '../game-actions';
import { Likes } from '../../../shared/types';
import axios, { CancelTokenSource } from 'axios';
import { useAuthStore } from '../../auth/auth-store';
import { toast } from 'react-toastify';

export const Like: React.FC<Props> = ({ game }) => {
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [likes, setLikes] = useState<Likes>({ count: 0, liked: false });
  const timeout = useRef<number | undefined>();
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  const fetch = useCallback(async (source?: CancelTokenSource) => {
    const [err, canceled, data] = await fetchGameLikes(game, source);

    if (canceled)
      return;

    if (err) {
      setDisabled(true);
    }

    if (data) {
      setLikes(data);
    }

    setLoading(false);
  }, [game]);

  const like = useCallback(async () => {
    const [err, data] = likes.liked ? await dislikeGame(game) : await likeGame(game);

    if (err) {
      setLikes(state => ({...state, liked: !state.liked }));

      return toast.error('No se pudo enviar su "Me gusta"');
    }

    if (data) {
      setLikes(data);
    }
  }, [game, likes]);

  const toggle = useCallback(() => {
    if (!isLoggedIn)
      return;

    clearTimeout(timeout.current);

    setLikes(state => ({...state, liked: !state.liked }));

    timeout.current = window.setTimeout(() => like(), 1000);
  }, [like, isLoggedIn]);  

  useEffect(() => {
    const source = axios.CancelToken.source();

    fetch(source);

    return () => source.cancel();
  }, [fetch]);

  if (loading) {
    return (
      <Loader 
        size="sm"
        color="RED_40"
      />
    );
  }

  if (disabled) {
    return (
      <Icon name="WhiteHeart" size="md"/>
    );
  }

  if (!likes.liked) {
    return (
      <Row alignItems="start">
        <Icon 
          cursor="pointer"
          name={likes.count > 0 ? 'RedBorderedHeart' : 'WhiteHeart'}
          size="md" 
          onClick={toggle}
        />
        <Text 
          color={likes.count > 0 ? 'RED_40' : 'GRAY_20'}
          weight="bold" 
          text={`${likes.count}`} 
        />
      </Row>
    )
  }

  return (
    <Row alignItems="start">
      <Icon 
        cursor="pointer"
        name="RedHeart"
        size="md"
        onClick={toggle}
      />
      <Text 
        color="RED_40"
        weight="bold" 
        text={`${likes.count}`} 
      />
    </Row>
  );
}

type Props = {
  game: number
}