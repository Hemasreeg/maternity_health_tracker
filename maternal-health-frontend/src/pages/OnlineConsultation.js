import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../services/api';

export default function OnlineConsultation() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [bookingModal, setBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '09:00',
    topic: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Available doctors for online consultation
  const availableDoctors = [
    {
      id: 101,
      name: 'Dr. Priya Sharma',
      specialization: 'Obstetrics & Gynecology',
      experience: '15 years',
      languages: 'Hindi, English',
      consultationFee: '₹500',
      rating: 4.8,
      availability: 'Mon-Sat, 9 AM - 6 PM',
      about: 'Specializes in prenatal care and high-risk pregnancies',
      image: '👩‍⚕️',
    },
    {
      id: 102,
      name: 'Dr. Anjali Verma',
      specialization: 'Maternal Health Specialist',
      experience: '12 years',
      languages: 'Hindi, English, Marathi',
      consultationFee: '₹450',
      rating: 4.7,
      availability: 'Tue-Sun, 10 AM - 7 PM',
      about: 'Expert in pregnancy nutrition and wellness programs',
      image: '👩‍⚕️',
    },
    {
      id: 103,
      name: 'Dr. Meera Gupta',
      specialization: 'Nutritionist & Obstetrician',
      experience: '11 years',
      languages: 'Hindi, English',
      consultationFee: '₹400',
      rating: 4.6,
      availability: 'Mon-Fri, 11 AM - 5 PM',
      about: 'Specializes in gestational diabetes and diet management',
      image: '👩‍⚕️',
    },
    {
      id: 104,
      name: 'Dr. Seema Desai',
      specialization: 'Obstetrics & Fetal Medicine',
      experience: '14 years',
      languages: 'Hindi, English, Gujarati',
      consultationFee: '₹550',
      rating: 4.9,
      availability: 'Daily, 8 AM - 8 PM',
      about: 'Expert in fetal development and ultrasound imaging',
      image: '👩‍⚕️',
    },
  ];

  const topics = [
    'Pregnancy symptoms',
    'Nutrition & diet',
    'Prenatal care',
    'Labor preparation',
    'Medication concerns',
    'Fetal development',
    'Mental health',
    'Other',
  ];

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.list();
      const onlineConsults = response.data.appointments?.filter(
        (apt) => apt.consultation_type === 'online'
      ) || [];
      setConsultations(onlineConsults);
    } catch (error) {
      console.error('Error loading consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleBooking = async () => {
    if (!formData.date || !formData.time || !formData.topic || !selectedDoctor) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const consultationData = {
        doctor_id: selectedDoctor.id,
        doctor_name: selectedDoctor.name,
        appointment_date: formData.date,
        time: formData.time,
        consultation_type: 'online',
        topic: formData.topic,
        description: formData.description,
        consultation_fee: selectedDoctor.consultationFee,
      };

      await appointmentAPI.book(consultationData);
      setSuccessMessage(
        `✓ Online consultation booked with Dr. ${selectedDoctor.name} for ${formData.date} at ${formData.time}`
      );
      setBookingModal(false);
      setFormData({ date: '', time: '09:00', topic: '', description: '' });
      fetchConsultations();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      alert('Error booking consultation: ' + (error.response?.data?.error || error.message));
    }
  };

  const openBookingModal = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingModal(true);
  };

  const closeModal = () => {
    setBookingModal(false);
    setSelectedDoctor(null);
    setFormData({ date: '', time: '09:00', topic: '', description: '' });
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
        ← Back to Dashboard
      </button>

      <div style={styles.mainCard}>
        <h1 style={styles.title}>💬 Online Doctor Consultation</h1>
        <p style={styles.subtitle}>Connect with expert doctors from the comfort of your home</p>

        {successMessage && (
          <div style={styles.successMessage}>
            <span style={styles.successIcon}>✓</span>
            {successMessage}
          </div>
        )}

        <div style={styles.statsSection}>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>👨‍⚕️</span>
            <p style={styles.statLabel}>Expert Doctors</p>
            <p style={styles.statValue}>{availableDoctors.length}</p>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>💻</span>
            <p style={styles.statLabel}>Video Calls</p>
            <p style={styles.statValue}>1-on-1</p>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>⏱️</span>
            <p style={styles.statLabel}>Duration</p>
            <p style={styles.statValue}>20-30 min</p>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>🔒</span>
            <p style={styles.statLabel}>Secure</p>
            <p style={styles.statValue}>Private</p>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📋 Available Doctors</h2>

          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p>Loading doctors...</p>
            </div>
          ) : (
            <div style={styles.doctorsGrid}>
              {availableDoctors.map((doctor) => (
                <div key={doctor.id} style={styles.doctorCard}>
                  <div style={styles.doctorHeader}>
                    <div style={styles.doctorImage}>{doctor.image}</div>
                    <div style={styles.doctorBasicInfo}>
                      <h3 style={styles.doctorName}>Dr. {doctor.name.split(' ')[1]}</h3>
                      <p style={styles.specialization}>{doctor.specialization}</p>
                      <div style={styles.ratingBar}>
                        <span style={styles.stars}>⭐ {doctor.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.doctorDetails}>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Experience:</span>
                      <span style={styles.detailValue}>{doctor.experience}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Languages:</span>
                      <span style={styles.detailValue}>{doctor.languages}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Availability:</span>
                      <span style={styles.detailValue}>{doctor.availability}</span>
                    </div>
                    <p style={styles.aboutText}>"{doctor.about}"</p>
                  </div>

                  <div style={styles.doctorFooter}>
                    <div style={styles.feeSection}>
                      <span style={styles.feeLabel}>Consultation Fee</span>
                      <span style={styles.feeValue}>{doctor.consultationFee}</span>
                    </div>
                    <button
                      onClick={() => openBookingModal(doctor)}
                      style={styles.bookBtn}
                    >
                      📅 Book Consultation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {consultations.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📅 Your Scheduled Consultations</h2>
            <div style={styles.consultationsList}>
              {consultations.map((consultation) => (
                <div key={consultation.id} style={styles.consultationCard}>
                  <div style={styles.consultationInfo}>
                    <h4>Dr. {consultation.doctor_name}</h4>
                    <p>Topic: {consultation.topic}</p>
                    <p>📅 {consultation.appointment_date} at {consultation.time}</p>
                    <p style={styles.consultationType}>Video Consultation</p>
                  </div>
                  <button style={styles.joinBtn}>Join Call</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={styles.benefitsSection}>
          <h2 style={styles.sectionTitle}>✨ Why Choose Online Consultation?</h2>
          <div style={styles.benefitsGrid}>
            <div style={styles.benefitCard}>
              <span style={styles.benefitIcon}>🏡</span>
              <h4 style={styles.benefitTitle}>Consult from Home</h4>
              <p style={styles.benefitText}>No need to travel, stay safe and comfortable</p>
            </div>
            <div style={styles.benefitCard}>
              <span style={styles.benefitIcon}>⏰</span>
              <h4 style={styles.benefitTitle}>Flexible Schedule</h4>
              <p style={styles.benefitText}>Book appointments at your convenient time</p>
            </div>
            <div style={styles.benefitCard}>
              <span style={styles.benefitIcon}>💳</span>
              <h4 style={styles.benefitTitle}>Affordable</h4>
              <p style={styles.benefitText}>Lower consultation fees compared to in-person visits</p>
            </div>
            <div style={styles.benefitCard}>
              <span style={styles.benefitIcon}>📝</span>
              <h4 style={styles.benefitTitle}>Instant Reports</h4>
              <p style={styles.benefitText}>Get consultation summary via email after the call</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <button onClick={closeModal} style={styles.closeBtn}>✕</button>

            <h2 style={styles.modalTitle}>
              Book Consultation with Dr. {selectedDoctor?.name.split(' ')[1]}
            </h2>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Consultation Topic *</label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                style={styles.formSelect}
              >
                <option value="">Select a topic</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Preferred Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={styles.formInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Preferred Time *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  style={styles.formInput}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Additional Details (optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your health concerns or questions..."
                style={styles.formTextarea}
              />
            </div>

            <div style={styles.feeInfo}>
              <span>Consultation Fee: {selectedDoctor?.consultationFee}</span>
            </div>

            <div style={styles.modalButtons}>
              <button onClick={closeModal} style={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleBooking} style={styles.confirmBtn}>
                ✓ Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)',
    padding: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  backBtn: {
    padding: '10px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid rgba(59, 130, 246, 0.3)',
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
    boxShadow: '0 12px 35px rgba(59, 130, 246, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    backgroundClip: 'text',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#3b82f6',
    textAlign: 'center',
    marginBottom: '28px',
    fontWeight: '500',
  },
  successMessage: {
    backgroundColor: '#ecfdf5',
    borderLeft: '4px solid #10b981',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    fontSize: '14px',
    color: '#065f46',
    fontWeight: '500',
  },
  successIcon: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  statsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: '#f0f9ff',
    border: '2px solid #bfdbfe',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
  },
  statIcon: {
    fontSize: '32px',
    display: 'block',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '0 0 6px 0',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#111827',
    margin: '0',
  },
  section: {
    marginBottom: '36px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '20px',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  spinner: {
    display: 'inline-block',
    width: '40px',
    height: '40px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  doctorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  doctorCard: {
    backgroundColor: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  doctorHeader: {
    display: 'flex',
    gap: '14px',
    padding: '16px',
    backgroundColor: '#fafbfc',
    borderBottom: '1px solid #e5e7eb',
  },
  doctorImage: {
    fontSize: '48px',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ede9fe',
    borderRadius: '8px',
    flexShrink: 0,
  },
  doctorBasicInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 4px 0',
  },
  specialization: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '0 0 8px 0',
  },
  ratingBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  stars: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#f59e0b',
  },
  doctorDetails: {
    padding: '16px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '13px',
  },
  detailLabel: {
    color: '#6b7280',
    fontWeight: '500',
  },
  detailValue: {
    color: '#111827',
    fontWeight: '500',
  },
  aboutText: {
    fontSize: '12px',
    color: '#6b7280',
    fontStyle: 'italic',
    margin: '12px 0 0 0',
    padding: '8px',
    backgroundColor: '#f0f9ff',
    borderRadius: '6px',
  },
  doctorFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    borderTop: '1px solid #e5e7eb',
  },
  feeSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  feeLabel: {
    fontSize: '11px',
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  feeValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#10b981',
  },
  bookBtn: {
    padding: '8px 16px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  consultationsList: {
    display: 'grid',
    gap: '12px',
  },
  consultationCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    border: '2px solid #bbf7d0',
    borderRadius: '8px',
    padding: '16px',
  },
  consultationInfo: {
    flex: 1,
  },
  consultationInfo_h4: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 8px 0',
  },
  consultationType: {
    fontSize: '12px',
    color: '#10b981',
    fontWeight: '600',
    marginTop: '8px',
  },
  joinBtn: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
  },
  benefitsSection: {
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    padding: '28px',
    border: '2px solid #e5e7eb',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
  },
  benefitCard: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
  },
  benefitIcon: {
    fontSize: '32px',
    display: 'block',
    marginBottom: '12px',
  },
  benefitTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 8px 0',
  },
  benefitText: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0',
    lineHeight: '1.5',
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
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: '0 20px 48px rgba(0, 0, 0, 0.2)',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    backgroundColor: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  formLabel: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  formSelect: {
    width: '100%',
    padding: '10px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  formInput: {
    width: '100%',
    padding: '10px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  formTextarea: {
    width: '100%',
    padding: '10px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    minHeight: '100px',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  feeInfo: {
    backgroundColor: '#fef3c7',
    border: '2px solid #fcd34d',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#78350f',
    marginBottom: '20px',
  },
  modalButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  cancelBtn: {
    padding: '12px',
    backgroundColor: '#f3f4f6',
    border: '2px solid #e5e7eb',
    color: '#6b7280',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  confirmBtn: {
    padding: '12px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
};
