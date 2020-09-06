import React, { useRef, useCallback, useState, useEffect } from 'react';
import ContentEditable from 'react-contenteditable';

const style = (props: Props) => ({
  margin: '0',
  color: '#323C47',
  ...types[props.tagName],
  letterSpacing: '0.5px',
  padding: '0px 8px',
  fontFamily: 'Poppins',
});

const EditableTitle: React.FC<Props> = (props) => {
  const [disabled, setDisabled] = useState(false);
  const text = useRef(props.value);
  const input = useRef<HTMLHeadElement>(null);

  useEffect(() => {
    if (input.current !== null) {
      input.current.spellcheck = false;
    }
  }, [])

  const handleChange = useCallback((e) => {
    text.current = e.target.value;
  }, []);

  const handleBlur = useCallback(async (e) => {
    if (props.value === e.target.textContent) {
      return;
    }

    setDisabled(true);

    const success = await props.onBlur(text.current);
  
    if (!success && input.current) {
      input.current.nodeValue = props.value;
    }

    setDisabled(false);
  }, [props])
  
  return (
    <ContentEditable
      innerRef={input}
      html={disabled ? text.current : props.value}
      disabled={disabled}
      onChange={handleChange}
      onBlur={handleBlur}
      style={style(props)}
      tagName={props.tagName}
    />
  );
}

type Props = {
  tagName: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  value: string,
  onBlur: (value: string) => Promise<boolean>
}

const types = {
  h1: {
    fontSize: '3.2rem',
    lineHeight: '4.8rem',
    fontWeight: '500',
  },
  h2: {
    fontSize: '1.8rem',
    lineHeight: '2.8rem',
    fontWeight: '400',
  },
  h3: {
    fontSize: '1.6rem',
    lineHeight: '2.4rem',
    fontWeight: '600',
  },
  h4: {
    fontSize: '1.4rem',
    lineHeight: '2rem',
    fontWeight: '600',
  },
  h5: {
    fontSize: '1.2rem',
    lineHeight: '1.6rem',
    fontWeight: '600',
  },
  h6: {}
}

export default EditableTitle;