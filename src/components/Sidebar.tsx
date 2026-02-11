import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getToken, clearToken } from '../api/client';
import { SearchBar } from './SearchBar';

const navLinkClass =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200';
const navLinkActive = 'bg-[var(--accent)]/15 text-[var(--accent)]';
const navLinkInactive = 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)] hover:scale-[1.02]';

const iconClass = 'shrink-0 w-5 h-5';

function IconDashboard() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconInvoicing() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function IconAppointments() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconCallAgent() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconVideoCreator() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m22 8-6 4 6 4V8Z" />
      <rect x="2" y="4" width="14" height="16" rx="2" ry="2" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconHelp() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconLogin() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}

function IconSignUp() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

const MAIN_NAV = [
  { path: '/', label: 'Dashboard', Icon: IconDashboard },
  { path: '/email', label: 'Email Sender', Icon: IconEmail },
  { path: '/invoicing', label: 'Invoicing', Icon: IconInvoicing },
  { path: '/appointments', label: 'Appointments', Icon: IconAppointments },
  { path: '/call-agent', label: 'Call Agent', Icon: IconCallAgent },
  { path: '/video-creator', label: 'Video Creator', Icon: IconVideoCreator },
] as const;

const UTILITY_NAV = [
  { path: '/settings', label: 'Settings', Icon: IconSettings },
  { path: '/help', label: 'Help', Icon: IconHelp },
] as const;

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = getToken();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    clearToken();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[var(--border)] bg-[var(--bg-card)]"
      style={{ width: 'var(--sidebar-width)' }}
    >
      {/* Brand: WeA with accent on A */}
      <div className="flex h-16 items-center justify-center border-b border-[var(--border)] px-4">
        <span className="text-xl font-bold tracking-tight">
          <span className="text-[var(--text-primary)]">We</span>
          <span className="text-[var(--accent)]">A</span>
        </span>
      </div>

      {/* Search */}
      {token && <SearchBar />}

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {token ? (
          <>
            {MAIN_NAV.map(({ path, label, Icon }) => (
              <Link
                key={path}
                to={path}
                className={`${navLinkClass} ${isActive(path) ? navLinkActive : navLinkInactive}`}
              >
                <Icon />
                {label}
              </Link>
            ))}
            <div className="my-2 border-t border-[var(--border)]" />
            {UTILITY_NAV.map(({ path, label, Icon }) => (
              <Link
                key={path}
                to={path}
                className={`${navLinkClass} ${isActive(path) ? navLinkActive : navLinkInactive}`}
              >
                <Icon />
                {label}
              </Link>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className={`${navLinkClass} mt-auto w-full text-left ${navLinkInactive}`}
            >
              <IconLogout />
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`${navLinkClass} ${isActive('/login') ? navLinkActive : navLinkInactive}`}
            >
              <IconLogin />
              Log in
            </Link>
            <Link
              to="/register"
              className={`${navLinkClass} ${isActive('/register') ? navLinkActive : navLinkInactive}`}
            >
              <IconSignUp />
              Sign up
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
