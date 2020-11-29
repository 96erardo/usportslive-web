import React, { useCallback, useState } from 'react';
import { TextArea as BoostTextArea, Button, Column, Row, styled } from '@8base/boost';
import { createComment } from '../comment-actions';
import { onError } from '../../../shared/mixins';
import { toast } from 'react-toastify';

const TextArea = styled(BoostTextArea)`
  width: 100%;
  resize: none;
`;

export const CommentForm: React.FC<Props> = ({ game, onCreate }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  

  const onSubmit = useCallback(async () => {
    setLoading(true);

    const [err] = await createComment({
      game,
      content
    })

    setLoading(false);

    if (err) {
      return onError(err);
    }

    setContent('');

    toast.success('Comentario creado correctamente');

    onCreate();
  }, [game, content, onCreate]);

  return (
    <Column className="w-100 p-4">
      <TextArea 
        rows={3}
        name="comment"
        value={content}
        onChange={setContent}
      />
      <Row className="w-100" alignItems="center" justifyContent="end">
        <Button
          size="sm" 
          color="primary"
          loading={loading}
          onClick={onSubmit}
        >
          Enviar
        </Button>
      </Row>
    </Column>
  );
}

type Props = {
  game: number,
  onCreate: () => void,
}