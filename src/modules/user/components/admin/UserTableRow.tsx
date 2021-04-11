import React, { useCallback, useState } from 'react';
import { Avatar, Table, Dropdown, Link, Icon, Menu, Loader, Row } from '@8base/boost';
import { updateUserRole } from '../../user-actions';
import { User } from '../../../../shared/types';
import { DATE_TIME_FORMAT } from '../../../../shared/constants';
import { onError } from '../../../../shared/mixins';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useAppStore } from '../../../app/app-store';

function UserTableRow ({ columns, user, afterUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const roles = useAppStore(state => state.roles);

  const onStatusChange = useCallback(async (role: number, dropdown) => {
    dropdown.closeDropdown();

    if (user.roleId === role) {
      return;
    }

    setLoading(true);

    const [err] = await updateUserRole(user.id, role);

    setLoading(false);

    if (err) {
      return onError(err);
    }

    toast.success('Rol actualizado correctamente');

    afterUpdate();
  }, [user, afterUpdate]);

  return (
    <Table.BodyRow columns={columns}>
      <Table.BodyCell>
        <Avatar 
          size="sm"
          src={user.person.avatar?.smallUrl}
          firstName={user.person.name}
          lastName={user.person.lastname}
        />
      </Table.BodyCell>
      <Table.BodyCell>
        <Link to={`/admin/user/${user.id}`} color="primary" variant="link">
          {`${user.person.name} ${user.person.lastname}`}
        </Link>
      </Table.BodyCell>
      <Table.BodyCell>
        <Dropdown defaultOpen={false}>
          <Dropdown.Head stretch>
            {loading ? (
              <Row alignItems="center" justifyContent="center">
                <Loader size="sm" />
              </Row>
            ) : (
              <Row alignItems="center" justifyContent="between">
                <Link underline={false} color="GRAY_60" variant="link">
                  {user.role.name}
                </Link>
                <Icon size="xs" color="GRAY_60" name="ChevronDown" />
              </Row>
            )}
          </Dropdown.Head>
          <Dropdown.Body>
            {(dropdown: any) => (
              <Menu>
                {roles.map(role => (
                  <Menu.Item key={role.id} onClick={() => onStatusChange(role.id, dropdown)}>
                    {role.name}
                  </Menu.Item>
                ))}
              </Menu>
            )}
          </Dropdown.Body>
        </Dropdown>
      </Table.BodyCell>
      <Table.BodyCell>
        {moment(user.createdAt).format(DATE_TIME_FORMAT)}
      </Table.BodyCell>
    </Table.BodyRow>
  );
}

type Props = {
  user: User,
  columns: string,
  afterUpdate: () => Promise<void>
}

export default UserTableRow;