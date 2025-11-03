/**
 * SmartInvoice Engine - Application principale
 * Architecture avec navigation par pages
 */
import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import HomePage from './pages/HomePage';
import NewPage from './pages/NewPage';
import TemplatesPage from './pages/TemplatesPage';
import FacturesPage from './pages/FacturesPage';
import ParamsPage from './pages/ParamsPage';
import './styles/theme.css';
import './App.css';

export interface AppContextType {
  navigateTo: (page: string, templateName?: string) => void;
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [preselectedTemplate, setPreselectedTemplate] = useState<
    string | null
  >(null);

  const navigateTo = (page: string, templateName?: string) => {
    setCurrentPage(page);
    if (templateName) {
      setPreselectedTemplate(templateName);
    } else {
      setPreselectedTemplate(null);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'generate':
        return (
          <NewPage
            preselectedTemplate={preselectedTemplate}
            onTemplateUsed={() => setPreselectedTemplate(null)}
            onNavigate={navigateTo}
          />
        );
      case 'templates':
        return <TemplatesPage onNavigate={navigateTo} />;
      case 'factures':
        return <FacturesPage onNavigate={navigateTo} />;
      case 'params':
        return <ParamsPage onNavigate={navigateTo} />;
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} onNavigate={navigateTo} />
      <main className="content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;

