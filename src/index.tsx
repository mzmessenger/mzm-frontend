import React from 'react'
import ReactDom from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import 'normalize.css'
import './index.css'
import { reducer } from './modules/index'
import Socket from './components/Socket'
import App from './App'

export const store = createStore(reducer)

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'

const url = `${protocol}//${window.location.host}/socket`

ReactDom.render(
  <Provider store={store}>
    <App />
    <Socket url={url} />
  </Provider>,
  document.getElementById('root')
)
