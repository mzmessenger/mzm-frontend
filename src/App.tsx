import React, { useMemo } from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from './modules/index'
import { State } from './modules/index.types'
import PageTop from './components/PageTop'
import PageRoom from './components/PageRoom'

const Wrap = styled.div`
  background-color: #202225;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 240px;
  grid-template-rows: 1fr;
  grid-template-areas: 'body right';
`

const Login = () => {
  return (
    <div>
      <a href="/auth/twitter">twitterでログイン</a>
    </div>
  )
}

const App: React.FC<{
  login: boolean,
  getMyInfo: ReturnType<typeof actions.getMyInfo>
}> = ({ login, getMyInfo }) => {
  useMemo(() => {
    getMyInfo()
  }, [])

  const Top = login ? PageTop : Login
  const Room = login ? PageRoom : Login

  return (
    <Wrap>
      <Router>
        <Route path="/" exact component={Top} />
        <Route path="/rooms" component={Room} />
      </Router>
    </Wrap>
  )
}

export default connect(
  (state: State) => ({ login: state.login }),
  dispatch => {
    return {
      getMyInfo: actions.getMyInfo(dispatch)
    }
  }
)(App)
