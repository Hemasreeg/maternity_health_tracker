import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorAPI, appointmentAPI } from '../services/api';

export default function DoctorDirectory() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.list();
      setDoctors(response.data.doctors || []);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to load doctors'));
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (doctor) => {
    setSelectedDoctor(doctor);
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
        ← Back to Dashboard
      </button>

      <div style={styles.mainCard}>
        <h1 style={styles.title}>👨‍⚕️ Doctor Directory</h1>
        <p style={styles.subtitle}>Connect with experienced maternal health specialists across India</p>

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Loading doctors...</p>
          </div>
        ) : doctors.length === 0 ? (
          <p style={styles.noData}>No doctors available at the moment</p>
        ) : (
          <div style={styles.doctorsGrid}>
            {doctors.map((doctor) => (
              <div key={doctor.id} style={styles.doctorCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.docIcon}>👨‍⚕️</div>
                  <div style={styles.ratingBadge}>
                    ⭐ {doctor.rating}
                  </div>
                </div>

                <h3 style={styles.docName}>{doctor.name}</h3>
                <p style={styles.docSpec}>{doctor.specialization}</p>

                <div style={styles.detailsSection}>
                  <div style={styles.detailRow}>
                    <span style={styles.detailIcon}>🏥</span>
                    <div>
                      <p style={styles.detailLabel}>Hospital</p>
                      <p style={styles.detailValue}>{doctor.hospital}</p>
                    </div>
                  </div>

                  <div style={styles.detailRow}>
                    <span style={styles.detailIcon}>📍</span>
                    <div>
                      <p style={styles.detailLabel}>Location</p>
                      <p style={styles.detailValue}>{doctor.location}</p>
                    </div>
                  </div>

                  <div style={styles.detailRow}>
                    <span style={styles.detailIcon}>📱</span>
                    <div>
                      <p style={styles.detailLabel}>Phone</p>
                      <p style={styles.detailValue}>{doctor.phone}</p>
                    </div>
                  </div>

                  <div style={styles.detailRow}>
                    <span style={styles.detailIcon}>⏱️</span>
                    <div>
                      <p style={styles.detailLabel}>Experience</p>
                      <p style={styles.detailValue}>{doctor.experience}</p>
                    </div>
                  </div>

                  <div style={styles.detailRow}>
                    <span style={styles.detailIcon}>💰</span>
                    <div>
                      <p style={styles.detailLabel}>Consultation Fee</p>
                      <p style={styles.detailValue}>₹{doctor.consultationFee}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBooking(doctor)}
                  style={styles.bookBtn}
                >
                  📅 Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {selectedDoctor && (
          <BookingModal
            doctor={selectedDoctor}
            onClose={() => setSelectedDoctor(null)}
            onSuccess={() => {
              setSelectedDoctor(null);
              navigate('/appointments');
            }}
          />
        )}
      </div>
    </div>
  );
}

function BookingModal({ doctor, onClose, onSuccess }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!date) {
      setError('Please select a date');
      return;
    }

    setLoading(true);
    try {
      const response = await appointmentAPI.book(doctor.id, date, time);
      if (response.data) {
        alert(`✅ Appointment booked successfully!\n\nDate: ${date}\nTime: ${time}\nDoctor: ${doctor.name}`);
        onSuccess();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to book appointment';
      setError(errorMsg);
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <button onClick={onClose} style={styles.closeBtn}>
          ✕
        </button>
        <h2 style={styles.modalTitle}>Book Appointment</h2>
        <p style={styles.modalSubtitle}>with {doctor.name}</p>
        
        <div style={styles.doctorInfoBox}>
          <p style={styles.doctorInfo}><strong>Hospital:</strong> {doctor.hospital}</p>
          <p style={styles.doctorInfo}><strong>Location:</strong> {doctor.location}</p>
          <p style={styles.doctorInfo}><strong>Consultation Fee:</strong> ₹{doctor.consultationFee}</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>⚠️</span>
            <p style={styles.errorMessage}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.bookingForm}>
          <div style={styles.formGroup}>
            <label style={styles.label}>📅 Preferred Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>⏰ Preferred Time:</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={styles.input}
            >
              <option>09:00 AM</option>
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>02:00 PM</option>
              <option>03:00 PM</option>
              <option>04:00 PM</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '⏳ Booking...' : '✓ Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 50%, #fb923c 100%)',
    padding: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  backBtn: {
    padding: '10px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid rgba(249, 115, 22, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    boxShadow: '0 12px 35px rgba(249, 115, 22, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    backgroundClip: 'text',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '30px',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280',
  },
  spinner: {
    display: 'inline-block',
    width: '40px',
    height: '40px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px',
  },
  noData: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '16px',
    padding: '40px',
  },
  doctorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
  },
  doctorCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  docIcon: {
    fontSize: '48px',
    backgroundColor: '#ede9fe',
    width: '72px',
    height: '72px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadge: {
    backgroundColor: '#fef3c7',
    padding: '8px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#92400e',
  },
  docName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  },
  docSpec: {
    fontSize: '14px',
    color: '#667eea',
    fontWeight: '600',
    marginBottom: '16px',
  },
  detailsSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    border: '1px solid #e5e7eb',
  },
  detailRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
  },
  detailIcon: {
    fontSize: '18px',
    minWidth: '24px',
  },
  detailLabel: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '600',
    margin: '0 0 2px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  detailValue: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: '500',
    margin: '0',
  },
  bookBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
  },
  closeBtn: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  modalTitle: {
    color: '#111827',
    textAlign: 'center',
    marginBottom: '4px',
    fontSize: '22px',
    fontWeight: '600',
  },
  modalSubtitle: {
    textAlign: 'center',
    color: '#667eea',
    marginBottom: '24px',
    fontWeight: '600',
  },
  doctorInfoBox: {
    backgroundColor: '#f0f9ff',
    borderLeft: '4px solid #0ea5e9',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px',
  },
  doctorInfo: {
    fontSize: '13px',
    color: '#374151',
    margin: '4px 0',
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    borderLeft: '4px solid #dc2626',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px',
    display: 'flex',
    gap: '8px',
  },
  errorIcon: {
    fontSize: '18px',
  },
  errorMessage: {
    fontSize: '13px',
    color: '#991b1b',
    margin: '0',
  },
  bookingForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s',
  },
  submitBtn: {
    padding: '12px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },
};
