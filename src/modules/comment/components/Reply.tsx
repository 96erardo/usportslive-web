import React from 'react';
import { Grid, Avatar, Link, Paragraph, Dropdown, Menu, Icon, Text } from '@8base/boost';
import Can from '../../../shared/components/utilities/Can';
import { Comment } from '../../../shared/types';

export const Reply: React.FC<Props> = ({ comment }) => {
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
                      perform="comment:delete"
                      data={{ comment }}
                      onYes={() => (
                        <Menu.Item>
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
  comment: Comment
}