import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FoodDelivery() {
  const navigate = useNavigate();

  const foodPartners = [
    { name: 'Zomato', logo: '🍕', desc: 'Order from restaurants', url: 'https://www.zomato.com/' },
    { name: 'Swiggy', logo: '🍔', desc: 'Quick food delivery', url: 'https://www.swiggy.com/' },
    { name: 'Blinkit', logo: '🛒', desc: 'Fast grocery and essentials delivery', url: 'https://blinkit.com/' },
    { name: 'Zepto', logo: '⚡', desc: 'Instant grocery delivery', url: 'https://www.zeptonow.com/' },
    { name: 'Instamart', logo: '🥬', desc: 'Swiggy Instamart groceries and essentials', url: 'https://www.swiggy.com/instamart' },
    { name: 'Local Caterers', logo: '🍱', desc: 'Home-cooked healthy meals', url: 'https://www.google.com/search?q=local+healthy+food+caterers+near+me' },
  ];

  const handleOpenPartner = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
        ← Back to Dashboard
      </button>

      <div style={styles.card}>
        <h1 style={styles.title}>🍱 Food Delivery</h1>
        <p style={styles.subtitle}>Order healthy, nutritious meals tailored for pregnancy</p>

        <div style={styles.partnersGrid}>
          {foodPartners.map((partner) => (
            <div key={partner.name} style={styles.partnerCard}>
              <div style={styles.logo}>{partner.logo}</div>
              <h3>{partner.name}</h3>
              <p>{partner.desc}</p>
              <button
                style={styles.orderBtn}
                onClick={() => handleOpenPartner(partner.url)}
              >
                Open {partner.name}
              </button>
            </div>
          ))}
        </div>

        <div style={styles.infoSection}>
          <h3>Pregnancy-Friendly Meals</h3>
          <ul style={styles.list}>
            <li>✓ High in protein and calcium</li>
            <li>✓ Rich in iron and folic acid</li>
            <li>✓ Low in mercury fish</li>
            <li>✓ Pasteurized dairy only</li>
            <li>✓ No raw or undercooked meat</li>
          </ul>
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
  partnersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  partnerCard: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  logo: {
    fontSize: '40px',
    marginBottom: '10px',
  },
  'partnerCard h3': {
    color: '#111827',
    marginBottom: '5px',
  },
  'partnerCard p': {
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
  },
  'infoSection h3': {
    color: '#047857',
    marginBottom: '15px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  'list li': {
    color: '#047857',
    marginBottom: '10px',
    fontSize: '14px',
  },
};
