import React, { useState, useCallback, useEffect } from 'react';
import { InputField as BoostInputField } from '@8base/boost';

const InputField: React.FC<Props> = ({
  initialValue = '',
  onChange,
  label, 
  placeholder, 
  name,
  readOnly = false,
  stretch = true,
  type = 'text',
  ...rest
}) => {
  const [value, setValue] = useState(initialValue);  

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;

    onChange(
      name, 
      typeof initialValue === 'number' ? parseInt(value) : value
    );
  }, [initialValue, onChange])

  return (
    <BoostInputField 
      readOnly={readOnly}
      stretch={stretch}
      label={label}
      type="text"
      placeholder={placeholder}
      input={{
        type: type,
        value,
        name,
        onChange: setValue,
        onBlur: handleBlur
      }}
      {...rest}
    />
  );
}

type Props = {
  label?: string,
  name: string,
  type?: string,
  placeholder?: string,
  initialValue?: string | number,
  onChange: (name: string, value: string | number) => void,
  stretch?: boolean,
  readOnly?: boolean,
}

export default InputField;