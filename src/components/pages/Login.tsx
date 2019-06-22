import React from 'react'
import styled from 'styled-components'
import TwitterIcon from '../../assets/twitter-icon-blue.svg'
import Header from '../atoms/LoginHeader'
import Link from '../atoms/Link'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .login {
    color: var(--color-on-background);
    .button {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    a {
      height: 40px;
      padding: 0 14px 0 10px;
      font-size: 1rem;
      background-color: var(--color-guide);
      color: var(--color-on-guide);
      border-radius: 4px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .icon {
      width: 24px;
      height: 24px;
      background-size: contain;
      margin: 0 4px 0 0;
    }
    .twitter {
      .icon {
        background-image: url(${TwitterIcon});
      }
    }
  }

  .attention {
    max-width: 90vw;
    padding: 20px;
    background-color: var(--color-surface);
    color: var(--color-on-surface);
    margin: 40px 0 0 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .link {
    margin: 40px 0 0 0;
    background-color: var(--color-surface);
    a {
      color: var(--color-link);
    }
  }
`

function Login() {
  return (
    <Wrap>
      <Header />
      <div className="login">
        <h4>利用規約に同意してログイン。</h4>
        <div className="button">
          <a href="/auth/twitter" className="twitter">
            <figure className="icon" />
            Twitter
          </a>
        </div>
      </div>
      <div className="attention">
        <h2>注意事項</h2>
        <p>
          MZMはβリリース中です。エラーの発生や予告なくデータの削除等が発生する可能性があります。
        </p>
      </div>
      <div className="link">
        <Link to="/tos">利用規約</Link>
      </div>
    </Wrap>
  )
}

export default Login
