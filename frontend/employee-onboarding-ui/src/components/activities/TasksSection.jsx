import { useState, useEffect } from 'react';
import { useTasks } from '../../hooks';
import { userService } from '../../services';
import { SUCCESS_MESSAGES } from '../../constants';

function TasksSection({ isAdmin }) {
  const { tasks, loading, completeTask, assignTask, deleteTask } = useTasks(isAdmin);
  const [showForm, setShowForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [assignUserId, setAssignUserId] = useState('');
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

  const handleAssignTask = async () => {
    if (!taskTitle.trim() || !assignUserId) {
      return;
    }
    await assignTask(assignUserId, taskTitle);
    setTaskTitle('');
    setAssignUserId('');
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
        <span className="ml-3 text-gray-600">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cancel' : '+ Add Task'}
          </button>
        )}
      </div>

      {/* Add Task Form */}
      {showForm && isAdmin && (
        <div className="bg-gray-50 rounded-lg p-5 mb-6 space-y-3 animate-fade-in">
          <input
            type="text"
            placeholder="Task title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="form-input"
          />
          <select
            value={assignUserId}
            onChange={(e) => setAssignUserId(e.target.value)}
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
            onClick={handleAssignTask}
            className="btn btn-success w-full"
            disabled={!taskTitle.trim() || !assignUserId}
          >
            Assign Task
          </button>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              {isAdmin ? 'No tasks created yet' : 'No tasks assigned to you'}
            </p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              isAdmin={isAdmin}
              onComplete={completeTask}
              onDelete={deleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, isAdmin, onComplete, onDelete }) {
  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {task.title}
          </h3>
          {isAdmin && task.employeeUsername && (
            <p className="text-sm text-gray-600 mb-2">
              Assigned to: <span className="font-medium">{task.employeeUsername}</span>
            </p>
          )}
          <span
            className={`badge ${
              task.completed ? 'badge-success' : 'badge-warning'
            }`}
          >
            {task.completed ? '✓ Completed' : '○ Pending'}
          </span>
        </div>
        <div className="flex gap-2 ml-4">
          {!isAdmin && !task.completed && (
            <button
              onClick={() => onComplete(task.id)}
              className="btn btn-success text-sm"
            >
              Mark Complete
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => onDelete(task.id)}
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

export default TasksSection;

