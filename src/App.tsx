import React, { useMemo } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getMyInfo } from './modules/index.action'
import { State } from './modules/index.types'
import PageTop from './components/PageTop'
import PageRoom from './components/PageRoom'
import RouterListener from './components/RouterListener'

const Login = () => {
  return (
    <div>
      <a href="/auth/twitter">twitterでログイン</a>
    </div>
  )
}

function App() {
  const login = useSelector((state: State) => state.login)
  const dispatch = useDispatch()

  useMemo(() => {
    getMyInfo()(dispatch)
  }, [])

  const Top = login ? PageTop : Login
  const Room = login ? PageRoom : Login

  return (
    <Router>
      <Route path="/" exact component={Top} />
      <Route path="/rooms" component={Room} />
      <RouterListener />
    </Router>
  )
}

export default App
