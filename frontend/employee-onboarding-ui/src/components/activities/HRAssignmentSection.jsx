import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

function HRAssignmentSection() {
  const [onboardings, setOnboardings] = useState([]);
  const [hrs, setHrs] = useState([]);
  const [loadingOnboardings, setLoadingOnboardings] = useState(false);
  const [loadingHrs, setLoadingHrs] = useState(false);
  const [error, setError] = useState(null);
  const [selectedHr, setSelectedHr] = useState({});
  const [history, setHistory] = useState({});
  const [showHistoryFor, setShowHistoryFor] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchOnboardings();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const showSuccess = (msg) => setToast({ type: 'success', message: msg });
  const showError = (msg) => setToast({ type: 'error', message: msg });

  const setAction = (id, patch) =>
    setActionLoading((s) => ({ ...s, [id]: { ...(s[id] || {}), ...patch } }));

  const fetchOnboardings = async () => {
    setError(null);
    setLoadingOnboardings(true);
    try {
      const res = await api.get('/api/admin/onboarding');
      const data = res.data || [];
      setOnboardings(data);

      const initial = {};
      data.forEach((o) => {
        const hrId = o.assignedHrId;
        if (hrId) initial[o.id] = hrId;
      });
      setSelectedHr(initial);
      fetchHrs();
    } catch (err) {
      const m = err?.response?.data?.message || err.message || 'Failed to load onboardings';
      setError(m);
      showError(m);
    } finally {
      setLoadingOnboardings(false);
    }
  };

  const fetchHrs = async () => {
    setLoadingHrs(true);
    try {
      const res = await api.get('/api/admin/onboarding/users');
      setHrs(res.data || []);
    } catch (err) {
      showError('Failed to load HRs');
    } finally {
      setLoadingHrs(false);
    }
  };

  const assignHr = async (onboardingId) => {
    const hrId = selectedHr[onboardingId];
    if (!hrId) {
      showError('Select an HR before assigning');
      return;
    }

    try {
      setAction(onboardingId, { assigning: true });
      await api.put(`/api/admin/onboarding/${onboardingId}/assign-hr`, null, {
        params: { hrId, performedBy: 'admin_ui' },
      });
      showSuccess('HR assigned successfully');
      await fetchOnboardings();
      await fetchHistory(onboardingId);
    } catch (err) {
      showError(err?.response?.data?.message || 'Failed to assign HR');
    } finally {
      setAction(onboardingId, { assigning: false });
    }
  };

  const unassignHr = async (onboardingId) => {
    if (!window.confirm('Unassign HR?')) return;

    try {
      setAction(onboardingId, { unassigning: true });
      await api.put(`/api/admin/onboarding/${onboardingId}/unassign-hr`, null, {
        params: { performedBy: 'admin_ui' },
      });
      showSuccess('HR unassigned successfully');
      await fetchOnboardings();
      await fetchHistory(onboardingId);
    } catch (err) {
      showError(err?.response?.data?.message || 'Failed to unassign HR');
    } finally {
      setAction(onboardingId, { unassigning: false });
    }
  };

  const fetchHistory = async (onboardingId) => {
    try {
      setAction(onboardingId, { historyLoading: true });
      const res = await api.get(`/api/admin/onboarding/${onboardingId}/assignment-history`);
      setHistory((s) => ({ ...s, [onboardingId]: res.data || [] }));
    } catch (err) {
      showError('Failed to load history');
    } finally {
      setAction(onboardingId, { historyLoading: false });
    }
  };

  const toggleHistory = (onboardingId) => {
    if (showHistoryFor === onboardingId) {
      setShowHistoryFor(null);
    } else {
      setShowHistoryFor(onboardingId);
      if (!history[onboardingId]) fetchHistory(onboardingId);
    }
  };

  return (
    <div className="p-6">
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '90px',
            right: '20px',
            padding: '12px 20px',
            color: '#fff',
            background: toast.type === 'success' ? '#28a745' : '#dc3545',
            borderRadius: '6px',
            zIndex: 1000,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">HR Assignment</h2>
        <p className="text-gray-600 text-sm">
          Assign HR representatives to employee onboarding processes
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-error-light border border-error text-error-dark rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loadingOnboardings ? (
        <div className="flex items-center justify-center py-12">
          <div className="spinner"></div>
          <span className="ml-3 text-gray-600">Loading employees...</span>
        </div>
      ) : onboardings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No employees onboarding.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {onboardings.map((o) => (
            <div
              key={o.id}
              className="card card-hover"
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Employee Info Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                {/* Left: Employee Details */}
                <div style={{ flex: 1 }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {o.employeeUsername || '(none)'}
                  </h3>
                  <div className="flex gap-6 text-sm text-gray-600">
                    <span>
                      Status: <strong className="text-gray-800">{o.status}</strong>
                    </span>
                    <span>
                      Progress: <strong className="text-gray-800">{o.progress}%</strong>
                    </span>
                    <span>
                      HR: <strong className="text-gray-800">{o.assignedHrUsername || 'Unassigned'}</strong>
                    </span>
                  </div>
                </div>

                {/* Right: HR Actions */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* HR Selector */}
                  <select
                    value={selectedHr[o.id] || ''}
                    onChange={(e) =>
                      setSelectedHr((s) => ({
                        ...s,
                        [o.id]: Number(e.target.value),
                      }))
                    }
                    className="input-field"
                    style={{ minWidth: '220px' }}
                    disabled={loadingHrs}
                  >
                    <option value="">Select HR</option>
                    {hrs.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.username} ({h.email})
                      </option>
                    ))}
                  </select>

                  {/* Action Buttons */}
                  <button
                    onClick={() => assignHr(o.id)}
                    disabled={actionLoading[o.id]?.assigning}
                    className="btn btn-success text-sm whitespace-nowrap"
                  >
                    {actionLoading[o.id]?.assigning ? '⏳ Assigning...' : '✓ Assign HR'}
                  </button>

                  {o.assignedHrId && (
                    <button
                      onClick={() => unassignHr(o.id)}
                      disabled={actionLoading[o.id]?.unassigning}
                      className="btn btn-error text-sm whitespace-nowrap"
                    >
                      {actionLoading[o.id]?.unassigning ? '⏳ Unassigning...' : '✕ Unassign'}
                    </button>
                  )}

                  <button
                    onClick={() => toggleHistory(o.id)}
                    className="btn btn-primary text-sm whitespace-nowrap"
                  >
                    📜 History
                  </button>
                </div>
              </div>

              {/* History Section */}
              {showHistoryFor === o.id && (
                <div
                  style={{
                    marginTop: '8px',
                    paddingTop: '16px',
                    borderTop: '1px solid #e5e7eb',
                  }}
                >
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Assignment History</h4>
                  {actionLoading[o.id]?.historyLoading ? (
                    <div className="text-sm text-gray-500">Loading history...</div>
                  ) : history[o.id]?.length === 0 ? (
                    <div className="text-sm text-gray-500">No assignment history.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {history[o.id]?.map((h, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '8px 12px',
                            background: '#f9fafb',
                            borderRadius: '6px',
                            fontSize: '13px',
                            color: '#4b5563',
                          }}
                        >
                          <strong>{h.hrName}</strong> - {h.action} on {h.actionDate}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HRAssignmentSection;
