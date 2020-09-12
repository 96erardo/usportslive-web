import React, { useState, useCallback, useEffect } from 'react';
import { InputField as BoostInputField } from '@8base/boost';

const InputField: React.FC<Props> = ({
  initialValue = '',
  onChange,
  label, 
  placeholder, 
  name,
  readOnly = false,
  stretch = true
}) => {
  const [value, setValue] = useState(initialValue);  

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;

    onChange(name, value);
  }, [onChange])

  return (
    <BoostInputField 
      readOnly={readOnly}
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