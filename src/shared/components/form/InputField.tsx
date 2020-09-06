import React, { useState, useCallback } from 'react';
import { InputField as BoostInputField } from '@8base/boost';

const InputField: React.FC<Props> = ({
  initialValue = '',
  onChange,
  label, 
  placeholder, 
  name,
  stretch = true
}) => {
  const [value, setValue] = useState(initialValue);  

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;

    onChange(name, value);
  }, [onChange])

  return (
    <BoostInputField 
      stretch={stretch}
      label={label}
      type="text"
      placeholder={placeholder}
      input={{
        value,
        name,
        onChange: setValue,
        onBlur: handleBlur
      }}
    />
  );
}

type Props = {
  label?: string,
  name: string,
  placeholder?: string,
  initialValue?: string | number,
  onChange: (name: string, value: string) => void,
  stretch?: boolean,
  readOnly?: boolean,
}

export default InputField;