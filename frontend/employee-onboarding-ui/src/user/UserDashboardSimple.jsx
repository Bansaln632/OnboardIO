import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function UserDashboard() {
  const navigate = useNavigate();
  const [onboarding, setOnboarding] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOnboarding();
  }, []);

  const fetchOnboarding = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/user/onboarding");
      setOnboarding(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load onboarding");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>Loading your onboarding status...</div>
      </div>
    );
  }

  // If there's an error and no onboarding data, show error state
  if (error && !onboarding.id) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>Onboarding Not Found</h2>
          <p style={styles.errorText}>{error}</p>
          <p style={styles.errorSubtext}>
            Your onboarding record hasn't been created yet. Please contact your HR administrator or try refreshing the page.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            🔄 Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Calculate progress color
  const progressPercentage = onboarding.progress || 0;
  let progressColor = "#667eea";
  if (progressPercentage >= 75) progressColor = "#28a745";
  else if (progressPercentage >= 50) progressColor = "#ffc107";
  else if (progressPercentage >= 25) progressColor = "#fd7e14";

  // Status color
  const statusColor =
    onboarding.status === "COMPLETED" ? "#28a745" :
    onboarding.status === "IN_PROGRESS" ? "#667eea" :
    "#ffc107";

  return (
    <div style={styles.container}>
      {error && (
        <div style={styles.errorMessage}>{error}</div>
      )}

      {/* Main Welcome Card */}
      <div style={styles.welcomeCard}>
        <div style={styles.welcomeContent}>
          <h1 style={styles.welcomeTitle}>Welcome aboard! 🎉</h1>
          <p style={styles.welcomeSubtitle}>Employee: <strong>{onboarding.employeeUsername || "N/A"}</strong></p>
          <p style={styles.welcomeDescription}>
            You're on your way to becoming a fully onboarded team member. Complete your activities to progress through the onboarding journey.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {/* Status Card */}
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Current Status</div>
          <div style={{
            ...styles.statValue,
            color: statusColor
          }}>
            {onboarding.status ? onboarding.status.replace(/_/g, " ") : "N/A"}
          </div>
        </div>

        {/* Progress Card */}
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Overall Progress</div>
          <div style={styles.progressContainer}>
            <div style={styles.progressValue}>{onboarding.progress || 0}%</div>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${onboarding.progress || 0}%`,
                  background: progressColor
                }}
              />
            </div>
          </div>
        </div>

        {/* Assigned HR Card */}
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Assigned HR</div>
          <div style={styles.statValue}>
            {onboarding.assignedHrUsername || "Awaiting Assignment"}
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div style={styles.infoBox}>
        <h3 style={{ margin: "0 0 16px 0" }}>📋 What's Next?</h3>
        <div style={styles.infoList}>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>1️⃣</span>
            <span>Complete your assigned <strong>Tasks</strong></span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>2️⃣</span>
            <span>Finish your <strong>Training Programs</strong></span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>3️⃣</span>
            <span>Upload all required <strong>Documents</strong></span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>4️⃣</span>
            <span>Get admin approval and finish onboarding</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/activities")}
          className="btn btn-primary"
        >
          Go to Activities ⚡
        </button>
      </div>

      {/* Quick Links */}
      <div style={styles.quickLinksGrid}>
        <div
          style={styles.quickLink}
          onClick={() => navigate("/activities")}
        >
          <span style={styles.quickLinkIcon}>📋</span>
          <span>Tasks & Trainings</span>
        </div>
        <div
          style={styles.quickLink}
          onClick={() => navigate("/activities")}
        >
          <span style={styles.quickLinkIcon}>📄</span>
          <span>Upload Documents</span>
        </div>
        <div
          style={styles.quickLink}
          onClick={() => navigate("/about")}
        >
          <span style={styles.quickLinkIcon}>ℹ️</span>
          <span>About OnboardIO</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
    minHeight: "calc(100vh - 80px)",
    background: "#f8f9fa",
  },
  loadingState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#999",
    fontSize: "18px",
  },
  errorMessage: {
    padding: "16px",
    background: "#f8d7da",
    border: "1px solid #f5c6cb",
    borderRadius: "8px",
    color: "#721c24",
    marginBottom: "24px",
  },
  welcomeCard: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    padding: "40px",
    borderRadius: "16px",
    marginBottom: "32px",
    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
  },
  welcomeContent: {},
  welcomeTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0 0 12px 0",
  },
  welcomeSubtitle: {
    fontSize: "16px",
    margin: "0 0 16px 0",
    opacity: 0.95,
  },
  welcomeDescription: {
    fontSize: "15px",
    lineHeight: "1.6",
    margin: 0,
    opacity: 0.9,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  statCard: {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    border: "1px solid #e0e0e0",
  },
  statLabel: {
    fontSize: "13px",
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: "12px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  progressValue: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#667eea",
    minWidth: "40px",
  },
  progressBar: {
    flex: 1,
    height: "8px",
    background: "#e0e0e0",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    transition: "width 0.3s ease",
  },
  infoBox: {
    background: "#fff",
    padding: "32px",
    borderRadius: "12px",
    marginBottom: "32px",
    border: "1px solid #e0e0e0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  infoList: {
    display: "grid",
    gap: "16px",
    marginBottom: "24px",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    fontSize: "15px",
    color: "#555",
    lineHeight: "1.6",
  },
  infoIcon: {
    fontSize: "24px",
  },
  startButton: {
    padding: "14px 32px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
  },
  quickLinksGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  quickLink: {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "12px",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  quickLinkIcon: {
    fontSize: "32px",
  },
  errorCard: {
    background: "#fff",
    padding: "60px 40px",
    borderRadius: "16px",
    border: "2px solid #dc3545",
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto",
    boxShadow: "0 4px 16px rgba(220, 53, 69, 0.1)",
  },
  errorIcon: {
    fontSize: "64px",
    marginBottom: "16px",
  },
  errorTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#dc3545",
    marginBottom: "12px",
  },
  errorText: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "8px",
    fontWeight: "600",
  },
  errorSubtext: {
    fontSize: "14px",
    color: "#999",
    lineHeight: "1.6",
    marginBottom: "24px",
  },
  refreshButton: {
    padding: "12px 32px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default UserDashboard;

