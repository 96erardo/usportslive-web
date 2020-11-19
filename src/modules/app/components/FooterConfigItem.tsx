import React, { useCallback, useState } from 'react';
import { Table, Text, Row, Link, Icon, Input, Loader } from '@8base/boost';
import { updateAppConfig } from '../app-actions';
import { useAppStore } from '../app-store';
import { onError } from '../../../shared/mixins';
import { toast } from 'react-toastify';

export const FooterConfigItem: React.FC<Props> = ({ label, setting, link }) => {
  const config = useAppStore(state => state.settings[setting]);
  const setSetting = useAppStore(state => state.setSetting);
  const [value, setValue] = useState(config.value);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const onEdit = useCallback(() => setEditing(true), []);

  const onCancel = useCallback(() => setEditing(false), []);

  const onSubmit = useCallback(async () => {
    if (!value) {
      return onError('El parámetro de configuración no puede estar vacío');
    }

    setLoading(true);

    const [err, data] = await updateAppConfig(config.id, value);

    setLoading(false);

    if (err) {
      return onError(err);
    }

    toast.success('Configuración actualizada correctamente');

    if (data) {
      setSetting(config.name, data);
      
      setEditing(false);
    }
  }, [config, value, setSetting]);

  return (
    <Table.BodyRow columns="200px 1fr 200px">
      <Table.BodyCell>
        <Text weight="bold">
          {label}
        </Text>
      </Table.BodyCell>
      <Table.BodyCell>
        {editing &&
          <Input 
            kind="underline"
            name="config"
            value={value}
            onChange={setValue}
          />
        }
        {!editing && link &&
          <Link target="_blank" href={config?.value}>
            {config?.value}
          </Link>
        }
        {!editing && !link &&
          <Text>
            {config?.value}
          </Text>
        }
      </Table.BodyCell>
      <Table.BodyCell>   
        <Row stretch alignItems="center" justifyContent="end">
          {!loading && !editing &&
            <Icon 
              name="EditPencil" 
              cursor="pointer"
              onClick={onEdit}
            />
          }
          {!loading && editing && 
            <>
              <Icon 
                name="Delete"
                color="DANGER" 
                cursor="pointer"
                onClick={onCancel}
              />
              <Icon 
                size="sm"
                color="SUCCESS"
                name="Check" 
                cursor="pointer"
                onClick={onSubmit}
              />
            </>
          }
          {loading &&
            <Loader size="sm" color="PRIMARY" />
          }
        </Row>
      </Table.BodyCell>
    </Table.BodyRow>
  );
}

type Props = {
  label: string,
  setting: string,
  link: boolean
}