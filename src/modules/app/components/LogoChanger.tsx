import React, { useCallback, useState } from 'react';
import { Card, Row, Button } from '@8base/boost';
import { useAppStore } from '../app-store';
import { updateAppLogo } from '../app-actions';
import { APP_LOGO } from '../../../shared/constants';
import { ImageUploader } from '../../../shared/components/utilities/ImageUploader';
import { Image } from '../../../shared/types';
import { onError } from '../../../shared/mixins';
import { toast } from 'react-toastify';

export const LogoChanger: React.FC = () => {
  const logo = useAppStore(state => state.settings[APP_LOGO]);
  const setSetting = useAppStore(state => state.setSetting);
  const [image, setImage] = useState<Image | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = useCallback(async () => {
    if (!image) 
      return;
    
    setLoading(true);

    const [err, data] = await updateAppLogo(image.url);

    setLoading(false);

    if (err) {
      return onError(err);
    }

    toast.success('Logo de la aplicación actualizado');

    if (data) {
      setSetting(APP_LOGO, data);
    }
  }, [image, setSetting]);

  return (
    <Card className="w-100">
      <Card.Body alignItems="center" padding="md">
        <Row stretch alignItems="center" justifyContent="center">
          <ImageUploader id="app-logo" onSelect={setImage}>
            {open => (
              <img 
                alt="App logo"
                width={100}
                src={image?.url || logo.value}
                onClick={open}
                style={{ cursor: 'pointer' }}
              />
            )}
          </ImageUploader>
        </Row>
      </Card.Body>
        <Card.Footer padding="sm">
          <Row stretch alignItems="center" justifyContent="end">
            <Button 
              size="sm" 
              color="neutral" 
              disabled={image == null || loading}
            >
              Cancelar
            </Button>
            <Button 
              size="sm" 
              color="primary" 
              disabled={image === null} 
              loading={loading}
              onClick={submit}
            >
              Guardar
            </Button>
          </Row>
        </Card.Footer>
    </Card>
  )
};