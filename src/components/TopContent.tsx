import React from 'react'
import styled from 'styled-components'
import Link from './atoms/Link'

const recommended = ['要望室', 'test']

const TopContent = () => {
  return (
    <Wrap>
      <div className="content">
        <div className="recommended">
          <div className="inner">
            <h2>おすすめ部屋</h2>
            <div className="rooms">
              {recommended.map((e) => (
                <div className="room" key={e}>
                  <Link to={`/rooms/${e}`}>{e}</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Wrap>
  )
}
export default TopContent

const Wrap = styled.div`
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
        margin-top: 8px;
        &:first-child {
          margin-top: 0;
        }
        a {
          font-size: 20px;
          border: solid 1px var(--color-link);
          border-radius: 2px;
          padding: 4px 8px;
        }
      }
    }
  }
`
