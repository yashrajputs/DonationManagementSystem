import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import AuthForm from './components/Auth/AuthForm';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import CampaignManagement from './components/Campaigns/CampaignManagement';
import DonationProcessing from './components/Donations/DonationProcessing';
import Reports from './components/Reports/Reports';

const AppContent = () => {
  const { state, dispatch } = useApp();  // add dispatch here
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'campaigns':
        return <CampaignManagement />;
      case 'donations':
        return <DonationProcessing />;
      case 'reports':
        return <Reports />;
      case 'donors':
        return <div className="p-8">Donors page coming soon...</div>;
      case 'settings':
        return <div className="p-8">Settings page coming soon...</div>;
      default:
        return <Dashboard />;
    }
  };

  if (!state.currentUser) {
    // <<<--- PASS onAuth to AuthForm, which will set user in context ---->>>
    return (
      <AuthForm
        onAuth={user => dispatch({ type: 'SET_USER', payload: user })}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1 ml-64 pt-16">
          <div className="p-8">
            {renderPage()}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AppContent;
