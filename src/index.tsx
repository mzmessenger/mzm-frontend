import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import 'normalize.css'
import 'highlight.js/styles/androidstudio.css'
import './index.css'
import { store } from './modules/index'
import App from './App'

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
