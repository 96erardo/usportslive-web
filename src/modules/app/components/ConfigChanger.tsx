import React, { useCallback, useState } from 'react';
import { Card, Row, Button, InputField } from '@8base/boost';
import { Heading } from '../../../shared/components/globals';
import { useAppStore } from '../app-store';
import { updateAppConfig } from '../app-actions';
import { onError } from '../../../shared/mixins';

export const ConfigChanger: React.FC<Props> = ({ title, label, setting }) => {
  const config = useAppStore(state => state.settings[setting]);
  const setSetting = useAppStore(state => state.setSetting);
  const [value, setValue] = useState(config.value);
  const [loading, setLoading] = useState(false);

  const onCancel = useCallback(() => {
    setValue(config.value);
  }, [config]);

  const onSave = useCallback(async () => {
    if (!value) {
      return onError('La configuración no puede estar vacía')
    }

    setLoading(true);

    const [err, data] = await updateAppConfig(config.id, value);

    setLoading(false);

    if (err) {
      return onError(err);
    }

    if (data) {
      setSetting(setting, data);
    }
  }, [config, value, setting, setSetting]);

  return (
    <Card className="w-100">
      <Card.Header padding="sm">
        <Heading type="h2">
          {title}
        </Heading>
      </Card.Header>
      <Card.Body>
        <InputField 
          label={label}
          input={{
            name: setting,
            value,
            onChange: setValue
          }}
        />
      </Card.Body>
      <Card.Footer padding="sm">
        <Row stretch alignItems="center" justifyContent="end">
          <Button
            disabled={loading}
            size="sm"
            color="neutral"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            color="primary"
            loading={loading}
            onClick={onSave}
          >
            Guardar
          </Button>
        </Row>
      </Card.Footer>
    </Card>
  );
}

type Props = {
  title: string,
  label: string,
  setting: string,
}