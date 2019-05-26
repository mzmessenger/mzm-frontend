import React, { useMemo } from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { getMyInfo } from './modules/index.action'
import { State } from './modules/index.types'
import PageTop from './components/PageTop'
import PageRoom from './components/PageRoom'
import RouterListener from './components/RouterListener'

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

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

const App: React.FC<Props> = ({ login, getMyInfo }) => {
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
        <RouterListener />
      </Router>
    </Wrap>
  )
}

function mapStateToProps(state: State) {
  return {
    login: state.login,
    currentRoom: state.currentRoom
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getMyInfo: () => getMyInfo()(dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
