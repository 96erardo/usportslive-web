import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dialog, Row, Column, Button, Switch, useModal, Label, styled } from '@8base/boost';
import { ImageSelector } from './ImageSelector';
import Cropper from 'react-easy-crop';
import { Image } from '../../types';
import { MediaSize } from 'react-easy-crop/types';
import { Slider } from '../globals/Slider';
import { uploadImage } from '../../../modules/images/image-actions';
import { onError } from '../../mixins';

const Container = styled.div`
  ${(props: { stretch?: boolean }) => props.stretch && 'width: 100%;'}
`;

const CropContainer = styled.div`
  width: 100%;
  height: 450px;
  position: relative;
`;

const cropState: CropState = {
  active: false,
  coordinates: { x: 0, y: 0 },
  size: { width: 100, height: 100 },
  shape: 'rect',
  zoom: 1,
}

const imageState: ImageState = {
  file: null,
  src: '',
}

export const modalId = 'image-uploader';

export const ImageUploader: React.FC<Props> = ({ id, children, onSelect }) => {
  const [image, setImage] = useState<ImageState>({ file: null, src: '' });
  const { isOpen, openModal, closeModal } = useModal(`${id}-${modalId}`);
  const [crop, setCrop] = useState<CropState>(cropState);
  const [loading, setLoading] = useState(false);
  const coordinates = useRef({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!isOpen) {
      setCrop(cropState);
      setImage(imageState);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!crop.active) {
      setCrop(cropState)
    }
  }, [crop]);

  const onFileSelected = useCallback((file: File | null, src: string) => {
    setImage({ file, src });
  }, []);

  const onCropToggle = useCallback((value: boolean) => {
    setCrop(state => ({...state, active: value }));
  }, []);

  const onCropChange = useCallback((coordinates) => {
    setCrop(state => ({...state, coordinates }));
  }, []);
  
  const onCropComplete = useCallback((relativeSize, actualSize) => {
    coordinates.current = {
      x: actualSize.x,
      y: actualSize.y,
      width: actualSize.width,
      height: actualSize.height,
    }
  }, []);
  
  const onZoomChange = useCallback((value: number | number[] | null | undefined) => {
    setCrop(state => ({...state, zoom: value as number }));
  }, []);

  const onMediaLoaded = useCallback(({ width, height }: MediaSize) => {
    const maxSize = width > height ? height : width;
    setCrop(state => ({
      ...state,
      size: {
        ...state.size,
        width: maxSize,
        height: maxSize
      }
    }));
  }, []);

  const open = useCallback(() => openModal(`${id}-${modalId}`), [id, openModal]);

  const close = useCallback(() => closeModal(`${id}-${modalId}`), [id, closeModal]);

  const onRemove = useCallback(() => {
    onSelect(null);

    close();
  }, [close, onSelect]);

  const onSubmit = useCallback(async () => {
    setLoading(true);

    const [err, data] = await uploadImage({
      img: image.file as File,
      crop: crop.active,
      x: coordinates.current.x,
      y: coordinates.current.y,
      width: coordinates.current.width,
      height: coordinates.current.height,
    });

    setLoading(false);

    if (err) {
      return onError(err);
    }

    if (data) {
      onSelect(data);

      close();
    }

  }, [image, crop, close, onSelect]);

  return (
    <Container>
      {children(open)}
      <Dialog isOpen={isOpen} size="lg">
        <Dialog.Body>
          <Column stretch>
            {crop.active &&
              <CropContainer>
                <Cropper 
                  image={image.src}
                  crop={crop.coordinates}
                  cropShape={crop.shape}
                  zoom={crop.zoom}
                  maxZoom={4}
                  onCropChange={onCropChange}
                  cropSize={crop.size}
                  onCropComplete={onCropComplete}
                  onMediaLoaded={onMediaLoaded}
                />
              </CropContainer>
            }
            <div style={{ width: '100%', ...(crop.active ? { display: 'none' } : {})}}>
              <ImageSelector 
                id={`${id}-${modalId}`}
                src={image.src}
                height={400}
                onSelected={onFileSelected}
              />
            </div>
            {image.file !== null &&
              <Column stretch alignItems="center" justifyContent="end">
                <Switch 
                  label="Cortar"
                  value={crop.active} 
                  onChange={onCropToggle}
                  inverted 
                />
                {crop.active &&
                  <>
                    <Label text="Tipo de Corte"/>
                    <Label text="Zoom" />
                    <Slider
                      disabled={!crop.active}
                      value={crop.zoom}
                      min={1}
                      max={4}
                      step={0.1}
                      onChange={onZoomChange}
                    />
                  </>
                }
              </Column>
            }
          </Column>
        </Dialog.Body>
        <Dialog.Footer>
          <Row stretch alignItems="center" justifyContent="end">
            <Button 
              disabled={loading} 
              color="neutral" 
              onClick={close}
            >
              Cancelar
            </Button>
            <Button 
              disabled={loading}
              color="danger" 
              onClick={onRemove}
            >
              Quitar Foto
            </Button>
            <Button 
              disabled={loading || image.file === null} 
              loading={loading} 
              color="primary" 
              onClick={onSubmit}
            >
              Aceptar
            </Button>
          </Row>
        </Dialog.Footer>
      </Dialog>
    </Container>
  );
}

type Props = {
  id: string,
  onSelect: (image: Image | null) => void,
  children: (open: () => void) => React.ReactNode,
}

type ImageState = {
  file: File | null,
  src: string
}

type CropState = {
  active: boolean,
  coordinates: { x: number, y: number },
  size: { 
    width: number, 
    height: number 
  },
  shape: 'rect',
  zoom: number
}