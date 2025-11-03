/**
 * Page PARAMS - Paramètres et informations système
 */
import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import './ParamsPage.css';

const API_URL = 'http://localhost:8000';

interface ParamsPageProps {
  onNavigate?: (page: string) => void;
}

function ParamsPage({ onNavigate }: ParamsPageProps) {
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [stats, setStats] = useState({ invoices: 0, templates: 0 });

  useEffect(() => {
    checkApiStatus();
    loadStats();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/`);
      setApiStatus(response.ok ? 'connected' : 'disconnected');
    } catch {
      setApiStatus('disconnected');
    }
  };

  const loadStats = async () => {
    try {
      const [invoicesRes, templatesRes] = await Promise.all([
        fetch(`${API_URL}/invoices`),
        fetch(`${API_URL}/templates`),
      ]);

      if (invoicesRes.ok && templatesRes.ok) {
        const invoicesData = await invoicesRes.json();
        const templatesData = await templatesRes.json();
        setStats({
          invoices: invoicesData.count || 0,
          templates: templatesData.templates?.length || 0,
        });
      }
    } catch (err) {
      console.error('Erreur chargement stats:', err);
    }
  };

  return (
    <div className="params-page">
      <Breadcrumb
        items={[
          {
            label: 'Home',
            onClick: () => onNavigate && onNavigate('home'),
          },
          {
            label: 'Paramètres',
            icon: (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M8 1v2M8 13v2M15 8h-2M3 8H1M12.5 3.5l-1.4 1.4M4.9 11.1l-1.4 1.4M12.5 12.5l-1.4-1.4M4.9 4.9L3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ),
          },
        ]}
      />

      <div className="params-sections">
        <section className="param-section">
          <h2 className="param-section-title">API Backend</h2>
          <div className="param-item">
            <span className="param-label">Status</span>
            <span className={`param-value status-${apiStatus}`}>
              <span className="status-dot"></span>
              {apiStatus === 'connected' ? 'Connecté' : 'Déconnecté'}
            </span>
          </div>
          <div className="param-item">
            <span className="param-label">URL</span>
            <span className="param-value">{API_URL}</span>
          </div>
        </section>

        <section className="param-section">
          <h2 className="param-section-title">Application</h2>
          <div className="param-item">
            <span className="param-label">Version</span>
            <span className="param-value">0.2.0</span>
          </div>
        </section>

        <section className="param-section">
          <h2 className="param-section-title">Statistiques</h2>
          <div className="param-item">
            <span className="param-label">Factures générées</span>
            <span className="param-value">{stats.invoices}</span>
          </div>
          <div className="param-item">
            <span className="param-label">Templates disponibles</span>
            <span className="param-value">{stats.templates}</span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ParamsPage;

