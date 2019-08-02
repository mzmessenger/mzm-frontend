import React from 'react'
import styled from 'styled-components'
import Home from '@material-ui/icons/Home'
import Link from './atoms/Link'

const Content = styled.div`
  width: 100%;
  flex: 1;
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .recommended {
    min-width: 400px;
    display: flex;
    padding: 24px;
    .inner {
      width: 100%;
      padding: 8px 24px 24px 24px;
      background-color: var(--color-surface);
      color: var(--color-on-surface);
      .rooms {
        margin-top: 8px;
      }
      .room {
        display: flex;
        align-items: center;
        a {
          font-size: 24px;
          line-height: 20px;
        }
      }
    }
  }
`

const recommended = ['test']

export default function TopContent() {
  return (
    <Content>
      <div className="content">
        <div className="recommended">
          <div className="inner">
            <h2>おすすめ部屋</h2>
            <div className="rooms">
              {recommended.map(e => (
                <div className="room" key={e}>
                  <Home style={{ margin: '0 5px 0 0' }} />
                  <Link to={`/rooms/${e}`}>{e}</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
}
