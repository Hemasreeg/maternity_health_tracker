import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <h2>Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  const features = [
    {
      id: 1,
      title: 'Health Assessment',
      description: 'Track your symptoms and get personalized health recommendations',
      icon: '📋',
      path: '/health-assessment',
      color: '#667eea',
    },
    {
      id: 2,
      title: 'Find Doctors',
      description: 'Book appointments with experienced maternal health specialists',
      icon: '👨‍⚕️',
      path: '/doctors',
      color: '#764ba2',
    },
    {
      id: 3,
      title: 'My Appointments',
      description: 'View and manage all your scheduled appointments',
      icon: '📅',
      path: '/appointments',
      color: '#10b981',
    },
    {
      id: 4,
      title: 'Online Consultation',
      description: 'Chat with doctors via video from the comfort of your home',
      icon: '💬',
      path: '/online-consultation',
      color: '#3b82f6',
    },
    {
      id: 5,
      title: 'Nutrition Guide',
      description: 'Get expert nutrition advice tailored for pregnancy',
      icon: '🥗',
      path: '/nutrition',
      color: '#f59e0b',
    },
    {
      id: 6,
      title: 'Food Delivery',
      description: 'Order healthy meals delivered to your doorstep',
      icon: '🍱',
      path: '/food-delivery',
      color: '#ef4444',
    },
    {
      id: 7,
      title: 'Medicine Delivery',
      description: 'Get prescribed medicines safely delivered at home',
      icon: '💊',
      path: '/medicine-delivery',
      color: '#06b6d4',
    },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <span style={styles.logoEmoji}>💜</span>
            <div>
              <h1 style={styles.appTitle}>Maternal Health Tracker</h1>
              <p style={styles.appSubtitle}>Your pregnancy wellness companion</p>
            </div>
          </div>
          <div style={styles.userSection}>
            <div style={styles.userInfo}>
              <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
              <div>
                <div style={styles.userName}>{user?.name || 'User'}</div>
                <div style={styles.userEmail}>{user?.email}</div>
              </div>
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.welcomeSection}>
          <h2 style={styles.welcomeTitle}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
          <p style={styles.welcomeText}>
            Continue your maternal health journey with personalized care and expert guidance
          </p>
        </div>

        {/* Quick Stats */}
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, backgroundColor: '#eef2ff', borderLeftColor: '#667eea' }}>
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>5</div>
              <div style={styles.statLabel}>Health Assessments</div>
            </div>
          </div>
          <div style={{ ...styles.statCard, backgroundColor: '#ecfdf5', borderLeftColor: '#10b981' }}>
            <div style={styles.statIcon}>📅</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>2</div>
              <div style={styles.statLabel}>Upcoming Appointments</div>
            </div>
          </div>
          <div style={{ ...styles.statCard, backgroundColor: '#fffbeb', borderLeftColor: '#f59e0b' }}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>All Set</div>
              <div style={styles.statLabel}>Health Status</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <section style={styles.featuresSection}>
          <h3 style={styles.sectionTitle}>What would you like to do?</h3>
          <div style={styles.featuresGrid}>
            {features.map((feature) => (
              <Link key={feature.id} to={feature.path} style={styles.cardLink}>
                <div style={{...styles.featureCard, borderTopColor: feature.color }}>
                  <div style={{...styles.cardIconBox, backgroundColor: `${feature.color}15`}}>
                    <span style={styles.cardIcon}>{feature.icon}</span>
                  </div>
                  <h4 style={styles.cardTitle}>{feature.title}</h4>
                  <p style={styles.cardDescription}>{feature.description}</p>
                  <div style={styles.cardFooter}>
                    <span style={styles.cardLink}>Get Started →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Health Tips */}
        <section style={styles.tipsSection}>
          <h3 style={styles.sectionTitle}>wellness Tips</h3>
          <div style={styles.tipsGrid}>
            <div style={styles.tipCard}>
              <div style={styles.tipIcon}>💧</div>
              <h4 style={styles.tipTitle}>Stay Hydrated</h4>
              <p style={styles.tipText}>Drink at least 8-10 glasses of water daily to support your baby's development</p>
            </div>
            <div style={styles.tipCard}>
              <div style={styles.tipIcon}>🧘</div>
              <h4 style={styles.tipTitle}>Stay Active</h4>
              <p style={styles.tipText}>Regular light exercise like walking or yoga can improve your health and mood</p>
            </div>
            <div style={styles.tipCard}>
              <div style={styles.tipIcon}>😴</div>
              <h4 style={styles.tipTitle}>Restful Sleep</h4>
              <p style={styles.tipText}>Aim for 7-9 hours of quality sleep each night for proper body recovery</p>
            </div>
            <div style={styles.tipCard}>
              <div style={styles.tipIcon}>🥗</div>
              <h4 style={styles.tipTitle}>Balanced Diet</h4>
              <p style={styles.tipText}>Include fruits, vegetables, proteins, and whole grains in every meal</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2026 Maternal Health Tracker. Your health, our priority. 💜</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7ff 0%, #f0e7ff 50%, #ffe8f5 100%)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    color: 'white',
    padding: '28px 20px',
    boxShadow: '0 8px 30px rgba(102, 126, 234, 0.3)',
    animation: 'slideInDown 0.6s ease',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logoEmoji: {
    fontSize: '40px',
  },
  appTitle: {
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  appSubtitle: {
    fontSize: '13px',
    opacity: 0.9,
    margin: 0,
    marginTop: '2px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textAlign: 'right',
  },
  avatar: {
    width: '40px',
    height: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px',
  },
  userName: {
    fontWeight: '600',
    fontSize: '14px',
  },
  userEmail: {
    fontSize: '12px',
    opacity: 0.8,
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },
  main: {
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    padding: '40px 20px',
    animation: 'slideInUp 0.6s ease',
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '20px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e2e8f0',
    borderTopColor: '#667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  welcomeSection: {
    marginBottom: '40px',
  },
  welcomeTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px',
  },
  welcomeText: {
    fontSize: '16px',
    color: '#64748b',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '40px',
  },
  statCard: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    padding: '20px',
    borderRadius: '12px',
    borderLeft: '4px solid #667eea',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  statIcon: {
    fontSize: '32px',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    backgroundClip: 'text',
  },
  statLabel: {
    fontSize: '13px',
    color: '#666b7280',
    marginTop: '2px',
  },
  featuresSection: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    backgroundClip: 'text',
    marginBottom: '24px',
    textTransform: 'capitalize',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  featureCard: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
    borderRadius: '12px',
    padding: '24px',
    borderTop: '4px solid',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 255, 255, 0.4)',
  },
  cardIconBox: {
    width: '56px',
    height: '56px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  cardIcon: {
    fontSize: '28px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px',
    margin: 0,
  },
  cardDescription: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '16px',
    flex: 1,
    margin: '8px 0 16px 0',
  },
  cardFooter: {
    color: '#667eea',
    fontWeight: '600',
    fontSize: '13px',
  },
  tipsSection: {
    marginBottom: '40px',
  },
  tipsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '20px',
  },
  tipCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  tipIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  tipTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px',
    margin: 0,
  },
  tipText: {
    fontSize: '13px',
    color: '#64748b',
    lineHeight: '1.6',
    margin: 0,
  },
  footer: {
    background: '#f1f5f9',
    padding: '24px 20px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '14px',
    borderTop: '1px solid #e2e8f0',
  },
};

