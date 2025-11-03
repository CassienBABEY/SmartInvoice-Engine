/**
 * Composant TemplateForm
 * 
 * Génère un formulaire dynamique basé sur les champs d'un template.
 * Gère les différents types de champs (text, date, number, image).
 */
import React, { useState } from 'react';
import './TemplateForm.css';

// Types pour les champs
interface Field {
  name: string;
  type: string;
  has_currency: boolean;
}

interface TemplateFormProps {
  templateName: string;
  fields: Field[];
  onGenerate: (
    data: Record<string, string>, 
    currencies: Record<string, boolean>,
    filename?: string
  ) => void;
  loading: boolean;
}

function TemplateForm({ templateName, fields, onGenerate, loading }: TemplateFormProps) {
  // États pour stocker les valeurs du formulaire
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [currencies, setCurrencies] = useState<Record<string, boolean>>({});
  
  // États pour les images
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // État pour le nom du fichier de sortie
  const [outputFilename, setOutputFilename] = useState<string>(() => {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/[T:]/g, '_');
    return `invoice_${templateName}_${timestamp}`;
  });

  /**
   * Charge la liste des images disponibles au montage
   */
  React.useEffect(() => {
    loadAvailableImages();
  }, []);

  /**
   * Charge les images disponibles depuis l'API
   */
  const loadAvailableImages = async () => {
    try {
      const response = await fetch('http://localhost:8000/images');
      const data = await response.json();
      setAvailableImages(data.images);
    } catch (err) {
      console.error('Erreur chargement images:', err);
    }
  };

  /**
   * Gère le changement d'une valeur de champ
   */
  const handleChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  /**
   * Gère l'activation/désactivation de la devise pour un champ number
   */
  const handleCurrencyToggle = (fieldName: string) => {
    setCurrencies(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  /**
   * Soumet le formulaire
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData, currencies, outputFilename);
  };

  /**
   * Rend un champ selon son type
   */
  const renderField = (field: Field) => {
    const fieldName = field.name;
    const value = formData[fieldName] || '';

    // Champ IMAGE : sélecteur + upload
    if (field.type === 'image') {
      const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('http://localhost:8000/images/upload', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            // Recharger la liste des images
            await loadAvailableImages();
            // Sélectionner l'image uploadée
            handleChange(fieldName, data.filename);
          } else {
            alert('Erreur lors de l\'upload de l\'image');
          }
        } catch (err) {
          console.error('Erreur upload:', err);
          alert('Erreur lors de l\'upload de l\'image');
        } finally {
          setUploadingImage(false);
        }
      };

      return (
        <div key={fieldName} className="form-field">
          <label htmlFor={fieldName}>
            🖼️ {fieldName}
            <span className="field-type-badge">image</span>
          </label>
          
          <div className="image-field-group">
            {/* Sélecteur d'images disponibles */}
            <select
              value={value}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className="form-select"
            >
              <option value="">-- Sélectionnez une image --</option>
              {availableImages.map(img => (
                <option key={img} value={img}>{img}</option>
              ))}
            </select>

            {/* Bouton upload nouvelle image */}
            <label className="btn-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                style={{ display: 'none' }}
              />
              {uploadingImage ? '⏳ Upload...' : '📤 Ajouter une image'}
            </label>
          </div>
          
          <small className="field-help">
            Sélectionnez une image existante ou ajoutez-en une nouvelle
          </small>
        </div>
      );
    }

    // Champ DATE : input avec auto-formatage et validation DD/MM/YYYY
    if (field.type === 'date') {
      // Validation de la date
      const isValidDate = (dateStr: string): boolean => {
        if (dateStr.length !== 10) return true; // En cours de saisie
        
        const parts = dateStr.split('/');
        if (parts.length !== 3) return false;
        
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        
        // Vérifications de base
        if (month < 1 || month > 12) return false;
        if (day < 1) return false;
        
        // Jours max par mois
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        // Année bissextile
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        if (isLeapYear) daysInMonth[1] = 29;
        
        if (day > daysInMonth[month - 1]) return false;
        
        return true;
      };

      const dateValid = isValidDate(value);

      return (
        <div key={fieldName} className="form-field">
          <label htmlFor={fieldName}>
            📅 {fieldName}
            <span className="field-type-badge">date</span>
          </label>
          <input
            id={fieldName}
            type="text"
            placeholder="JJ/MM/AAAA"
            value={value}
            onChange={(e) => {
              // Auto-formatage : ajoute les / automatiquement
              let input = e.target.value.replace(/\D/g, ''); // Garde uniquement les chiffres
              
              if (input.length >= 2) {
                input = input.slice(0, 2) + '/' + input.slice(2);
              }
              if (input.length >= 5) {
                input = input.slice(0, 5) + '/' + input.slice(5, 9);
              }
              
              handleChange(fieldName, input);
            }}
            maxLength={10}
            className={`form-input ${!dateValid ? 'form-input-error' : ''}`}
          />
          {value.length === 10 && !dateValid && (
            <small className="field-error">⚠️ Date invalide (ex: 30 février impossible)</small>
          )}
          {(!value || dateValid) && (
            <small className="field-help">Format: DD/MM/YYYY (auto-formaté)</small>
          )}
        </div>
      );
    }

    // Champ NUMBER : input numérique avec option devise
    if (field.type === 'number') {
      return (
        <div key={fieldName} className="form-field">
          <label htmlFor={fieldName}>
            🔢 {fieldName}
            <span className="field-type-badge">number</span>
          </label>
          
          <div className="number-field-group">
            <input
              id={fieldName}
              type="number"
              step="0.01"
              placeholder="0.00"
              value={value}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className="form-input"
            />
            
            <label className="currency-checkbox">
              <input
                type="checkbox"
                checked={currencies[fieldName] || false}
                onChange={() => handleCurrencyToggle(fieldName)}
              />
              <span>Afficher devise (€)</span>
            </label>
          </div>
        </div>
      );
    }

    // Champ TEXT : input texte simple (par défaut)
    return (
      <div key={fieldName} className="form-field">
        <label htmlFor={fieldName}>
          📝 {fieldName}
          <span className="field-type-badge">text</span>
        </label>
        <input
          id={fieldName}
          type="text"
          placeholder={`Entrez ${fieldName}`}
          value={value}
          onChange={(e) => handleChange(fieldName, e.target.value)}
          className="form-input"
        />
      </div>
    );
  };

  return (
    <div className="template-form">
      <h3>Formulaire : {templateName}</h3>
      <p className="form-description">
        Remplissez les champs ci-dessous pour générer votre facture
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-fields">
          {fields.map(field => renderField(field))}
        </div>

        {/* Nom du fichier de sortie */}
        <div className="form-section-divider">
          <h4>📄 Nom de la facture</h4>
          <div className="form-field">
            <label htmlFor="output-filename">
              Nom du fichier
            </label>
            <input
              id="output-filename"
              type="text"
              value={outputFilename}
              onChange={(e) => setOutputFilename(e.target.value)}
              className="form-input"
              placeholder="invoice_example_2025"
            />
            <small className="field-help">
              Le fichier sera sauvegardé comme : <code>{outputFilename}.docx</code>
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary btn-large"
          >
            {loading ? '⏳ Génération en cours...' : '🔨 Générer la facture'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TemplateForm;

