import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { State } from '../modules/index'
import { search, cancel } from '../modules/search'
import InputText from './atoms/InputText'
import Button from './atoms/TransparentButton'

const SearchInput = () => {
  const query = useSelector((state: State) => state.search.query)
  const dispatch = useDispatch()

  const onChange = (e) => search(e.target.value)(dispatch)

  const onCancel = () => dispatch(cancel())

  return (
    <Wrap>
      <InputText style={{ flex: 1 }} value={query} onChange={onChange} />
      {query && (
        <Button className="button-cancel" onClick={onCancel}>
          キャンセル
        </Button>
      )}
    </Wrap>
  )
}
export default SearchInput

const Wrap = styled.div`
  display: flex;
  padding: 4px 12px 4px 4px;
  border-bottom: 1px solid var(--color-border);

  .button-cancel {
    border: 1px solid var(--color-on-primary);
    background-color: transparent;
    width: 100px;
    margin: 0 0 0 4px;
  }
`
