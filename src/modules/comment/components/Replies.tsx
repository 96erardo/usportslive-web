import React, { useState } from 'react';
import { Row, Loader, Column, Link, styled, COLORS } from '@8base/boost';
import { useComments as useReplies } from '../hooks/useComments';
import { Reply } from './Reply';

const Body = styled(Column)`
  & > *:not(:last-child) {
    border-bottom: 1px solid ${COLORS.GRAY};
  }
`;

export const Replies: React.FC<Props> = ({ comment, onDelete }) => {
  const { items, count, loading } = useReplies('createdAt_ASC', { parent: comment });
  const [active, setActive] = useState(false);

  if (count === 0) {
    return null;
  }

  if (!active) {
    return (
      <div className="w-100 mt-3">
        <Link onClick={() => setActive(true)}>
          {count} respuestas
        </Link>
      </div>
    );
  }

  const replies = items.map(reply => (
    <Reply
      key={reply.id}
      comment={reply}
      onDelete={onDelete}
    />
  ));

  return (
    <Body className="w-100">
      {replies}
      {loading &&
        <Row className="w-100" alignItems="center" justifyContent="center">
          <Loader size="sm" color="PRIMARY" />
        </Row>
      }
      {!loading && items.length < count &&
        <Row className="w-100" alignItems="center" justifyContent="center">
          <Link>Mostrar más</Link>
        </Row>
      }
    </Body>
  );
}

type Props = {
  comment: number,
  onDelete: (id: number) => void
}