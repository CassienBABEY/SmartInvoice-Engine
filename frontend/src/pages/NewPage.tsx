/**
 * Page GENERATE - Workflow de création de facture en 3 étapes
 */
import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import './NewPage.css';
import TemplateSelector from '../components/workflow/TemplateSelector';
import FormStep from '../components/workflow/FormStep';
import PreviewStep from '../components/workflow/PreviewStep';

const API_URL = 'http://localhost:8000';

interface Template {
  name: string;
  fields: Array<{
    name: string;
    type: string;
    has_currency: boolean;
  }>;
}

interface NewPageProps {
  preselectedTemplate?: string | null;
  onTemplateUsed?: () => void;
  onNavigate?: (page: string) => void;
}

function NewPage({
  preselectedTemplate,
  onTemplateUsed,
  onNavigate,
}: NewPageProps) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [generatedInvoice, setGeneratedInvoice] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (preselectedTemplate) {
      loadTemplate(preselectedTemplate);
    }
  }, [preselectedTemplate]);

  const loadTemplate = async (templateName: string) => {
    try {
      const response = await fetch(`${API_URL}/forms/${templateName}`);
      if (!response.ok) throw new Error('Erreur');
      const data = await response.json();
      setSelectedTemplate({
        name: data.template_name,
        fields: data.fields,
      });
      setStep(2);
      if (onTemplateUsed) {
        onTemplateUsed();
      }
    } catch (err) {
      alert('Erreur lors du chargement du template');
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setStep(2);
  };

  const handleFormSubmit = async (formData: Record<string, string>, currencies: Record<string, boolean>, filename: string) => {
    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_name: selectedTemplate?.name,
          form_data: formData,
          currency_fields: currencies,
          output_filename: filename,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la génération');

      const data = await response.json();
      setGeneratedInvoice(data.filename);
      setStep(3);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la génération de la facture');
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedTemplate(null);
    setGeneratedInvoice(null);
  };

  return (
    <div className="new-page">
      <Breadcrumb
        items={[
          {
            label: 'Home',
            onClick: () => onNavigate && onNavigate('home'),
          },
          {
            label: 'Générer',
            icon: (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            ),
          },
        ]}
      />

      {/* Progress indicator */}
      <div className="progress-bar">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Template</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Formulaire</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Preview</span>
        </div>
      </div>

      {/* Step content */}
      <div className="step-content">
        {step === 1 && <TemplateSelector onSelect={handleTemplateSelect} />}
        {step === 2 && selectedTemplate && (
          <FormStep
            template={selectedTemplate}
            onSubmit={handleFormSubmit}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && generatedInvoice && (
          <PreviewStep
            filename={generatedInvoice}
            onBack={() => setStep(2)}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default NewPage;

