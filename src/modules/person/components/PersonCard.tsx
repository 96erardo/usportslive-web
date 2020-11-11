import React, { useCallback, useState } from 'react';
import { Column, Text, Row, Button, Icon, COLORS } from '@8base/boost';
import { Paper } from '../../../shared/components/globals/Paper';
import { Avatar, Heading } from '../../../shared/components/globals';
import { ImageUploader } from '../../../shared/components/utilities/ImageUploader';
import Can from '../../../shared/components/utilities/Can';
import { Image, Person } from '../../../shared/types';
import { updateAvatar } from '../person-actions';
import { onError } from '../../../shared/mixins';

export const PersonCard: React.FC<Props> = ({ person, onChange }) => {
  const [avatar, setAvatar] = useState<Image | null>(null);
  const [loading, setLoading] = useState(false);

  const changeAvatar = useCallback(async () => {
    if (avatar) {
      setLoading(true);

      const [err] = await updateAvatar(person.id, avatar.id);

      setLoading(false);

      if (err) {
        return onError(err);
      }

      setAvatar(null);

      onChange();
    }
  }, [person, avatar, onChange]);

  return (
    <Paper className="w-100 p-4" background={COLORS.BLACK}>
      <Column className="w-100" alignItems="center">
        <Can 
          perform="person:update"
          data={{ person }}
          onYes={() => (
            <ImageUploader id="avatar" onSelect={setAvatar}>
              {open => (
                <Avatar
                  src={avatar?.url || person.avatar?.url}
                  size="lg"
                  firstName={person.name}
                  lastName={person.lastname}
                  pickLabel="Cambiar"
                  onPick={open}
                />
              )}
            </ImageUploader>
          )}
          onNo={() => (
            <Avatar 
              src={person.avatar?.url} 
              size="lg"
              firstName={person.name}
              lastName={person.lastname}
            />
          )}
        />
        <Column className="w-100" alignItems="center" gap="none">
          <Heading type="h2" fontWeight="600" color="#fff">
            {person.name} {person.lastname}
          </Heading>
          <Text color="PRIMARY_LIGHTER">
            @{person.user?.username}
          </Text>
        </Column>
        {avatar && (
          <Row className="w-100" alignItems="center" justifyContent="around">
            <Button 
              variant="link" 
              color="danger" 
              disabled={loading}
              onClick={() => setAvatar(null)}
            >
              <Icon name="Delete" />
            </Button>
            <Button 
              variant="link" 
              color="success" 
              loading={loading}
              onClick={changeAvatar}
            >
              <Icon name="Check" />
            </Button>
          </Row>
        )}
      </Column>
    </Paper>
  );
}

type Props = {
  person: Person,
  onChange: () => void
}