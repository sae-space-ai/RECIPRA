import { useState } from 'react';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import OffersPage from './pages/OffersPage';
import WalletPage from './pages/WalletPage';
import ReferralsPage from './pages/ReferralsPage';
import ConversionsPage from './pages/ConversionsPage';
import AuditPage from './pages/AuditPage';
import ModulesPage from './pages/ModulesPage';
import GovernancePage from './pages/GovernancePage';
import SecurityPage from './pages/SecurityPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'offers': return <OffersPage />;
      case 'wallet': return <WalletPage />;
      case 'referrals': return <ReferralsPage />;
      case 'conversions': return <ConversionsPage />;
      case 'audit': return <AuditPage />;
      case 'modules': return <ModulesPage />;
      case 'governance': return <GovernancePage />;
      case 'security': return <SecurityPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}
