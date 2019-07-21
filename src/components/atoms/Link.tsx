import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'

const Link = styled(RouterLink)`
  text-decoration: none;
  a {
    color: var(--color-link);
  }
`

export default Link
