import React from 'react'
import styled from 'styled-components'
import Home from '@material-ui/icons/Home'
import Body from '../atoms/Body'
import Menu from '../molecules/Menu'
import PageWrapper from '../PageWrapper'
import Header from '../Header'
import Link from '../atoms/Link'

const Wrap = styled.div`
  .content {
    flex: 1;
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

export default function Index() {
  return (
    <Wrap>
      <PageWrapper>
        <Header style={{ gridArea: 'header' }} />
        <Body>
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
          <Menu />
        </Body>
      </PageWrapper>
    </Wrap>
  )
}
