import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { State } from './modules/index'
import { onResize } from './modules/ui'
import Socket from './components/Socket'
import Login from './components/pages/Login'
import PageTop from './components/pages/Top'
import PageRoom from './components/pages/Room'
import PageSignup from './components/pages/Signup'
import PageTos from './components/pages/Tos'
import PagePrivacyPolicy from './components/pages/PrivacyPolicy'
import LoginSuccess from './components/pages/LoginSuccess'
import RouterListener from './components/RouterListener'

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
const url = `${protocol}//${window.location.host}/socket`

export default function App() {
  const login = useSelector((state: State) => state.user.login)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(onResize(window.innerWidth, window.innerHeight))

    const handleResize = () => {
      dispatch(onResize(window.innerWidth, window.innerHeight))
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const Top = login ? PageTop : Login
  const Room = login ? PageRoom : Login

  return (
    <Router>
      <Route path="/" exact component={Top} />
      <Route path="/rooms" component={Room} />
      <Route path="/signup" component={PageSignup} />
      <Route path="/tos" component={PageTos} />
      <Route path="/privacy-policy" component={PagePrivacyPolicy} />
      <Route path="/login/success" component={LoginSuccess} />
      <RouterListener />
      <Socket url={url} />
    </Router>
  )
}
