// A custom 404 page
import { Link } from 'react-router-dom'

import './style.css'

const NotFoundPage = () => {
  return (
    <div>
      <h1 style={{ color: 'red', fontSize: 100 }}>404</h1>
      <h3>Page Not Found</h3>
      <p>
        <Link to="/">Go Home</Link>
      </p>
    </div>
  )
}

export default NotFoundPage
