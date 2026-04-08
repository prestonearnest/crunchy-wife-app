import { Outlet, NavLink } from 'react-router-dom'
import { FiHome, FiShoppingBag, FiMail, FiEdit3, FiBookOpen } from 'react-icons/fi'
import './Layout.css'

const navItems = [
  { to: '/', icon: FiHome, label: 'Home' },
  { to: '/shop', icon: FiShoppingBag, label: 'Shop' },
  { to: '/newsletter', icon: FiMail, label: 'Newsletter' },
  { to: '/stories', icon: FiBookOpen, label: 'Stories' },
  { to: '/submit', icon: FiEdit3, label: 'Submit' },
]

export default function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <span className="header-leaf">🌿</span>
          <h1 className="header-title">The Crunchy Wife</h1>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={to === '/'}
          >
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
