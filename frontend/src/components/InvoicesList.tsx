/**
 * Composant InvoicesList
 * 
 * Affiche la liste des factures générées avec leurs métadonnées.
 */
import { useState, useEffect } from 'react';
import './InvoicesList.css';
import InvoiceModal from './InvoiceModal';

interface Invoice {
  filename: string;
  size: number;
  created: string;
  modified: string;
}

function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  /**
   * Charge la liste des factures au montage
   */
  useEffect(() => {
    loadInvoices();
  }, []);

  /**
   * Charge les factures depuis l'API
   */
  const loadInvoices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/invoices');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setInvoices(data.invoices);
    } catch (err) {
      setError(`Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formate la taille du fichier
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  /**
   * Formate la date
   */
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="invoices-list">
        <h2>📋 Factures générées</h2>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="invoices-list">
      <div className="invoices-header">
        <h2>📋 Factures générées</h2>
        <button onClick={loadInvoices} className="btn btn-secondary btn-small">
          🔄 Actualiser
        </button>
      </div>

      {error && (
        <div className="message error">
          ✗ {error}
        </div>
      )}

      {invoices.length === 0 ? (
        <p className="empty-state">Aucune facture générée pour le moment</p>
      ) : (
        <>
          <p className="invoices-count">
            {invoices.length} facture{invoices.length > 1 ? 's' : ''}
          </p>
          
          <div className="invoices-grid">
            {invoices.map((invoice) => (
              <div 
                key={invoice.filename} 
                className="invoice-card"
                onClick={() => setSelectedInvoice(invoice)}
              >
                <div className="invoice-icon">📄</div>
                <div className="invoice-info">
                  <h3 className="invoice-filename">{invoice.filename}</h3>
                  <div className="invoice-meta">
                    <span>📦 {formatFileSize(invoice.size)}</span>
                    <span>🕐 {formatDate(invoice.modified)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal de preview */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}

export default InvoicesList;

