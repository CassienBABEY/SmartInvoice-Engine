/**
 * Page HOME - Dashboard avec accès rapide
 */
import { useState, useEffect } from 'react';
import './HomePage.css';

const API_URL = 'http://localhost:8000';

interface HomePageProps {
  onNavigate?: (page: string, templateName?: string) => void;
}

interface Template {
  name: string;
}

interface Invoice {
  filename: string;
  size: number;
  modified: string;
}

function HomePage({ onNavigate }: HomePageProps) {
  const [templates, setTemplates] = useState<string[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesRes, invoicesRes] = await Promise.all([
        fetch(`${API_URL}/templates`),
        fetch(`${API_URL}/invoices`),
      ]);

      if (templatesRes.ok) {
        const data = await templatesRes.json();
        setTemplates(data.templates.slice(0, 5));
      }

      if (invoicesRes.ok) {
        const data = await invoicesRes.json();
        setInvoices(data.invoices.slice(0, 5));
      }
    } catch (err) {
      console.error('Erreur chargement données:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const handleNavigate = (page: string, data?: string) => {
    if (onNavigate) {
      onNavigate(page, data);
    }
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="home-loading">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero section */}
      <div className="home-hero">
        <button
          className="generate-box"
          onClick={() => handleNavigate('generate')}
        >
          <div className="generate-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="generate-title">Générer une facture</h2>
          <p className="generate-subtitle">
            Créer une nouvelle facture depuis un template
          </p>
        </button>
      </div>

      {/* Templates récents */}
      <section className="home-section">
        <div className="section-header">
          <h3 className="section-title">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6l-4-4z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M9 2v4h4"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            Templates
          </h3>
          <button
            className="section-link"
            onClick={() => handleNavigate('templates')}
          >
            Voir tout →
          </button>
        </div>

        {templates.length === 0 ? (
          <div className="empty-state">Aucun template</div>
        ) : (
          <div className="horizontal-list">
            {templates.map((template) => (
              <button
                key={template}
                className="card-item"
                onClick={() => handleNavigate('generate', template)}
              >
                <div className="card-icon">
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6l-4-4z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </div>
                <div className="card-content">
                  <div className="card-name">{template}</div>
                  <div className="card-action">Utiliser</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Factures récentes */}
      <section className="home-section">
        <div className="section-header">
          <h3 className="section-title">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5l-3-3z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M6 8h4M6 10h3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Factures récentes
          </h3>
          <button
            className="section-link"
            onClick={() => handleNavigate('factures')}
          >
            Voir tout →
          </button>
        </div>

        {invoices.length === 0 ? (
          <div className="empty-state">Aucune facture</div>
        ) : (
          <div className="horizontal-list">
            {invoices.map((invoice) => (
              <button
                key={invoice.filename}
                className="card-item"
                onClick={() => handleNavigate('factures')}
              >
                <div className="card-icon">
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M10 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5l-3-3z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </div>
                <div className="card-content">
                  <div className="card-name">{invoice.filename}</div>
                  <div className="card-meta">{formatDate(invoice.modified)}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;

