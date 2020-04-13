import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import ImageIcon from '@material-ui/icons/Image'
import LinkOffIcon from '@material-ui/icons/LinkOff'
import TwitterIcon from '@material-ui/icons/Twitter'
import GitHubIcon from '@material-ui/icons/GitHub'
import { store } from '../../modules/index'
import { removeTwitter, removeGithub } from '../../modules/user'
import { State } from '../../modules/index'
import Button from '../atoms/Button'

export default function ShowAccount() {
  const dispatch = useDispatch()
  const twitter = useSelector((state: State) => state.user.me.twitterUserName)
  const github = useSelector((state: State) => state.user.me.githubUserName)

  const isTwitterLinked = !!twitter
  const isGithubLinked = !!github

  const onRemoveTwitter = () => {
    removeTwitter()(dispatch, store.getState)
  }

  const onRemoveGithub = () => {
    removeGithub()(dispatch, store.getState)
  }

  const twitterClassName = isGithubLinked
    ? 'login-account'
    : 'login-account lock'

  const githubClassName = isTwitterLinked
    ? 'login-account'
    : 'login-account lock'

  return (
    <Wrap>
      <header>ソーシャルログイン</header>
      <div className="accounts">
        <div className={twitterClassName}>
          <h4>Twitter</h4>
          {isTwitterLinked && (
            <a className="account-link" onClick={onRemoveTwitter}>
              <LinkOffIcon className="account-link-icon" />
              twitterログインを解除する
            </a>
          )}
          {!isTwitterLinked && (
            <a href="/auth/twitter" className="account-link">
              <TwitterIcon className="account-link-icon" />
              Twitterログイン
            </a>
          )}
        </div>
        <div className={githubClassName}>
          <h4>GitHub</h4>
          {isGithubLinked && (
            <a className="account-link" onClick={onRemoveGithub}>
              <LinkOffIcon className="account-link-icon" />
              GitHubログインを解除する
            </a>
          )}
          {!isGithubLinked && (
            <a href="/auth/github" className="account-link">
              <GitHubIcon className="account-link-icon" />
              GitHubログイン
            </a>
          )}
        </div>
      </div>
    </Wrap>
  )
}

const Wrap = styled.div`
  .accounts {
    margin-top: 4px;
    display: flex;
  }

  a {
    cursor: pointer;
  }
  .login-account.lock a {
    cursor: not-allowed;
  }

  .login-account {
    display: flex;
    flex-direction: column;
    margin: 0 0 0 1em;
  }
  .login-account:first-child {
    margin-left: 0;
  }

  .account-link {
    display: flex;
    align-items: center;
    padding: 0 10px 0 10px;
    font-size: 1rem;
    background-color: var(--color-guide);
    color: var(--color-on-guide);
    border-radius: 4px;
    height: 40px;
    margin: 0.5em 0 0 0;

    .account-link-icon {
      margin: 0 8px 0 0;
    }
  }
`
