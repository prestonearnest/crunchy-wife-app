import { Outlet, NavLink, useLocation } from 'react-router-dom'
import './Layout.css'

const LeafIcon = ({ size = 18, color = '#1a1a1a' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5C7 21 9.5 22 12 22c5.5 0 10-4.5 10-10" />
    <path d="M12 2c3 3 4.5 7 4.5 10" />
    <path d="M12 2v10" />
  </svg>
)

const HomeIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const SearchIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const BookOpenIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

const MailIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const PlusIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const BellIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const navItems = [
  { to: '/', icon: HomeIcon, label: 'Home' },
  { to: '/shop', icon: SearchIcon, label: 'Shop' },
  { to: '/submit', icon: PlusIcon, label: 'Post', isFab: true },
  { to: '/stories', icon: BookOpenIcon, label: 'Stories' },
  { to: '/newsletter', icon: MailIcon, label: 'Newsletter' },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <div className="header-logo">
              <span className="header-logo-leaf"><LeafIcon size={18} color="#1a1a1a" /></span>
            </div>
            <h1 className="header-title">Crunchy Wife Community</h1>
          </div>
          <div className="header-right">
            <button className="header-icon-btn" aria-label="Search">
              <SearchIcon size={20} />
            </button>
            <button className="header-icon-btn" aria-label="Notifications">
              <BellIcon size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {navItems.map(({ to, icon: Icon, label, isFab }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''} ${isFab ? 'nav-fab-wrapper' : ''}`
              }
              end={to === '/'}
            >
              {isFab ? (
                <div className="nav-fab">
                  <Icon size={24} />
                </div>
              ) : (
                <>
                  <Icon size={22} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
