import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { State } from './modules/index'
import { onResize } from './modules/ui'
import Socket from './components/Socket'
import RouterListener from './components/RouterListener'

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
const url = `${protocol}//${window.location.host}/socket`

const App = () => {
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

  const Top = login
    ? lazy(() => import('./components/pages/Top'))
    : lazy(() => import('./components/pages/Login'))
  const Room = login
    ? lazy(() => import('./components/pages/Room'))
    : lazy(() => import('./components/pages/Login'))

  const PageSignup = lazy(() => import('./components/pages/Signup'))
  const PageTos = lazy(() => import('./components/pages/Tos'))
  const PagePrivacyPolicy = lazy(() =>
    import('./components/pages/PrivacyPolicy')
  )
  const LoginSuccess = lazy(() => import('./components/pages/LoginSuccess'))

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Route path="/" exact component={Top} />
        <Route path="/rooms" component={Room} />
        <Route path="/signup" component={PageSignup} />
        <Route path="/tos" component={PageTos} />
        <Route path="/privacy-policy" component={PagePrivacyPolicy} />
        <Route path="/login/success" component={LoginSuccess} />
      </Suspense>
      <RouterListener />
      <Socket url={url} />
    </Router>
  )
}
export default App
