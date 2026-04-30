import { useNavigate } from "react-router-dom";

function AboutUs() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>🚀 Welcome to OnboardIO</h1>
        <p style={styles.heroSubtitle}>Your Employee Onboarding Companion</p>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {/* About Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>About OnboardIO</h2>
          <p style={styles.text}>
            OnboardIO is a modern employee onboarding platform designed to streamline the process
            of welcoming new team members. We provide a seamless experience for both employees
            and administrators to manage tasks, trainings, and document uploads.
          </p>
        </section>

        {/* Features Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Key Features</h2>
          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📋</div>
              <h3>Task Management</h3>
              <p>Stay organized with assigned tasks and track completion progress.</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🎓</div>
              <h3>Training Programs</h3>
              <p>Access essential training materials and courses tailored for onboarding.</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📄</div>
              <h3>Document Management</h3>
              <p>Upload and manage required documents with approval workflows.</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📊</div>
              <h3>Progress Tracking</h3>
              <p>Monitor your onboarding progress with real-time updates.</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>👥</div>
              <h3>HR Management</h3>
              <p>Admins can manage multiple employees and their onboarding journeys.</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>✅</div>
              <h3>Approval System</h3>
              <p>Streamlined document approval and rejection workflow.</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <div style={styles.stepsGrid}>
            <div style={styles.step}>
              <div style={styles.stepNumber}>1</div>
              <h3>Sign Up</h3>
              <p>Create your account as an employee or HR administrator.</p>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>2</div>
              <h3>Dashboard</h3>
              <p>Access your personalized dashboard with onboarding information.</p>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <h3>Complete Activities</h3>
              <p>Finish assigned tasks, trainings, and upload required documents.</p>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>4</div>
              <h3>Get Approved</h3>
              <p>Receive approval from admin and complete your onboarding.</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section style={styles.ctaSection}>
 {!isLoggedIn && (<>
              <h2>Ready to Get Started?</h2>
              <p>Join Companio today and streamline your onboarding experience.</p>

            <button
              onClick={() => navigate("/?tab=signup")}
              className="btn btn-primary mt-6"
            >
              Sign Up Now
            </button>
            </>
          )}
          {isLoggedIn && (
              <>
              <h2>Complete Your Activities Now</h2>
              <p>Welcome!! Please Click below to check your assigned activities.
                  Have a wonderful Experience 😊</p>

            <button
              onClick={() => navigate("/activities")}
              className="btn btn-primary mt-6"
            >
              Go to Activities ⚡
            </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 80px)",
    background: "#f8f9fa",
  },
  hero: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    padding: "60px 24px",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "bold",
    margin: "0 0 16px 0",
  },
  heroSubtitle: {
    fontSize: "20px",
    margin: 0,
    opacity: 0.9,
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "60px 24px",
  },
  section: {
    marginBottom: "60px",
  },
  sectionTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "24px",
    color: "#333",
  },
  text: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#666",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  featureCard: {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    ":hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    }
  },
  featureIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
  },
  step: {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  stepNumber: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 auto 16px",
  },
  ctaSection: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    padding: "60px 24px",
    borderRadius: "12px",
    textAlign: "center",
  },
  ctaButton: {
    padding: "14px 32px",
    background: "#ffd700",
    color: "#764ba2",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "24px",
    transition: "all 0.3s ease",
  },
};

export default AboutUs;

