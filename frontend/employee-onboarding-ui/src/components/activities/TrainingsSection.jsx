import { useState, useEffect } from 'react';
import { useTrainings } from '../../hooks';
import { userService } from '../../services';
import { ensureUrlProtocol } from '../../utils/helpers';

function TrainingsSection({ isAdmin }) {
  const { trainings, loading, startTraining, assignTraining, deleteTraining } = useTrainings(isAdmin);
  const [showForm, setShowForm] = useState(false);
  const [trainingName, setTrainingName] = useState('');
  const [trainingContent, setTrainingContent] = useState('');
  const [trainingAssignUserId, setTrainingAssignUserId] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const res = await userService.getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleAssignTraining = async () => {
    if (!trainingName.trim() || !trainingContent.trim() || !trainingAssignUserId) {
      return;
    }
    await assignTraining(trainingAssignUserId, trainingName, trainingContent);
    setTrainingName('');
    setTrainingContent('');
    setTrainingAssignUserId('');
    setShowForm(false);
  };

  const handleStartTraining = async (training) => {
    if (training.content) {
      const url = ensureUrlProtocol(training.content);
      window.open(url, '_blank');
      await startTraining(training.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
        <span className="ml-3 text-gray-600">Loading trainings...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Trainings</h2>
        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cancel' : '+ Add Training'}
          </button>
        )}
      </div>

      {/* Add Training Form */}
      {showForm && isAdmin && (
        <div className="bg-gray-50 rounded-lg p-5 mb-6 space-y-3 animate-fade-in">
          <input
            type="text"
            placeholder="Training name"
            value={trainingName}
            onChange={(e) => setTrainingName(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Training URL/Link"
            value={trainingContent}
            onChange={(e) => setTrainingContent(e.target.value)}
            className="form-input"
          />
          <select
            value={trainingAssignUserId}
            onChange={(e) => setTrainingAssignUserId(e.target.value)}
            className="form-input"
          >
            <option value="">Select user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
          <button
            onClick={handleAssignTraining}
            className="btn btn-success w-full"
            disabled={!trainingName.trim() || !trainingContent.trim() || !trainingAssignUserId}
          >
            Assign Training
          </button>
        </div>
      )}

      {/* Training List */}
      <div className="space-y-3">
        {trainings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              {isAdmin ? 'No trainings created yet' : 'No trainings assigned to you'}
            </p>
          </div>
        ) : (
          trainings.map(training => (
            <TrainingCard
              key={training.id}
              training={training}
              isAdmin={isAdmin}
              onStart={handleStartTraining}
              onDelete={deleteTraining}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TrainingCard({ training, isAdmin, onStart, onDelete }) {
  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {training.name}
          </h3>
          {isAdmin && training.employeeUsername && (
            <p className="text-sm text-gray-600 mb-2">
              Assigned to: <span className="font-medium">{training.employeeUsername}</span>
            </p>
          )}
          {training.content && (
            <p className="text-sm text-gray-600 mb-2 flex items-center">
              <span className="mr-2">📎</span>
              <a
                href={ensureUrlProtocol(training.content)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600 underline"
              >
                View Training Material
              </a>
            </p>
          )}
          <span
            className={`badge ${
              training.completed ? 'badge-success' : 'badge-warning'
            }`}
          >
            {training.completed ? '✓ Completed' : '○ Pending'}
          </span>
        </div>
        <div className="flex gap-2 ml-4">
          {!isAdmin && !training.completed && training.content && (
            <button
              onClick={() => onStart(training)}
              className="btn btn-primary text-sm whitespace-nowrap"
            >
              Start Training
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => onDelete(training.id)}
              className="btn btn-error text-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrainingsSection;
