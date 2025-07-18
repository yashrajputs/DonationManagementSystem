import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import AuthForm from './components/Auth/AuthForm';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './components/Dashboard/Dashboard';
import CampaignManagement from './components/Campaigns/CampaignManagement';
import DonationProcessing from './components/Donations/DonationProcessing';
import Reports from './components/Reports/Reports';
import Donors from "./components/Donors/Donors";
import Settings from "./components/Settings/Settings";

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
        return <Donors />;
      case 'settings':
        return <Settings />;
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
    <MainLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </MainLayout>
  );
};
export default AppContent;
