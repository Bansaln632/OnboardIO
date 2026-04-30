import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useToast } from '../../context/ToastContext';

function DocumentReviewSection() {
  const { showSuccess, showError, showWarning } = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, PENDING, APPROVED, REJECTED

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/documents/uploaded');
      setDocuments(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setError(err?.response?.data?.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (doc) => {
    if (!confirm(`Approve "${doc.documentName}" for ${doc.username}?`)) return;

    try {
      setActionLoading({ ...actionLoading, [doc.id]: true });
      await api.put(`/api/admin/documents/${doc.id}/approve`);
      showSuccess('Document approved successfully!');
      await fetchDocuments();
    } catch (err) {
      console.error('Failed to approve document:', err);
      showError(err?.response?.data?.message || 'Failed to approve document');
    } finally {
      setActionLoading({ ...actionLoading, [doc.id]: false });
    }
  };

  const handleReject = async (doc) => {
    setShowRejectModal(doc);
    setRejectionReason('');
  };

  const submitRejection = async () => {
    if (!rejectionReason.trim()) {
      showWarning('Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading({ ...actionLoading, [showRejectModal.id]: true });
      await api.put(`/api/admin/documents/${showRejectModal.id}/reject`, null, {
        params: { reason: rejectionReason }
      });
      showSuccess('Document rejected successfully!');
      setShowRejectModal(null);
      setRejectionReason('');
      await fetchDocuments();
    } catch (err) {
      console.error('Failed to reject document:', err);
      showError(err?.response?.data?.message || 'Failed to reject document');
    } finally {
      setActionLoading({ ...actionLoading, [showRejectModal.id]: false });
    }
  };

  const handleDownload = async (doc) => {
    try {
      const response = await api.get(`/api/admin/documents/download/${doc.id}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download document:', err);
      showError('Failed to download document');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (filterStatus === 'ALL') return true;
    return doc.approvalStatus === filterStatus;
  });

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'badge badge-warning',
      APPROVED: 'badge badge-success',
      REJECTED: 'badge badge-error'
    };
    return badges[status] || 'badge';
  };

  const getTypeBadge = (type) => {
    return type === 'MANDATORY' ? 'badge badge-error' : 'badge badge-info';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Document Review</h2>
        <p className="text-gray-600 text-sm">
          Review and approve/reject documents uploaded by employees
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 border-b-2 border-gray-200">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 font-medium transition-colors ${
              filterStatus === status
                ? 'text-primary-600 border-b-3 border-primary-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status} ({documents.filter(d => status === 'ALL' || d.approvalStatus === status).length})
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-error-light border border-error text-error-dark rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="spinner"></div>
          <span className="ml-3 text-gray-600">Loading documents...</span>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No documents found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  File Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Uploaded At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{doc.username || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{doc.userEmail || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{doc.documentName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getTypeBadge(doc.documentType)}>
                      {doc.documentType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{doc.fileName}</div>
                    <div className="text-xs text-gray-500">{formatFileSize(doc.fileSize)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{formatDate(doc.uploadedAt)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(doc.approvalStatus)}>
                      {doc.approvalStatus}
                    </span>
                    {doc.approvalStatus === 'REJECTED' && doc.rejectionReason && (
                      <div className="text-xs text-error-dark mt-1" title={doc.rejectionReason}>
                        Reason: {doc.rejectionReason.substring(0, 30)}
                        {doc.rejectionReason.length > 30 && '...'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="btn btn-primary text-sm"
                        title="Download"
                      >
                        ⬇ Download
                      </button>

                      {doc.approvalStatus === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(doc)}
                            disabled={actionLoading[doc.id]}
                            className="btn btn-success text-sm"
                            title="Approve"
                          >
                            {actionLoading[doc.id] ? '⏳' : '✓ Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(doc)}
                            disabled={actionLoading[doc.id]}
                            className="btn btn-error text-sm"
                            title="Reject"
                          >
                            {actionLoading[doc.id] ? '⏳' : '✕ Reject'}
                          </button>
                        </>
                      )}

                      {doc.approvalStatus === 'REJECTED' && (
                        <button
                          onClick={() => handleApprove(doc)}
                          disabled={actionLoading[doc.id]}
                          className="btn btn-success text-sm"
                          title="Re-approve"
                        >
                          {actionLoading[doc.id] ? '⏳' : '✓ Re-approve'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Reject Document</h3>
            <p className="text-sm text-gray-600 mb-4">
              Document: <strong>{showRejectModal.documentName}</strong><br />
              Employee: <strong>{showRejectModal.username}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this document is being rejected..."
                className="input-field w-full h-24"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={submitRejection}
                disabled={!rejectionReason.trim() || actionLoading[showRejectModal.id]}
                className="btn btn-error flex-1"
              >
                {actionLoading[showRejectModal.id] ? 'Rejecting...' : 'Reject Document'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectionReason('');
                }}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentReviewSection;
