/**
 * Étape 1 : Sélection du template
 */
import { useState, useEffect, useRef } from 'react';
import './TemplateSelector.css';

const API_URL = 'http://localhost:8000';

interface Template {
  name: string;
  fields: Array<{
    name: string;
    type: string;
    has_currency: boolean;
  }>;
}

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
}

function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch(`${API_URL}/templates`);
      if (!response.ok) throw new Error('Erreur de chargement');
      const data = await response.json();
      setTemplates(data.templates);
    } catch (err) {
      setError('Impossible de charger les templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (templateName: string) => {
    try {
      const response = await fetch(`${API_URL}/forms/${templateName}`);
      if (!response.ok) throw new Error('Erreur');
      const data = await response.json();
      onSelect({
        name: data.template_name,
        fields: data.fields,
      });
    } catch (err) {
      alert('Erreur lors du chargement du template');
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
        alert('Template uploadé avec succès');
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

  if (loading) {
    return (
      <div className="template-selector-loading">
        Chargement des templates...
      </div>
    );
  }

  if (error) {
    return <div className="template-selector-error">{error}</div>;
  }

  return (
    <div className="template-selector">
      <h2 className="section-title">Sélectionnez un template</h2>
      
      <div className="templates-grid">
        {templates.map((template) => (
          <button
            key={template}
            className="template-card"
            onClick={() => handleSelect(template)}
          >
            <div className="template-name">{template}</div>
          </button>
        ))}

        <button
          className="template-card template-card-new"
          onClick={triggerFileInput}
          disabled={uploading}
        >
          <div className="template-name">
            {uploading ? 'Upload en cours...' : 'Nouveau template'}
          </div>
        </button>
      </div>

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

export default TemplateSelector;

