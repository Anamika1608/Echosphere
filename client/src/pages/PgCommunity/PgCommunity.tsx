import React, { useState } from 'react';
import type { PgCommunity } from '../../types/pgCommunity';
import PgCommunityDashboard from '../../app/components/PgCommunity/PgCommunityDashboard';
import PgCommunityResidents from '@/app/components/PgCommunity/PgCommunityResidents';
import CreatePgCommunityForm from '@/app/components/PgCommunity/CreatePgCommunityForm';
import EditPgCommunityForm from '@/app/components/PgCommunity/EditPgCommunityForm';

type AppView = 'dashboard' | 'create' | 'edit' | 'residents' ;

const PgCommunity: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedCommunity, setSelectedCommunity] = useState<PgCommunity | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setCurrentView('create');
    setSelectedCommunity(null);
  };

  const handleEditCommunity = (community: PgCommunity) => {
    setSelectedCommunity(community);
    setCurrentView('edit');
  };

  const handleViewResidents = (community: PgCommunity) => {
    setSelectedCommunity(community);
    setCurrentView('residents');
  };

  const handleSuccess = () => {
    setCurrentView('dashboard');
    setSelectedCommunity(null);
    setRefreshTrigger(prev => prev + 1); // Trigger dashboard refresh
  };

  const handleCancel = () => {
    setCurrentView('dashboard');
    setSelectedCommunity(null);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedCommunity(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">PG Management</h1>
              {currentView !== 'dashboard' && (
                <span className="text-gray-400">|</span>
              )}
              {currentView === 'create' && (
                <span className="text-gray-600">Create Community</span>
              )}
              {currentView === 'edit' && selectedCommunity && (
                <span className="text-gray-600">Edit {selectedCommunity.name}</span>
              )}
              {currentView === 'residents' && selectedCommunity && (
                <span className="text-gray-600">{selectedCommunity.name} - Residents</span>
              )}
              {currentView === 'stats' && selectedCommunity && (
                <span className="text-gray-600">{selectedCommunity.name} - Statistics</span>
              )}
            </div>
            
            {/* Breadcrumb Navigation */}
            {currentView !== 'dashboard' && (
              <button
                onClick={handleBackToDashboard}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ← Back to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <PgCommunityDashboard
            key={refreshTrigger}
            onCreateNew={handleCreateNew}
            onEditCommunity={handleEditCommunity}
            onViewResidents={handleViewResidents}
            onViewStats={handleViewStats}
          />
        )}

        {currentView === 'create' && (
          <CreatePgCommunityForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}

        {currentView === 'edit' && selectedCommunity && (
          <EditPgCommunityForm
            community={selectedCommunity}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}

        {currentView === 'residents' && selectedCommunity && (
          <PgCommunityResidents
            community={selectedCommunity}
            onBack={handleCancel}
          />
        )}

      </div>

    </div>
  );
};

export default PgCommunity;