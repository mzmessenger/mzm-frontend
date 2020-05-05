import React, { ChangeEvent } from 'react'
import styled from 'styled-components'

const InputText = ({
  value,
  onChange,
  error,
  style
}: {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  error?: boolean
  style?: any
}) => {
  return (
    <Wrap style={style} className={error ? 'error' : ''}>
      <input type="text" value={value} onChange={onChange} />
    </Wrap>
  )
}
export default InputText

const Wrap = styled.div`
  display: flex;
  min-height: 40px;

  &.error {
    border: solid 1px var(--color-error);
  }

  input {
    border-radius: 3px;
    background-color: var(--color-input-background);
    color: var(--color-input);
    resize: none;
    border: none;
    appearance: none;
    font-size: 16px;
    padding: 10px;
    flex: 1;
  }
`
