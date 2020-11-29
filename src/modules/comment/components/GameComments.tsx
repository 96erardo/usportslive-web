import React, { useContext, useEffect, useState } from 'react';
import { Card, Row, Select, Loader, Link, COLORS, styled } from '@8base/boost';
import { Heading } from '../../../shared/components/globals';
import { GameContext } from '../../game/contexts/GameContext';
import { Comment } from './Comment';
import { useComments } from '../hooks/useComments';
import { onError } from '../../../shared/mixins';
import { CommentForm } from './CommentForm';

const Body = styled(Card.Body)`
  & > *:not(:last-child) {
    border-bottom: 1px solid ${COLORS.GRAY};
  }
`;

const options = [
  { label: 'Más recientes primero', value: 'createdAt_DESC' },
  { label: 'Más antiguos primero', value: 'createdAt_ASC' },
];

export const GameComments: React.FC = () => {
  const game = useContext(GameContext);
  const [orderBy, setOrder] = useState<'createdAt_ASC' | 'createdAt_DESC'>('createdAt_DESC');
  const { items, count, loading, error, next, refresh } = useComments(orderBy, { parent: null, game: game?.id });

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error]);

  const comments = items.map(comment => (
    <Comment 
      key={comment.id} 
      comment={comment}
    />
  ));

  return (
    <Card stretch>
      <Card.Header>
        <Row stretch alignItems="center" justifyContent="between">
          <Heading type="h1" fontWeight="700">
            Comentarios
          </Heading>
          <Select
            stretch={false}
            name="orderBy"
            value={orderBy}
            options={options}
            onChange={setOrder}
          />
        </Row>
      </Card.Header>
      <Body padding="none">
        <CommentForm 
          game={game ? game.id : 0}
          onCreate={refresh}
        />
        {comments}
        {loading &&
          <Row stretch alignItems="center" justifyContent="center">
            <Loader 
              color="PRIMARY"
              size="sm"
            />
          </Row>
        }
        {!loading && items.length < count &&
          <Row stretch className="py-3" alignItems="center" justifyContent="center">
            <Link onClick={next}>Cargar más</Link>
          </Row>
        }
      </Body>
    </Card>
  );
}