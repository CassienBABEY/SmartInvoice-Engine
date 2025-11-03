/**
 * Étape 2 : Formulaire avec hiérarchie intelligente
 */
import { useState, useEffect } from 'react';
import './FormStep.css';

const API_URL = 'http://localhost:8000';

interface Field {
  name: string;
  type: string;
  has_currency: boolean;
}

interface Template {
  name: string;
  fields: Field[];
}

interface FormStepProps {
  template: Template;
  onSubmit: (data: Record<string, string>, currencies: Record<string, boolean>, filename: string) => void;
  onBack: () => void;
}

function FormStep({ template, onSubmit, onBack }: FormStepProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [currencies, setCurrencies] = useState<Record<string, boolean>>({});
  const [filename, setFilename] = useState('');
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['text']));
  const [rememberedFields, setRememberedFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Générer le nom par défaut
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/[T:]/g, '_');
    setFilename(`invoice_${template.name}_${timestamp}`);
    
    // Charger les images et les valeurs par défaut
    loadImages();
    loadDefaults();
  }, [template.name]);

  const loadImages = async () => {
    try {
      const response = await fetch(`${API_URL}/images`);
      if (response.ok) {
        const data = await response.json();
        setAvailableImages(data.images);
      }
    } catch (err) {
      console.error('Erreur chargement images:', err);
    }
  };

  const loadDefaults = async () => {
    try {
      const response = await fetch(`${API_URL}/defaults/${template.name}`);
      if (response.ok) {
        const data = await response.json();
        const defaults = data.defaults || {};
        
        const newFormData: Record<string, string> = {};
        const newRemembered: Record<string, boolean> = {};
        
        Object.entries(defaults).forEach(([fieldName, fieldData]: [string, any]) => {
          if (fieldData.remember && fieldData.value) {
            newFormData[fieldName] = fieldData.value;
            newRemembered[fieldName] = true;
          }
        });
        
        setFormData(newFormData);
        setRememberedFields(newRemembered);
      }
    } catch (err) {
      console.error('Erreur chargement valeurs par défaut:', err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await fetch(`${API_URL}/images/upload`, {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        await loadImages(); // Recharger la liste
        // Sélectionner automatiquement la nouvelle image
        setFormData({ ...formData, [Object.keys(formData)[0]]: data.filename });
      }
    } catch (err) {
      alert('Erreur lors de l\'upload de l\'image');
    }
  };

  // Grouper les champs par type
  const fieldsByType = {
    text: template.fields.filter(f => f.type === 'text'),
    date: template.fields.filter(f => f.type === 'date'),
    number: template.fields.filter(f => f.type === 'number'),
    image: template.fields.filter(f => f.type === 'image'),
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, currencies, filename);
  };

  const toggleRememberField = async (fieldName: string) => {
    const newRemembered = !rememberedFields[fieldName];
    const fieldValue = formData[fieldName] || '';

    setRememberedFields({ ...rememberedFields, [fieldName]: newRemembered });

    try {
      await fetch(`${API_URL}/defaults/${template.name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field_name: fieldName,
          value: fieldValue,
          remember: newRemembered,
        }),
      });
    } catch (err) {
      console.error('Erreur sauvegarde valeur par défaut:', err);
    }
  };

  const handleFieldChange = async (fieldName: string, value: string) => {
    setFormData({ ...formData, [fieldName]: value });

    if (rememberedFields[fieldName]) {
      try {
        await fetch(`${API_URL}/defaults/${template.name}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            field_name: fieldName,
            value: value,
            remember: true,
          }),
        });
      } catch (err) {
        console.error('Erreur mise à jour valeur par défaut:', err);
      }
    }
  };

  const handleDateChange = (fieldName: string, value: string) => {
    let formatted = value.replace(/[^\d]/g, '');
    
    if (formatted.length >= 2) {
      formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
    }
    if (formatted.length >= 5) {
      formatted = formatted.slice(0, 5) + '/' + formatted.slice(5, 9);
    }

    handleFieldChange(fieldName, formatted);
  };

  const isValidDate = (dateStr: string): boolean => {
    if (dateStr.length !== 10) return false;
    
    const [day, month, year] = dateStr.split('/').map(Number);
    
    if (!day || !month || !year) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;
    
    const daysInMonth = new Date(year, month, 0).getDate();
    return day <= daysInMonth;
  };

  const renderField = (field: Field) => {
    const value = formData[field.name] || '';
    const isRemembered = rememberedFields[field.name] || false;

    if (field.type === 'image') {
      return (
        <div key={field.name} className="form-field">
          <div className="field-header">
            <label>{field.name}</label>
            <button
              type="button"
              className={`remember-btn ${isRemembered ? 'active' : ''}`}
              onClick={() => toggleRememberField(field.name)}
              title={isRemembered ? 'Ne plus mémoriser' : 'Mémoriser la valeur'}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                {isRemembered ? (
                  <path d="M12 7V5a4 4 0 00-8 0v2H3a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1zM5 5a3 3 0 016 0v2H5V5z" fill="currentColor"/>
                ) : (
                  <>
                    <path d="M12 7V5a4 4 0 00-8 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <rect x="2" y="7" width="12" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </>
                )}
              </svg>
            </button>
          </div>
          <div className="image-upload-group">
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="form-input"
            >
              <option value="">Sélectionnez une image</option>
              {availableImages.map((img) => (
                <option key={img} value={img}>{img}</option>
              ))}
            </select>
            <label className="btn-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 10v3.333A1.667 1.667 0 0112.333 15H3.667A1.667 1.667 0 012 13.333V10M11.333 5.333L8 2M8 2L4.667 5.333M8 2v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </label>
          </div>
        </div>
      );
    }

    if (field.type === 'number') {
      return (
        <div key={field.name} className="form-field">
          <div className="field-header">
            <label>{field.name}</label>
            <button
              type="button"
              className={`remember-btn ${isRemembered ? 'active' : ''}`}
              onClick={() => toggleRememberField(field.name)}
              title={isRemembered ? 'Ne plus mémoriser' : 'Mémoriser la valeur'}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                {isRemembered ? (
                  <path d="M12 7V5a4 4 0 00-8 0v2H3a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1zM5 5a3 3 0 016 0v2H5V5z" fill="currentColor"/>
                ) : (
                  <>
                    <path d="M12 7V5a4 4 0 00-8 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <rect x="2" y="7" width="12" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </>
                )}
              </svg>
            </button>
          </div>
          <div className="number-field-group">
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="form-input"
            />
            {field.has_currency && (
              <label className="currency-checkbox">
                <input
                  type="checkbox"
                  checked={currencies[field.name] || false}
                  onChange={(e) => setCurrencies({ ...currencies, [field.name]: e.target.checked })}
                />
                Devise
              </label>
            )}
          </div>
        </div>
      );
    }

    if (field.type === 'date') {
      return (
        <div key={field.name} className="form-field">
          <div className="field-header">
            <label>{field.name}</label>
            <button
              type="button"
              className={`remember-btn ${isRemembered ? 'active' : ''}`}
              onClick={() => toggleRememberField(field.name)}
              title={isRemembered ? 'Ne plus mémoriser' : 'Mémoriser la valeur'}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                {isRemembered ? (
                  <path d="M12 7V5a4 4 0 00-8 0v2H3a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1zM5 5a3 3 0 016 0v2H5V5z" fill="currentColor"/>
                ) : (
                  <>
                    <path d="M12 7V5a4 4 0 00-8 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <rect x="2" y="7" width="12" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </>
                )}
              </svg>
            </button>
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => handleDateChange(field.name, e.target.value)}
            placeholder="DD/MM/YYYY"
            maxLength={10}
            className={`form-input ${value && !isValidDate(value) ? 'input-error' : ''}`}
          />
          {value && !isValidDate(value) && (
            <span className="input-error-text">Date invalide</span>
          )}
        </div>
      );
    }

    return (
      <div key={field.name} className="form-field">
        <div className="field-header">
          <label>{field.name}</label>
          <button
            type="button"
            className={`remember-btn ${isRemembered ? 'active' : ''}`}
            onClick={() => toggleRememberField(field.name)}
              title={isRemembered ? 'Ne plus mémoriser' : 'Mémoriser la valeur'}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                {isRemembered ? (
                  <path d="M12 7V5a4 4 0 00-8 0v2H3a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1zM5 5a3 3 0 016 0v2H5V5z" fill="currentColor"/>
                ) : (
                  <>
                    <path d="M12 7V5a4 4 0 00-8 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <rect x="2" y="7" width="12" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        <input
          type="text"
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          className="form-input"
        />
      </div>
    );
  };

  return (
    <form className="form-step" onSubmit={handleSubmit}>
      <h2 className="section-title">Remplissez le formulaire</h2>

      {/* Nom de la facture (important, en premier) */}
      <div className="filename-section">
        <label className="filename-label">Nom de la facture</label>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="form-input filename-input"
        />
      </div>

      {/* Sections par type */}
      <div className="form-sections">
        {Object.entries(fieldsByType).map(([type, fields]) => {
          if (fields.length === 0) return null;

          const isExpanded = expandedSections.has(type);
          const typeLabels: Record<string, string> = {
            text: 'Informations textuelles',
            date: 'Dates',
            number: 'Montants',
            image: 'Images',
          };

          return (
            <div key={type} className="form-section">
              <button
                type="button"
                className="section-toggle"
                onClick={() => toggleSection(type)}
              >
                <span className="section-toggle-title">
                  {typeLabels[type]} ({fields.length})
                </span>
                <span className="section-toggle-icon">{isExpanded ? '▼' : '▶'}</span>
              </button>

              {isExpanded && (
                <div className="section-content">
                  {fields.map(renderField)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="button" onClick={onBack} className="btn btn-secondary">
          Retour
        </button>
        <button type="submit" className="btn btn-primary">
          Générer
        </button>
      </div>
    </form>
  );
}

export default FormStep;

