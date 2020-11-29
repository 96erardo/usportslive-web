import React from 'react';
import { Grid, Paragraph, Link } from '@8base/boost';
import { Avatar } from '../../../shared/components/globals';
import { Comment as CommentType } from '../../../shared/types';

export const Comment: React.FC<Props> = ({ comment }) => {
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
        </Grid.Box>
        <Grid.Box>
          
        </Grid.Box>
      </Grid.Layout>
    </div>
  );
}

type Props = {
  comment: CommentType
};