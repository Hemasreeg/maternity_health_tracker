import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MedicineDelivery() {
  const navigate = useNavigate();

  const pharmacies = [
    { name: 'PharmEasy', logo: '💊', desc: 'Prescription delivery', url: 'https://pharmeasy.in/' },
    { name: 'NetMeds', logo: '💉', desc: '24/7 medicine delivery', url: 'https://www.netmeds.com/' },
    { name: 'Local Pharmacies', logo: '🏥', desc: 'Nearby pharmacy pickup', url: 'https://www.google.com/search?q=local+pharmacy+near+me' },
  ];

  const handleOpenPharmacy = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
        ← Back to Dashboard
      </button>

      <div style={styles.card}>
        <h1 style={styles.title}>💊 Medicine Delivery</h1>
        <p style={styles.subtitle}>Order prescribed medicines safely and securely</p>

        <div style={styles.pharmaciesGrid}>
          {pharmacies.map((pharmacy) => (
            <div key={pharmacy.name} style={styles.pharmacyCard}>
              <div style={styles.logo}>{pharmacy.logo}</div>
              <h3>{pharmacy.name}</h3>
              <p>{pharmacy.desc}</p>
              <button
                style={styles.orderBtn}
                onClick={() => handleOpenPharmacy(pharmacy.url)}
              >
                Order from {pharmacy.name}
              </button>
            </div>
          ))}
        </div>

        <div style={styles.infoSection}>
          <h3>Pregnancy-Safe Medications</h3>
          <p style={styles.infoText}>
            All medications delivered are verified safe for pregnancy. Only prenatal vitamins and doctor-prescribed medicines.
          </p>
          <ul style={styles.list}>
            <li>✓ Prenatal vitamins</li>
            <li>✓ Folic acid supplements</li>
            <li>✓ Iron supplements</li>
            <li>✓ Calcium supplements</li>
            <li>✓ Doctor-prescribed medications</li>
          </ul>
        </div>

        <div style={styles.warningSection}>
          <h3>⚠️ Important</h3>
          <p>Always consult your doctor before taking any medication during pregnancy.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  backBtn: {
    padding: '8px 16px',
    backgroundColor: '#e5e7eb',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '40px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '700px',
    margin: '0 auto',
  },
  title: {
    color: '#d946ef',
    textAlign: 'center',
    marginBottom: '10px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: '30px',
  },
  pharmaciesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  pharmacyCard: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  logo: {
    fontSize: '40px',
    marginBottom: '10px',
  },
  'pharmacyCard h3': {
    color: '#111827',
    marginBottom: '5px',
  },
  'pharmacyCard p': {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '15px',
  },
  orderBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#d946ef',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  infoSection: {
    backgroundColor: '#ecfdf5',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  'infoSection h3': {
    color: '#047857',
    marginBottom: '10px',
  },
  infoText: {
    color: '#047857',
    fontSize: '14px',
    marginBottom: '15px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  'list li': {
    color: '#047857',
    marginBottom: '8px',
    fontSize: '14px',
  },
  warningSection: {
    backgroundColor: '#fef3c7',
    padding: '20px',
    borderRadius: '8px',
    borderLeft: '4px solid #f59e0b',
  },
  'warningSection h3': {
    color: '#b45309',
    margin: '0 0 10px 0',
  },
  'warningSection p': {
    color: '#b45309',
    margin: 0,
    fontSize: '14px',
  },
};
