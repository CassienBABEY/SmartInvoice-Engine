/**
 * Étape 3 : Preview et téléchargement
 */
import { useState, useEffect } from 'react';
import './PreviewStep.css';

const API_URL = 'http://localhost:8000';

interface PreviewStepProps {
  filename: string;
  onBack: () => void;
  onReset: () => void;
}

function PreviewStep({ filename, onBack, onReset }: PreviewStepProps) {
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    loadMetadata();
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [filename]);

  const loadMetadata = async () => {
    try {
      const response = await fetch(`${API_URL}/invoices`);
      if (response.ok) {
        const data = await response.json();
        const invoice = data.invoices.find((inv: any) => inv.filename === filename);
        setMetadata(invoice);
      }
    } catch (err) {
      console.error('Erreur chargement métadonnées:', err);
    }
  };

  const handleDownload = () => {
    window.open(`${API_URL}/invoices/download/${filename}`, '_blank');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="preview-step">
      <h2 className="section-title">Aperçu et téléchargement</h2>

      <div className="preview-container">
        {loading && (
          <div className="preview-loading">
            <div className="spinner"></div>
            <p>Génération de la preview PDF...</p>
          </div>
        )}
        <iframe
          src={`${API_URL}/invoices/preview/${filename}`}
          title="Aperçu de la facture"
          className="preview-iframe"
          onLoad={() => setLoading(false)}
        />
      </div>

      {metadata && (
        <div className="metadata">
          <div className="metadata-item">
            <span className="metadata-label">Fichier</span>
            <span className="metadata-value">{filename}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Taille</span>
            <span className="metadata-value">{formatFileSize(metadata.size)}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Généré le</span>
            <span className="metadata-value">{new Date(metadata.created).toLocaleString('fr-FR')}</span>
          </div>
        </div>
      )}

      <div className="preview-actions">
        <button onClick={onBack} className="btn btn-secondary">
          Retour
        </button>
        <div className="preview-actions-right">
          <button onClick={handleDownload} className="btn btn-primary">
            Télécharger Word
          </button>
          <button onClick={onReset} className="btn btn-secondary">
            Nouvelle facture
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreviewStep;

