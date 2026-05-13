import { useState } from 'react';
import { getRoleFromToken } from '../auth/authService';
import TasksSection from '../components/activities/TasksSection';
import TrainingsSection from '../components/activities/TrainingsSection';
import DocumentsSection from '../components/activities/DocumentsSection';
import HRAssignmentSection from '../components/activities/HRAssignmentSection';
import DocumentReviewSection from '../components/activities/DocumentReviewSection';

function ActivitiesSimple() {
  const [activeTab, setActiveTab] = useState('tasks');
  const tokenRole = getRoleFromToken();
  const isAdmin = tokenRole === 'ROLE_ADMIN';

  const tabs = [
    { id: 'tasks', label: 'Tasks', icon: '📋', component: TasksSection, color: 'from-blue-500 to-cyan-500' },
    { id: 'trainings', label: 'Trainings', icon: '📚', component: TrainingsSection, color: 'from-purple-500 to-pink-500' },
    { id: 'documents', label: 'Documents', icon: '📄', component: DocumentsSection, color: 'from-green-500 to-emerald-500' },
  ];

  if (isAdmin) {
    tabs.push(
      {
        id: 'documentReview',
        label: 'Document Review',
        icon: '✅',
        component: DocumentReviewSection,
        color: 'from-orange-500 to-red-500'
      },
      {
        id: 'hr',
        label: 'HR Assignment',
        icon: '👥',
        component: HRAssignmentSection,
        color: 'from-indigo-500 to-purple-500'
      }
    );
  }

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;
  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl shadow-strong">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-purple-600 to-pink-500"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          </div>
          <div className="relative p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <span className="text-4xl">⚡</span>
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold">Activities</h1>
                <p className="text-xl opacity-90 mt-1">
                  {isAdmin
                    ? 'Manage tasks, trainings, and documents'
                    : 'View and complete your assigned activities'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs Navigation */}
        <div className="card bg-white p-2">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 min-w-[140px] px-6 py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-3
                  ${activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Tab Content Card */}
        <div className="card bg-white shadow-medium animate-fade-in">
          {/* Tab Header */}
          <div className={`bg-gradient-to-r ${activeTabData?.color} rounded-t-xl p-6 -mt-6 -mx-6 mb-6`}>
            <div className="flex items-center gap-3 text-white">
              <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <span className="text-2xl">{activeTabData?.icon}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{activeTabData?.label}</h2>
                <p className="text-sm opacity-90">Manage your {activeTabData?.label.toLowerCase()}</p>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {ActiveComponent && <ActiveComponent isAdmin={isAdmin} />}
        </div>
      </div>
    </div>
  );
}

export default ActivitiesSimple;
