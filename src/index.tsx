import React from 'react'
import ReactDom from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import 'normalize.css'
import './index.css'
import { reducer } from './modules/index'
import App from './App'
import Socket from './Socket'

export const store = createStore(reducer)

ReactDom.render(
  <Provider store={store}>
    <App />
    <Socket url={'ws://localhost/socket'} />
  </Provider>,
  document.getElementById('root')
)
