import React, { useCallback, useState } from 'react';
import { Grid, Paragraph, Icon, Dropdown, Link, Menu, Text, useModal } from '@8base/boost';
import { Avatar } from '../../../shared/components/globals';
import { Comment as CommentType } from '../../../shared/types';
import Can from '../../../shared/components/utilities/Can';
import { CommentForm } from './CommentForm';
import { Replies } from './Replies';
import { deleteComment } from '../comment-actions';
import { onError } from '../../../shared/mixins';
import { modalId } from '../../../shared/components/globals/DecisionDialog';
import { toast } from 'react-toastify';

export const Comment: React.FC<Props> = ({ comment, ...props }) => {
  const { openModal, closeModal } = useModal(modalId);
  const [reply, setReply] = useState(false);

  const removeComment = useCallback(async (id: number) => {
    const [err] = await deleteComment(id);

    if (err) {
      return onError(err);
    }

    closeModal(modalId);

    props.onCreate();

    toast.success('Comment deleted');
  }, [props, closeModal]);

  const onCreate = useCallback(() => {
    props.onCreate();

    setReply(false);
  }, [props]);

  const onDelete = useCallback((id: number) => {
    openModal(modalId, {
      title: 'Eliminar comentario',
      text: '¿Está seguro que desea eliminar el comentario?',
      confirmText: 'Si, Eliminar',
      cancelText: 'Cancelar',
      onClose: () => closeModal(modalId),
      onCancel: () => closeModal(modalId),
      onConfirm: () => removeComment(id),
    })
  }, [openModal, closeModal, removeComment]);

  return (
    <div className="w-100 py-3">
      <Grid.Layout inline stretch columns="60px 1fr 60px">
        <Grid.Box direction="row" justifyContent="center">
          <Avatar 
            size="sm"
            src={comment.user?.person?.avatar?.smallUrl}
            firstName={comment.user?.person?.name}
            lastName={comment.user?.person?.lastname}
          />
        </Grid.Box>
        <Grid.Box direction="column">
          <Link>
            {comment.user?.person?.name} {comment.user?.person?.lastname}
          </Link>
          <Paragraph>
            {comment.content}
          </Paragraph>
          {reply &&
            <div className="w-100 mt-3">
              <CommentForm 
                game={comment.gameId}
                parent={comment.id}
                onCreate={onCreate}
                onCancel={() => setReply(false)}
              />
            </div>
          }
          <Replies 
            comment={comment.id}
            onDelete={onDelete}
          />
        </Grid.Box>
        <Grid.Box>
          <Can 
            perform="comment:actions"
            data={{ comment }}
            onYes={() => (
              <Dropdown defaultOpen={false}>
                <Dropdown.Head>
                  <Icon name="More" color="GRAY" />
                </Dropdown.Head>
                <Dropdown.Body>
                  <Menu>
                    <Can
                      perform="comment:reply"
                      data={{ comment }}
                      onYes={() => (
                        <Menu.Item onClick={() => setReply(true)}>
                          Responder
                        </Menu.Item>
                      )}
                    />
                    <Can
                      perform="comment:delete"
                      data={{ comment }}
                      onYes={() => (
                        <Menu.Item onClick={() => onDelete(comment.id)}>
                          <Text color="DANGER">
                            Eliminar
                          </Text>
                        </Menu.Item>
                      )}
                    />
                  </Menu>
                </Dropdown.Body>
              </Dropdown>
            )}
          />
        </Grid.Box>
      </Grid.Layout>
    </div>
  );
}

type Props = {
  comment: CommentType,
  onCreate: () => void,
};