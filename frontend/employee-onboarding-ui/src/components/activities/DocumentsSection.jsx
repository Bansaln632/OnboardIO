import { useState, useEffect, useRef } from 'react';
import api from '../../api/axiosConfig';
import { useToast } from '../../context/ToastContext';

function DocumentsSection({ isAdmin }) {
  const { showSuccess, showError, showWarning } = useToast();
  const [documents, setDocuments] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]); // For admin: all document types
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({});
  const [error, setError] = useState(null);

  // Admin: Add document type form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('MANDATORY');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [isAdmin]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      if (isAdmin) {
        // Admin: Fetch document types
        const res = await api.get('/api/admin/documents');
        setDocumentTypes(res.data || []);
      } else {
        // User: Fetch their document upload status
        const res = await api.get('/api/user/documents');
        setDocuments(res.data || []);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setError(err?.response?.data?.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  // Admin: Create document type
  const handleCreateDocumentType = async (e) => {
    e.preventDefault();
    if (!newDocName.trim()) {
      showWarning('Please enter a document name');
      return;
    }

    try {
      setAdding(true);
      await api.post('/api/admin/documents', null, {
        params: {
          name: newDocName.trim(),
          type: newDocType
        }
      });

      showSuccess(`Document type "${newDocName}" created successfully!`);
      setNewDocName('');
      setNewDocType('MANDATORY');
      setShowAddForm(false);
      await fetchDocuments();
    } catch (err) {
      console.error('Failed to create document type:', err);
      showError(err?.response?.data?.message || 'Failed to create document type');
    } finally {
      setAdding(false);
    }
  };

  // Admin: Delete document type
  const handleDeleteDocumentType = async (documentId, documentName) => {
    if (!confirm(`Delete "${documentName}"?\n\nThis will also delete all user uploads for this document type.`)) {
      return;
    }

    try {
      await api.delete(`/api/admin/documents/${documentId}`);
      showSuccess(`Document type "${documentName}" deleted successfully!`);
      await fetchDocuments();
    } catch (err) {
      console.error('Failed to delete document type:', err);
      showError(err?.response?.data?.message || 'Failed to delete document type');
    }
  };

  // User: Upload document
  const handleUpload = async (documentId, file) => {
    if (!file) return;

    // Validate file size (5KB - 20MB)
    const minSize = 5 * 1024; // 5KB
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size < minSize) {
      showWarning('File is too small. Minimum size is 5KB.');
      return;
    }
    if (file.size > maxSize) {
      showWarning('File is too large. Maximum size is 20MB.');
      return;
    }

    try {
      setUploading({ ...uploading, [documentId]: true });
      const formData = new FormData();
      formData.append('file', file);

      await api.post(`/api/user/documents/upload/${documentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Refresh document list
      await fetchDocuments();
      showSuccess('Document uploaded successfully!');
    } catch (err) {
      console.error('Failed to upload document:', err);
      showError(err?.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading({ ...uploading, [documentId]: false });
    }
  };

  // User: Replace/Re-upload document (keeps the requirement, just replaces the file)
  const handleReplace = async (userDocumentId, file, isRejected) => {
    if (!file) return;

    // If document was rejected, confirm with user
    if (isRejected) {
      const confirmed = confirm(
        'Replace rejected document?\n\n' +
        'The new document will be uploaded and submitted for review again. ' +
        'The rejection reason will be cleared and approval status will be reset to "Awaiting Review".'
      );
      if (!confirmed) return;
    }

    // Validate file size (5KB - 20MB)
    const minSize = 5 * 1024; // 5KB
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size < minSize) {
      showWarning('File is too small. Minimum size is 5KB.');
      return;
    }
    if (file.size > maxSize) {
      showWarning('File is too large. Maximum size is 20MB.');
      return;
    }

    try {
      setUploading({ ...uploading, [`replace_${userDocumentId}`]: true });
      const formData = new FormData();
      formData.append('file', file);

      await api.post(`/api/user/documents/reupload/${userDocumentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Refresh document list
      await fetchDocuments();
      showSuccess(isRejected
        ? 'Document replaced successfully! It will be reviewed again.'
        : 'Document replaced successfully!'
      );
    } catch (err) {
      console.error('Failed to replace document:', err);
      showError(err?.response?.data?.message || 'Failed to replace document');
    } finally {
      setUploading({ ...uploading, [`replace_${userDocumentId}`]: false });
    }
  };

  const handleDownload = async (userDocumentId, fileName) => {
    try {
      const response = await api.get(`/api/user/documents/download/${userDocumentId}`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download document:', err);
      showError('Failed to download document');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
        <span className="ml-3 text-gray-600">Loading documents...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-error-light border border-error text-error-dark rounded-lg p-4 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isAdmin ? 'Document Types' : 'Upload Documents'}
          </h2>
          <p className="text-gray-600 text-sm">
            {isAdmin
              ? 'Manage document requirements for employee onboarding'
              : 'Upload required documents for your onboarding process'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
          >
            {showAddForm ? '✕ Cancel' : '➕ Add Document Type'}
          </button>
        )}
      </div>

      {/* Admin: Add Document Type Form */}
      {isAdmin && showAddForm && (
        <div className="card mb-6 bg-blue-50 border-blue-200">
          <form onSubmit={handleCreateDocumentType}>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Create New Document Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Name *
                </label>
                <input
                  type="text"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g., ID Proof, Address Proof, Resume"
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value)}
                  className="input-field w-full"
                >
                  <option value="MANDATORY">Mandatory</option>
                  <option value="OPTIONAL">Optional</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={adding}
                className="btn btn-success"
              >
                {adding ? 'Creating...' : '✓ Create Document Type'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewDocName('');
                  setNewDocType('MANDATORY');
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Document List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner"></div>
            <span className="ml-3 text-gray-600">Loading documents...</span>
          </div>
        ) : error ? (
          <div className="bg-error-light border border-error text-error-dark rounded-lg p-4 text-center">
            {error}
          </div>
        ) : isAdmin ? (
          // Admin view: Show document types
          documentTypes.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No document types created yet</p>
              <p className="text-sm text-gray-400 mt-2">Click "Add Document Type" to create one</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Document Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {documentTypes.map((docType) => (
                    <tr key={docType.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{docType.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`badge ${
                            docType.documentType === 'MANDATORY' ? 'badge-error' : 'badge-warning'
                          }`}
                        >
                          {docType.documentType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleDeleteDocumentType(docType.id, docType.name)}
                          className="btn btn-error text-sm"
                          title="Delete document type"
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          // User view: Show upload status
          documents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No documents required at this time</p>
            </div>
          ) : (
            documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                isAdmin={isAdmin}
                uploading={uploading[doc.documentId]}
                replacingUploading={uploading[`replace_${doc.id}`]}
                onUpload={handleUpload}
                onReplace={handleReplace}
                onDownload={handleDownload}
              />
            ))
          )
        )}
      </div>
    </div>
  );
}

function DocumentCard({ document, isAdmin, uploading, replacingUploading, onUpload, onReplace, onDownload }) {
  const fileInputRef = useRef(null);
  const replaceFileInputRef = useRef(null);
  const isUploaded = document.status === 'UPLOADED';
  const isPending = document.status === 'PENDING';
  const isRejected = document.approvalStatus === 'REJECTED';

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(document.documentId, file);
      e.target.value = ''; // Reset input
    }
  };

  const handleReplaceFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onReplace(document.id, file, isRejected);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {document.documentName || `Document #${document.documentId}`}
          </h3>
          
          {document.description && (
            <p className="text-sm text-gray-600 mb-2">{document.description}</p>
          )}

          {isUploaded && (
            <div className="mb-2 space-y-1">
              <p className="text-sm text-gray-600">
                📎 <span className="font-medium">{document.fileName}</span>
              </p>
              <p className="text-xs text-gray-500">
                Size: {formatFileSize(document.fileSize)} | 
                Uploaded: {formatDate(document.uploadedAt)}
              </p>
            </div>
          )}

          {isAdmin && document.employeeUsername && (
            <p className="text-sm text-gray-600 mb-2">
              User: <span className="font-medium">{document.employeeUsername}</span>
            </p>
          )}

          <div className="flex gap-2 flex-wrap">
            <span
              className={`badge ${
                isUploaded ? 'badge-success' : 'badge-warning'
              }`}
            >
              {isUploaded ? '✓ Uploaded' : '○ Pending Upload'}
            </span>

            {/* Show approval status for uploaded documents */}
            {isUploaded && document.approvalStatus && (
              <span
                className={`badge ${
                  document.approvalStatus === 'APPROVED' ? 'badge-success' :
                  document.approvalStatus === 'REJECTED' ? 'badge-error' :
                  'badge-warning'
                }`}
                title={document.rejectionReason || ''}
              >
                {document.approvalStatus === 'APPROVED' && '✓ Approved'}
                {document.approvalStatus === 'REJECTED' && '✕ Rejected'}
                {document.approvalStatus === 'PENDING' && '⏳ Awaiting Review'}
              </span>
            )}
          </div>

          {/* Show rejection reason if rejected */}
          {document.approvalStatus === 'REJECTED' && document.rejectionReason && (
            <div className="mt-2 p-2 bg-error-light border border-error rounded text-sm">
              <strong>Rejection Reason:</strong> {document.rejectionReason}
            </div>
          )}
        </div>

        {!isAdmin && (
          <div className="flex flex-col gap-2 ml-4">
            {isUploaded ? (
              <>
                <div className="flex gap-2">
                  <button
                    onClick={() => onDownload(document.id, document.fileName)}
                    className="btn btn-primary text-sm whitespace-nowrap"
                    title="Download your uploaded document"
                  >
                    ⬇ Download
                  </button>
                  <input
                    ref={replaceFileInputRef}
                    type="file"
                    onChange={handleReplaceFileSelect}
                    style={{ display: 'none' }}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                  />
                  <button
                    onClick={() => replaceFileInputRef.current?.click()}
                    className={`btn text-sm whitespace-nowrap ${
                      isRejected ? 'btn-error' : 'btn-warning'
                    }`}
                    disabled={replacingUploading}
                    title={isRejected
                      ? "Replace rejected document - will be re-reviewed"
                      : "Replace with a new file"
                    }
                  >
                    {replacingUploading ? (
                      <>⏳ Replacing...</>
                    ) : isRejected ? (
                      <>🔄 Replace & Resubmit</>
                    ) : (
                      <>🔄 Replace</>
                    )}
                  </button>
                </div>
                {isRejected && (
                  <p className="text-xs text-error-dark italic mt-1">
                    ⚠ Document rejected - please upload a new version
                  </p>
                )}
              </>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-success text-sm whitespace-nowrap"
                  disabled={uploading}
                >
                  {uploading ? '⏳ Uploading...' : '📤 Upload'}
                </button>
              </>
            )}
          </div>
        )}

        {isAdmin && isUploaded && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onDownload(document.id, document.fileName)}
              className="btn btn-primary text-sm whitespace-nowrap"
              title="Download"
            >
              ⬇ Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function formatFileSize(bytes) {
  if (!bytes) return 'N/A';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

export default DocumentsSection;
