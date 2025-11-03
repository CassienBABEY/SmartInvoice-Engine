/**
 * Page FACTURES - Liste des factures avec preview au clic
 */
import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import InvoiceModal from '../components/InvoiceModal';
import './FacturesPage.css';

const API_URL = 'http://localhost:8000';

interface Invoice {
  filename: string;
  size: number;
  created: string;
  modified: string;
}

interface FacturesPageProps {
  onNavigate?: (page: string) => void;
}

function FacturesPage({ onNavigate }: FacturesPageProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const response = await fetch(`${API_URL}/invoices`);
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.invoices);
      }
    } catch (err) {
      console.error('Erreur chargement factures:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const handleDelete = async (
    e: React.MouseEvent,
    filename: string
  ) => {
    e.stopPropagation();
    if (!confirm(`Supprimer la facture "${filename}" ?`)) return;

    try {
      const response = await fetch(`${API_URL}/invoices/${filename}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadInvoices();
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (err) {
      alert('Erreur lors de la suppression de la facture');
    }
  };

  return (
    <div className="factures-page">
      <Breadcrumb
        items={[
          {
            label: 'Home',
            onClick: () => onNavigate && onNavigate('home'),
          },
          {
            label: 'Factures',
            icon: (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5l-3-3z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            ),
          },
        ]}
      />

      <div className="page-header">
        <button
          onClick={loadInvoices}
          className="btn btn-icon"
          title="Actualiser"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.65 2.35C12.2 0.9 10.21 0 8 0 3.58 0 0.01 3.58 0.01 8C0.01 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="page-loading">Chargement...</div>
      ) : invoices.length === 0 ? (
        <div className="page-empty">Aucune facture générée</div>
      ) : (
        <div className="invoices-list">
          {invoices.map((invoice) => (
            <div key={invoice.filename} className="invoice-item">
              <div
                className="invoice-info"
                onClick={() => setSelectedInvoice(invoice)}
              >
                <h3 className="invoice-name">{invoice.filename}</h3>
                <div className="invoice-meta">
                  <span>{formatFileSize(invoice.size)}</span>
                  <span>•</span>
                  <span>{formatDate(invoice.modified)}</span>
                </div>
              </div>
              <div className="invoice-actions">
                <button
                  onClick={() => setSelectedInvoice(invoice)}
                  className="btn-icon"
                  title="Aperçu"
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 3C4.5 3 1.5 5.5 1 8c.5 2.5 3.5 5 7 5s6.5-2.5 7-5c-.5-2.5-3.5-5-7-5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <circle
                      cx="8"
                      cy="8"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => handleDelete(e, invoice.filename)}
                  className="btn-icon btn-icon-danger"
                  title="Supprimer"
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 4l8 8M12 4l-8 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}

export default FacturesPage;

