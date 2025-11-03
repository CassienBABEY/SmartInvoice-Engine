/**
 * Composant InvoiceModal
 * 
 * Modal pour prévisualiser une facture et la télécharger.
 */
import { useEffect, useState, type MouseEvent } from 'react';
import './InvoiceModal.css';

interface Invoice {
  filename: string;
  size: number;
  created: string;
  modified: string;
}

interface InvoiceModalProps {
  invoice: Invoice;
  onClose: () => void;
}

function InvoiceModal({ invoice, onClose }: InvoiceModalProps) {
  const [loading, setLoading] = useState(true); // Pour le chargement de l'iframe

  useEffect(() => {
    // Simule la fin du chargement une fois que l'iframe est prêt
    const timer = setTimeout(() => setLoading(false), 1000); // Délai pour l'iframe
    return () => clearTimeout(timer);
  }, []);

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Télécharge la facture
   */
  const handleDownload = () => {
    const url = `http://localhost:8000/invoices/download/${invoice.filename}`;
    window.open(url, '_blank');
  };

  /**
   * Ferme le modal en cliquant sur le backdrop
   */
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h2>📄 {invoice.filename}</h2>
          <button onClick={onClose} className="modal-close">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Preview PDF */}
          <div className="pdf-preview-container">
            {loading && (
              <div className="preview-loading">
                <div className="spinner"></div>
                <p>Génération de la preview PDF...</p>
              </div>
            )}
            <iframe
              src={`http://localhost:8000/invoices/preview/${invoice.filename}`}
              title="Aperçu de la facture"
              className="pdf-iframe"
              onLoad={() => setLoading(false)}
            />
          </div>
          
          {/* Métadonnées */}
          <div className="invoice-details">
            <div className="detail-item">
              <span className="detail-label">📦 Taille :</span>
              <span className="detail-value">{formatFileSize(invoice.size)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">📅 Créée le :</span>
              <span className="detail-value">{formatDate(invoice.created)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">🕐 Modifiée le :</span>
              <span className="detail-value">{formatDate(invoice.modified)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Fermer
          </button>
          <button onClick={handleDownload} className="btn btn-primary">
            ⬇️ Télécharger
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceModal;

