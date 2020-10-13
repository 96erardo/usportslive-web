import React, { useCallback } from 'react';
import { Input, Column, styled } from '@8base/boost';
import { TwitterPicker, ColorResult } from 'react-color';

const ColorPreview = styled.span`
  background-color: ${(props: any) => props.color};
  width: 10px;
  height: 10px;
  border-radius: 100%;
`;

function ColorPicker ({
  color = '#eee',
  name,
  onChange,
}: Props) {
  const handleChange = useCallback((color: ColorResult) => {
    onChange(color.hex);
  }, [onChange]);

  return (
    <Column stretch>
      <Input
        leftIcon={<ColorPreview color={color} />}
        stretch
        name={name}
        value={color}
        readOnly
      />
      <TwitterPicker 
        width="100%"
        color={color}
        onChangeComplete={handleChange}
      />
    </Column>
  );
}

type Props = {
  color?: string,
  name: string,
  onChange: (color: string) => void
}

export default ColorPicker;