import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { State } from '../../modules/index'
import { getMyInfo } from '../../modules/user.action'
import Header from '../atoms/LoginHeader'
import InputText from '../atoms/InputText'
import Button from '../atoms/Button'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  label {
    width: 100%;
    color: var(--color-on-surface);
    font-size: 1em;
    &.error input {
      border-color: var(--color-error);
    }
  }

  .signup {
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

    a {
      color: var(--color-link);
    }
  }

  .error-txt {
    color: var(--color-error);
    margin: 5px 0 0 0;
    font-weight: 300;
  }
`

const ERROR_TXT =
  '入力された値が半角英数字以外か、すでに存在するアカウントです。'

function Signup({ history }: RouteComponentProps) {
  const signupAccount = useSelector((state: State) => state.user.signupAccount)
  if (!signupAccount) {
    history.push('/')
  }

  const dispatch = useDispatch()

  const [txt, setTxt] = useState(signupAccount ? signupAccount : '')
  const [errorTxt, setErrorTxt] = useState('')

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setTxt(value)
      if (/^[a-zA-Z\d]+$/.test(value)) {
        setErrorTxt('')
      } else {
        setErrorTxt(ERROR_TXT)
      }
    },
    [setTxt]
  )

  const onSubmit = async evt => {
    evt.preventDefault()
    if (errorTxt) {
      return
    }

    const res = await fetch('/api/user/signup', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ account: txt })
    })

    if (res.status === 200) {
      return await getMyInfo()(dispatch)
    } else if (res.status === 400) {
      setErrorTxt(ERROR_TXT)
      return
    } else if (res.status === 401) {
      history.push('/')
    }
    setErrorTxt('')
  }

  return (
    <Wrapper>
      <Header />
      <form className="signup" onSubmit={onSubmit}>
        <h2>アカウントを作成</h2>
        <label className={errorTxt ? 'error' : ''}>
          アカウント
          <InputText
            style={{ margin: '5px 0 0 0' }}
            value={txt}
            error={!!errorTxt}
            onChange={onChange}
          />
          {errorTxt && <p className="error-txt">{errorTxt}</p>}
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
