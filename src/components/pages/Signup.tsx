import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { State } from '../../modules/index.types'
import { getMyInfo } from '../../modules/index.action'
import Header from '../atoms/LoginHeader'
import InputTxt from '../atoms/InputText'
import Button from '../atoms/Button'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  label {
    color: var(--color-on-surface);
    font-size: 1em;
  }

  .signup {
    a {
      color: var(--color-link);
    }

    max-width: 400px;
    padding: 20px;
    background-color: var(--color-surface);
    color: var(--color-on-surface);
    width: 700px;
    margin: 40px 0 0 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    .create {
      margin: 10px 0 0 0;
      height: 40px;
      width: 80px;
    }
  }

  .attention {
    color: var(--color-on-background);
    margin: 20px 0 0 0;
  }
`

function Signup({ history }: RouteComponentProps) {
  const signupAccount = useSelector((state: State) => state.signupAccount)
  if (!signupAccount) {
    history.push('/')
  }

  const dispatch = useDispatch()

  const [txt, setTxt] = useState(signupAccount ? signupAccount : '')
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTxt(e.target.value)
    },
    [setTxt]
  )

  const onSubmit = async evt => {
    evt.preventDefault()

    const res = await fetch('/api/user/signup', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ account: txt })
    })

    // @todo validation
    if (res.status === 200) {
      return await getMyInfo()(dispatch)
    } else if (res.status === 401) {
      history.push('/')
    }
  }

  return (
    <Wrapper>
      <Header />
      <form className="signup" onSubmit={onSubmit}>
        <h2>アカウントを作成</h2>
        <label>
          アカウント
          <InputTxt
            style={{ margin: '5px 0 0 0' }}
            value={txt}
            onChange={onChange}
          />
        </label>
        <div className="footer">
          <Button className="create">作成</Button>
        </div>
      </form>
      <div className="attention">
        アカウントを作成すると、
        <a href="/tos" target="_blank">
          利用規約
        </a>
        に同意したことになります。
      </div>
    </Wrapper>
  )
}

export default withRouter(Signup)
