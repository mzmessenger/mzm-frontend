import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { State } from './modules/index.types'
import { onResize } from './modules/index.action'
import Login from './components/pages/Login'
import PageTop from './components/pages/Top'
import PageRoom from './components/pages/Room'
import PageSignup from './components/pages/Signup'
import PageTos from './components/pages/Tos'
import LoginSuccess from './components/pages/LoginSuccess'
import RouterListener from './components/RouterListener'

function App() {
  const login = useSelector((state: State) => state.login)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(onResize(window.innerWidth, window.innerHeight))

    const handleResize = () =>
      dispatch(onResize(window.innerWidth, window.innerHeight))

    window.addEventListener('resize', handleResize)

    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)

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
      <Route path="/login/success" component={LoginSuccess} />
      <RouterListener />
    </Router>
  )
}

export default App
