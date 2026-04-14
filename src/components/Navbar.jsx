import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="navbar">
      <button
        className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}
        onClick={() => navigate('/')}
        title="Home"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
          <path d="M9 21V12h6v9"/>
        </svg>
      </button>

      <button
        className={`nav-btn ${location.pathname === '/sobre' ? 'active' : ''}`}
        onClick={() => navigate('/sobre')}
        title="Sobre mim"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
        <span>Sobre</span>
      </button>

      <button
        className={`nav-btn ${location.pathname === '/projetos' ? 'active' : ''}`}
        onClick={() => navigate('/projetos')}
        title="Projetos"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
        <span>Projetos</span>
      </button>
    </nav>
  )
}

export default Navbar
