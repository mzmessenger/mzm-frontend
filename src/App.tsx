import React from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Route } from 'react-router-dom'
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

function App() {
  return (
    <Wrap>
      <Router>
        <Route path="/" exact component={PageTop} />
        <Route path="/rooms" component={PageRoom} />
      </Router>
    </Wrap>
  )
}

export default App
