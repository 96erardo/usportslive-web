import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Column, Loader, Icon, Heading as BoostHeader, styled } from '@8base/boost';

const Container = styled(Column)`
  background: #f4f7f9;
  border-radius: .5rem;
  cursor: pointer;
  ${(props: Props) => props.height && `height: ${props.height}px;` }
`;

const Label = styled.label`
  width: 100%;
`;

const Img = styled.img`
  width: 100%;
  border-radius: .5rem;
`;

const Heading = styled(BoostHeader)`
  font-weight: 600;
`;

export const ImageSelector: React.FC<Props> = ({ id, src, heading = 'h2', onSelected, ...rest }) => {
  const [loading, setLoading] = useState(false);
  const [reader] = useState(new FileReader());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onLoad (e: any) {
      const file = (inputRef.current && inputRef.current.files) ? inputRef.current.files[0] : null;

      onSelected(file, e.target.result);

      setLoading(false);
    }

    function onLoadError () {
      setLoading(false);

      onSelected(null, '');
    }

    reader.addEventListener('load', onLoad);
    reader.addEventListener('error', onLoadError)

    return () => {
      reader.removeEventListener('load', onLoad)
      reader.removeEventListener('error', onLoadError)
    };
  }, [reader, onSelected]);

  const handleChage = useCallback(() => {
    setLoading(true);

    const file = (inputRef.current && inputRef.current.files) ? inputRef.current.files[0] : null;

    if (file) {
      reader.readAsDataURL(file);
    }
  }, [reader]);

  return (
    <Label htmlFor={id}>
      {src ? (
        <Img src={src} />
      ) : (
        <Container
          stretch
          alignItems="center"
          justifyContent="center"
          {...rest}
        >
          {loading ? (
            <Loader size="sm" color="primary"/>
          ) : (
            <>
              <Icon name="GreyImage" size="xl" />
              <Heading type={heading}>
                Elija una Imagen
              </Heading>
            </>
          )}
        </Container>
      )}
      <input
        id={id}
        type="file"
        accept="image/jpeg, image/png, image/svg+xml, image/webp"
        ref={inputRef}
        onChange={handleChage}
        style={{ display: 'none' }}
      />
    </Label>
  );
}

type Props = {
  id: string,
  src: string,
  height: number
  heading?: string,
  onSelected: (file: File | null, src: string) => void
}