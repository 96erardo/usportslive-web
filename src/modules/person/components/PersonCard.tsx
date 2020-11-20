import React, { useCallback } from 'react';
import { Text, Row, Button, Table, Link, useModal } from '@8base/boost';
import { Paper } from '../../../shared/components/globals/Paper';
import { Avatar } from '../../../shared/components/globals';
import Can from '../../../shared/components/utilities/Can';
import { Person } from '../../../shared/types';
import { modalId, PersonFormDialog, Form } from './PersornFormDialog';

export const PersonCard: React.FC<Props> = ({ person }) => {
  const { openModal } = useModal(modalId);

  const onEdit = useCallback(() => {
    const args: Form = {
      id: person.id,
      name: person.name,
      lastname: person.lastname,
      gender: person.gender,
      avatar: person.avatar,
      email: person.user?.email,
      username: person.user?.username,
      oldPassword: '',
      password: '',
      passwordConfirmation: '',
      user: person.user,
    }

    openModal(modalId, args);
  }, [openModal, person]);

  return (
    <Paper className="w-100">
      <Row className="w-100 p-4" alignItems="center" justifyContent="center">
        <Avatar 
          src={person.avatar?.url} 
          size="lg"
          firstName={person.name}
          lastName={person.lastname}
        />
      </Row>
      <Table>
        <Table.Body data={[
          { id: 1, label: 'Nombre', value: person.name },
          { id: 2, label: 'Apellido', value: person.lastname },
          { id: 3, label: 'Género', value: person.gender },
          ...(person.user ? ([
            { id: 5, label: 'Correo', value: person.user.email },
            { id: 6, label: 'Usuario', value: person.user.username },
          ]) : [])
        ]}>
          {(item: { id: number, label: string, value: string }) => (
            <Table.BodyRow key={item.id} columns="150px 50%" >
              <Table.BodyCell>
                <Text weight="bold">
                  {item.label}:
                </Text>
              </Table.BodyCell>
              <Table.BodyCell>
                {item.label === 'Usuario' ? (
                  <Link>
                    @{item.value}
                  </Link>
                ) : item.value}
              </Table.BodyCell>
            </Table.BodyRow>
          )}
        </Table.Body>
      </Table>
      <Can 
        perform="person:update"
        data={{ person }}
        onYes={() => (
          <Row stretch className="p-3" alignItems="center" justifyContent="end">
            <Button size="sm" color="primary" onClick={onEdit}>
              Editar
            </Button>
            <PersonFormDialog />
          </Row>
        )}
        onNo={() => null}
      />
    </Paper>
  );
}

type Props = {
  person: Person,
}