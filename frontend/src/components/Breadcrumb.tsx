/**
 * Breadcrumb - Fil d'Ariane pour la navigation
 */
import './Breadcrumb.css';

interface BreadcrumbProps {
  items: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
  }>;
}

function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb">
      <button className="breadcrumb-home" onClick={items[0]?.onClick}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 6l6-4 6 4v7a1 1 0 01-1 1H3a1 1 0 01-1-1V6z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M6 14V9h4v5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </button>

      {items.map((item, index) => (
        <div key={index} className="breadcrumb-item">
          <span className="breadcrumb-separator">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <button
            className={`breadcrumb-link ${index === items.length - 1 ? 'active' : ''}`}
            onClick={item.onClick}
            disabled={!item.onClick}
          >
            {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
            {item.label}
          </button>
        </div>
      ))}
    </nav>
  );
}

export default Breadcrumb;

