/**
 * Sidebar avec navigation principale
 */
import './Sidebar.css';

interface SidebarProps {
  currentPage?: string;
  onNavigate?: (page: string, templateName?: string) => void;
}

function Sidebar({ currentPage = 'generate', onNavigate }: SidebarProps) {
  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.png" alt="Logo" className="sidebar-logo" />
        <h1 className="sidebar-title">SmartInvoice</h1>
        <span className="sidebar-version">v0.2.0</span>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => handleNavigation('home')}
        >
          <svg className="nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 6l6-4 6 4v7a1 1 0 01-1 1H3a1 1 0 01-1-1V6z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M6 14V9h4v5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
          <span className="nav-label">HOME</span>
        </button>

        <button
          className={`nav-btn ${currentPage === 'generate' ? 'active' : ''}`}
          onClick={() => handleNavigation('generate')}
        >
          <svg className="nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6l-4-4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M9 2v4h4M8 8h3M8 11h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="nav-label">GENERATE</span>
        </button>

        <button
          className={`nav-btn ${currentPage === 'templates' ? 'active' : ''}`}
          onClick={() => handleNavigation('templates')}
        >
          <svg className="nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6l-4-4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M9 2v4h4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
          <span className="nav-label">TEMPLATES</span>
        </button>

        <button
          className={`nav-btn ${currentPage === 'factures' ? 'active' : ''}`}
          onClick={() => handleNavigation('factures')}
        >
          <svg className="nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5l-3-3z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M6 7h4M6 9h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="nav-label">FACTURES</span>
        </button>

        <button
          className={`nav-btn ${currentPage === 'params' ? 'active' : ''}`}
          onClick={() => handleNavigation('params')}
        >
          <svg className="nav-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M8 1v2M8 13v2M15 8h-2M3 8H1M12.5 3.5l-1.4 1.4M4.9 11.1l-1.4 1.4M12.5 12.5l-1.4-1.4M4.9 4.9L3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="nav-label">PARAMS</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;

