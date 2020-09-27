import React from 'react';
import { Avatar, Grid, Icon, Text, Tooltip } from '@8base/boost';
import { Person as Player } from '../../../shared/types';

const PlayerLiveItem: React.FC<Props> = ({ player }) => {
  const { inMinute, outMinute, points } = player.participation;

  const on = inMinute !== null && inMinute > 0 && outMinute === null;
  const off = outMinute !== null;

  return (
    <div className="p-4" style={{ width: '100%' }}>
      <Grid.Layout
        stretch
        columns="50px 1fr 1fr"
        areas={
          [
            ['avatar', 'name', 'actions'],
            ['avatar', 'points', 'actions'],
          ]
        }
      >
        <Grid.Box area="avatar">
          <Avatar size="sm" src={player.photo} firstName={player.name} lastName={player.lastname}/>
        </Grid.Box>
        <Grid.Box area="name" direction="row" alignItems="center">
          <Text weight="bold" color="WHITE">{player.name} {player.lastname}</Text>
          {on &&
            <Tooltip placement="right" message={`Min ${inMinute}.`}>
              <Icon
                className="ml-4"
                size="sm"
                name="ChevronTop"
                color="SUCCESS"
              />
            </Tooltip>
          }
          {off &&
            <Tooltip placement="right" message={`Min ${outMinute}.`}>
              <Icon
                className="ml-4"
                size="sm"
                name="ChevronDown"
                color="DANGER"
              />
            </Tooltip>
          }
        </Grid.Box>
        {points.length > 0 && (
          <Grid.Box area="points">
            <Text color="WHITE">
              {`${points.length} punto${points.length > 1 ? 's' : ''}`}
            </Text>
          </Grid.Box>
        )}
      </Grid.Layout>
    </div>
  );
}

type Props = {
  player: Player,
}

export default PlayerLiveItem;