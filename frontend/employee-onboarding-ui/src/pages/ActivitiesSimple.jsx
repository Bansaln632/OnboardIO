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
    { id: 'tasks', label: '📋 Tasks', component: TasksSection },
    { id: 'trainings', label: '📚 Trainings', component: TrainingsSection },
    { id: 'documents', label: '📄 Documents', component: DocumentsSection },
  ];

  if (isAdmin) {
    tabs.push(
      {
        id: 'documentReview',
        label: '✅ Document Review',
        component: DocumentReviewSection
      },
      {
        id: 'hr',
        label: '👥 HR Assignment',
        component: HRAssignmentSection
      }
    );
  }

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Activities
        </h1>
        <p className="text-gray-600">
          {isAdmin
            ? 'Manage tasks, trainings, and documents'
            : 'View and complete your assigned activities'}
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b-2 border-gray-200 mb-6">
        <nav className="flex gap-2 -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 text-sm font-medium border-b-3 transition-all duration-200
                ${activeTab === tab.id
                  ? 'text-primary-600 border-b-3 border-primary-500'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-soft animate-fade-in">
        {ActiveComponent && <ActiveComponent isAdmin={isAdmin} />}
      </div>
    </div>
  );
}

export default ActivitiesSimple;
