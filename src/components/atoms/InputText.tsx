import React, { ChangeEvent } from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
  display: flex;
  min-height: 40px;

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

export default function Signup({
  value,
  onChange,
  style
}: {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  style: any
}) {
  return (
    <Wrap style={style}>
      <input type="text" value={value} onChange={onChange} />
    </Wrap>
  )
}
