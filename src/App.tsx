import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { State } from './modules/index.types'
import Login from './components/pages/Login'
import PageTop from './components/pages/Top'
import PageRoom from './components/pages/Room'
import PageSignup from './components/pages/Signup'
import PageTos from './components/pages/Tos'
import LoginSuccess from './components/pages/LoginSuccess'
import RouterListener from './components/RouterListener'

function App() {
  const login = useSelector((state: State) => state.login)

  const Top = login ? PageTop : Login
  const Room = login ? PageRoom : Login

  return (
    <Router>
      <Route path="/" exact component={Top} />
      <Route path="/rooms" component={Room} />
      <Route path="/signup" component={PageSignup} />
      <Route path="/tos" component={PageTos} />
      <Route path="/login/success" component={LoginSuccess} />
      <RouterListener />
    </Router>
  )
}

export default App
