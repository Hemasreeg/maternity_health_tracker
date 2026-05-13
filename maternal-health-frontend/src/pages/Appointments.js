import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../services/api';

export default function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.list();
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (id, doctorName) => {
    if (window.confirm(`Mark appointment with Dr. ${doctorName} as completed?`)) {
      try {
        await appointmentAPI.markCompleted(id);
        setSuccessMessage(`✓ Appointment with Dr. ${doctorName} marked as completed!`);
        fetchAppointments();
        setTimeout(() => setSuccessMessage(''), 4000);
      } catch (error) {
        alert('Error: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleCancel = async (id, doctorName) => {
    if (window.confirm(`Cancel appointment with ${doctorName}?`)) {
      try {
        await appointmentAPI.cancel(id);
        setSuccessMessage(`✓ Appointment with ${doctorName} has been cancelled`);
        fetchAppointments();
        setTimeout(() => setSuccessMessage(''), 4000);
      } catch (error) {
        alert('Error cancelling appointment: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  // Separate appointments by status
  const confirmedAppointments = appointments.filter(apt => apt.status?.toLowerCase() === 'confirmed');
  const completedAppointments = appointments.filter(apt => apt.status?.toLowerCase() === 'completed');
  const cancelledAppointments = appointments.filter(apt => apt.status?.toLowerCase() === 'cancelled');

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
        ← Back to Dashboard
      </button>

      <div style={styles.mainCard}>
        <h1 style={styles.title}>📅 Appointment Management</h1>
        <p style={styles.subtitle}>Track and manage all your health checkups</p>

        {successMessage && (
          <div style={styles.successMessage}>
            <span style={styles.successIcon}>✓</span>
            {successMessage}
          </div>
        )}

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Loading appointments...</p>
          </div>
        ) : (appointments.length === 0) ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📋</div>
            <h3 style={styles.emptyTitle}>No Appointments Scheduled</h3>
            <p style={styles.emptyText}>You don't have any appointments yet. Book one with a specialist today!</p>
            <button
              onClick={() => navigate('/doctors')}
              style={styles.primaryButton}
            >
              📅 Book Your First Appointment
            </button>
          </div>
        ) : (
          <div>
            {/* UPCOMING APPOINTMENTS */}
            {confirmedAppointments.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>⏳</span>
                  Upcoming Appointments ({confirmedAppointments.length})
                </h2>
                <div style={styles.appointmentsList}>
                  {confirmedAppointments.map((apt) => (
                    <div 
                      key={apt.id} 
                      style={{
                        ...styles.appointmentCard,
                        borderColor: '#3b82f6',
                        backgroundColor: '#eff6ff'
                      }}
                    >
                      <div style={styles.cardContent}>
                        <div style={styles.doctorSection}>
                          <div style={styles.doctorIcon}>👨‍⚕️</div>
                          <div style={styles.doctorInfo}>
                            <h3 style={styles.doctorName}>Dr. {apt.doctor_name}</h3>
                            <p style={styles.detailText}>
                              🏥 {apt.hospital || 'Hospital'}
                            </p>
                          </div>
                        </div>

                        <div style={styles.appointmentDetails}>
                          <div style={styles.detailItem}>
                            <span style={styles.detailIcon}>📅</span>
                            <div>
                              <p style={styles.detailLabel}>Date</p>
                              <p style={styles.detailValue}>{apt.appointment_date || apt.date || 'Not set'}</p>
                            </div>
                          </div>

                          <div style={styles.detailItem}>
                            <span style={styles.detailIcon}>⏰</span>
                            <div>
                              <p style={styles.detailLabel}>Time</p>
                              <p style={styles.detailValue}>{apt.time || 'Not set'}</p>
                            </div>
                          </div>

                          <div style={styles.detailItem}>
                            <span style={styles.detailIcon}>📌</span>
                            <div>
                              <p style={styles.detailLabel}>Status</p>
                              <p style={{
                                ...styles.statusBadge,
                                backgroundColor: '#dbeafe',
                                color: '#1e40af',
                                borderColor: '#3b82f6'
                              }}>
                                ⏳ CONFIRMED
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={styles.actionButtons}>
                        <button
                          onClick={() => handleMarkCompleted(apt.id, apt.doctor_name)}
                          style={styles.completeBtn}
                          title="Mark appointment as completed after checkup"
                        >
                          ✓ Mark Completed
                        </button>
                        <button
                          onClick={() => navigate('/doctors')}
                          style={styles.rebookBtn}
                        >
                          📅 Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(apt.id, apt.doctor_name)}
                          style={styles.cancelBtn}
                        >
                          ✕ Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COMPLETED APPOINTMENTS */}
            {completedAppointments.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>✓✓</span>
                  Completed Checkups ({completedAppointments.length})
                </h2>
                <div style={styles.appointmentsList}>
                  {completedAppointments.map((apt) => (
                    <div 
                      key={apt.id} 
                      style={{
                        ...styles.appointmentCard,
                        borderColor: '#10b981',
                        backgroundColor: '#f0fdf4',
                        opacity: 0.9
                      }}
                    >
                      <div style={styles.cardContent}>
                        <div style={styles.doctorSection}>
                          <div style={{...styles.doctorIcon, backgroundColor: '#dcfce7'}}>👨‍⚕️</div>
                          <div style={styles.doctorInfo}>
                            <h3 style={styles.doctorName}>Dr. {apt.doctor_name}</h3>
                            <p style={styles.detailText}>
                              🏥 {apt.hospital || 'Hospital'}
                            </p>
                          </div>
                        </div>

                        <div style={styles.appointmentDetails}>
                          <div style={styles.detailItem}>
                            <span style={styles.detailIcon}>📅</span>
                            <div>
                              <p style={styles.detailLabel}>Date</p>
                              <p style={styles.detailValue}>{apt.appointment_date || apt.date || 'Not set'}</p>
                            </div>
                          </div>

                          <div style={styles.detailItem}>
                            <span style={styles.detailIcon}>⏰</span>
                            <div>
                              <p style={styles.detailLabel}>Time</p>
                              <p style={styles.detailValue}>{apt.time || 'Not set'}</p>
                            </div>
                          </div>

                          <div style={styles.detailItem}>
                            <span style={styles.detailIcon}>📌</span>
                            <div>
                              <p style={styles.detailLabel}>Status</p>
                              <p style={{
                                ...styles.statusBadge,
                                backgroundColor: '#dcfce7',
                                color: '#166534',
                                borderColor: '#10b981'
                              }}>
                                ✓ COMPLETED
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={styles.completedMessage}>
                        ✓ Checkup completed successfully
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CANCELLED APPOINTMENTS */}
            {cancelledAppointments.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>✕</span>
                  Cancelled Appointments ({cancelledAppointments.length})
                </h2>
                <div style={styles.appointmentsList}>
                  {cancelledAppointments.map((apt) => (
                    <div 
                      key={apt.id} 
                      style={{
                        ...styles.appointmentCard,
                        borderColor: '#ef4444',
                        backgroundColor: '#fef2f2',
                        opacity: 0.6
                      }}
                    >
                      <div style={styles.cardContent}>
                        <div style={styles.doctorSection}>
                          <div style={{...styles.doctorIcon, backgroundColor: '#fee2e2'}}>👨‍⚕️</div>
                          <div style={styles.doctorInfo}>
                            <h3 style={styles.doctorName}>Dr. {apt.doctor_name}</h3>
                            <p style={styles.detailText}>
                              🏥 {apt.hospital || 'Hospital'}
                            </p>
                          </div>
                        </div>

                        <div style={styles.appointmentDetails}>
                          <div style={styles.detailItem}>
                            <span style={styles.detailIcon}>📅</span>
                            <div>
                              <p style={styles.detailLabel}>Date</p>
                              <p style={styles.detailValue}>{apt.appointment_date || apt.date || 'Not set'}</p>
                            </div>
                          </div>

                          <div style={styles.detailItem}>
                            <span style={styles.detailIcon}>📌</span>
                            <div>
                              <p style={styles.detailLabel}>Status</p>
                              <p style={{
                                ...styles.statusBadge,
                                backgroundColor: '#fee2e2',
                                color: '#7f1d1d',
                                borderColor: '#ef4444'
                              }}>
                                ✕ CANCELLED
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={styles.actionButtons}>
                        <button
                          onClick={() => navigate('/doctors')}
                          style={styles.rebookBtn}
                        >
                          📅 Book New Appointment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fae8ff 0%, #f5d0ff 50%, #ede9fe 100%)',
    padding: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  backBtn: {
    padding: '10px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid rgba(168, 85, 247, 0.3)',
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
    maxWidth: '1100px',
    margin: '0 auto',
    boxShadow: '0 12px 35px rgba(168, 85, 247, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    backgroundClip: 'text',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#a855f7',
    textAlign: 'center',
    marginBottom: '24px',
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
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '24px',
  },
  primaryButton: {
    padding: '14px 28px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },
  section: {
    marginBottom: '36px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sectionIcon: {
    fontSize: '24px',
  },
  appointmentsList: {
    display: 'grid',
    gap: '16px',
  },
  appointmentCard: {
    borderRadius: '12px',
    border: '2px solid',
    padding: '20px',
    transition: 'all 0.3s ease',
  },
  cardContent: {
    marginBottom: '16px',
  },
  doctorSection: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    alignItems: 'flex-start',
  },
  doctorIcon: {
    fontSize: '40px',
    width: '64px',
    height: '64px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 4px 0',
  },
  detailText: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0',
  },
  appointmentDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
  },
  detailItem: {
    display: 'flex',
    gap: '8px',
  },
  detailIcon: {
    fontSize: '16px',
    minWidth: '20px',
  },
  detailLabel: {
    fontSize: '11px',
    color: '#6b7280',
    fontWeight: '600',
    margin: '0 0 2px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  detailValue: {
    fontSize: '13px',
    color: '#374151',
    fontWeight: '500',
    margin: '0',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    border: '1px solid',
    margin: '0',
  },
  completedMessage: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '600',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  completeBtn: {
    padding: '10px 14px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  rebookBtn: {
    padding: '10px 14px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  cancelBtn: {
    padding: '10px 14px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: '2px solid #dc2626',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
};
