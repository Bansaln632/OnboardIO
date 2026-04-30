import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function AdminDashboard() {
  const navigate = useNavigate();
  const [onboardings, setOnboardings] = useState([]);
  const [loadingOnboardings, setLoadingOnboardings] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchOnboardings();
  }, []);

  const fetchOnboardings = async () => {
    setError(null);
    setLoadingOnboardings(true);
    try {
      const res = await api.get("/api/admin/onboarding");
      const data = res.data || [];
      setOnboardings(data);
    } catch (err) {
      const m = err?.response?.data?.message || err.message || "Failed to load onboardings";
      setError(m);
    } finally {
      setLoadingOnboardings(false);
    }
  };


  const totalPages = Math.max(1, Math.ceil(onboardings.length / pageSize));
  const pagedOnboardings = onboardings.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>📊 Employee Onboardings</h1>
        <p>View and manage employee onboarding status</p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorMessage}>
          {error}
        </div>
      )}

      {/* Pagination */}
      <div style={styles.pagination}>
        <div>
          Page {page} of {totalPages}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn btn-primary text-sm"
          >
            ← Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn btn-primary text-sm"
          >
            Next →
          </button>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            style={styles.paginationSelect}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
      </div>

      {/* Onboardings Section */}
      <section style={styles.section}>
        {loadingOnboardings ? (
          <div style={styles.loading}>Loading onboardings...</div>
        ) : onboardings.length === 0 ? (
          <div style={styles.emptyState}>No employees onboarding.</div>
        ) : (
          <div style={styles.onboardingsList}>
            {pagedOnboardings.map((o) => (
              <div key={o.id} style={styles.onboardingCard}>
                {/* Employee Info */}
                <div style={styles.cardInfo}>
                  <h3 style={styles.cardTitle}>{o.employeeUsername || "(none)"}</h3>
                  <div style={styles.cardDetails}>
                    <span>
                      <strong>Status:</strong>
                      <span style={{
                        ...styles.badge,
                        background: o.status === 'COMPLETED' ? '#28a745' :
                                   o.status === 'IN_PROGRESS' ? '#ffc107' : '#6c757d',
                        marginLeft: '8px'
                      }}>
                        {o.status}
                      </span>
                    </span>
                    <span>
                      <strong>Progress:</strong> {o.progress}%
                    </span>
                    <span>
                      <strong>HR:</strong> {o.assignedHrUsername || "Unassigned"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1400px",
    margin: "0 auto",
    minHeight: "calc(100vh - 80px)",
    background: "#f8f9fa",
  },
  header: {
    marginBottom: "32px",
    color: "#333",
  },
  errorMessage: {
    padding: "16px",
    background: "#fee",
    border: "1px solid #fcc",
    borderRadius: "8px",
    color: "#c33",
    marginBottom: "24px",
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    background: "#fff",
    borderRadius: "8px",
    marginBottom: "24px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  paginationSelect: {
    padding: "8px 12px",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  section: {
    marginBottom: "32px",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    color: "#999",
    background: "#fff",
    borderRadius: "8px",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    background: "#fff",
    borderRadius: "8px",
    color: "#999",
    border: "1px dashed #ddd",
  },
  onboardingsList: {
    display: "grid",
    gap: "16px",
  },
  onboardingCard: {
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    margin: "0 0 16px 0",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
  },
  cardDetails: {
    display: "flex",
    gap: "32px",
    fontSize: "15px",
    color: "#666",
    flexWrap: "wrap",
  },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#fff",
  },
};

export default AdminDashboard;

