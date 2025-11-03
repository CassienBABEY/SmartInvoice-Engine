/**
 * Page TEMPLATES - Gestion des templates
 */
import { useState, useEffect, useRef } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import './TemplatesPage.css';

const API_URL = 'http://localhost:8000';

interface TemplatesPageProps {
  onNavigate?: (page: string, templateName?: string) => void;
}

function TemplatesPage({ onNavigate }: TemplatesPageProps) {
  const [templates, setTemplates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch(`${API_URL}/templates`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
      }
    } catch (err) {
      console.error('Erreur chargement templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUse = (template: string) => {
    if (onNavigate) {
      onNavigate('generate', template);
    }
  };

  const handleDelete = async (template: string) => {
    if (!confirm(`Supprimer le template "${template}" ?`)) return;

    try {
      const response = await fetch(`${API_URL}/templates/${template}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadTemplates();
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (err) {
      alert('Erreur lors de la suppression du template');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.docx')) {
      alert('Veuillez sélectionner un fichier DOCX');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/templates/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await loadTemplates();
      } else {
        throw new Error('Erreur lors de l\'upload');
      }
    } catch (err) {
      alert('Erreur lors de l\'upload du template');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="templates-page">
      <Breadcrumb
        items={[
          {
            label: 'Home',
            onClick: () => onNavigate && onNavigate('home'),
          },
          {
            label: 'Templates',
            icon: (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6l-4-4z"
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
          className="btn btn-primary btn-icon-text"
          onClick={triggerFileInput}
          disabled={uploading}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 2v12M2 8h12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {uploading ? 'Upload...' : 'Nouveau'}
        </button>
      </div>

      {loading ? (
        <div className="page-loading">Chargement...</div>
      ) : (
        <div className="templates-grid">
          {templates.map((template) => (
            <div key={template} className="template-card-large">
              <h3 className="card-title">{template}</h3>
              <div className="card-actions">
                <button
                  onClick={() => handleUse(template)}
                  className="btn-icon btn-icon-primary"
                  title="Utiliser"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M13 4L6 11l-3-3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(template)}
                  className="btn-icon btn-icon-danger"
                  title="Supprimer"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
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

      <input
        ref={fileInputRef}
        type="file"
        accept=".docx"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default TemplatesPage;

