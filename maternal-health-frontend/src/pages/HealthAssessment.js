import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { healthAPI } from '../services/api';

export default function HealthAssessment() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('form');
  const [pregnancyWeeks, setPregnancyWeeks] = useState('');
  const [symptoms, setSymptoms] = useState({
    nausea: 0,
    fatigue: 0,
    backache: 0,
    headache: 0,
    swelling: 0,
    spotting: 0,
    fever: 0,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const symptomsList = [
    { key: 'nausea', label: 'Nausea/Morning Sickness', emoji: '🤢' },
    { key: 'fatigue', label: 'Fatigue/Low Energy', emoji: '😴' },
    { key: 'backache', label: 'Back Ache', emoji: '🔙' },
    { key: 'headache', label: 'Headache', emoji: '🤕' },
    { key: 'swelling', label: 'Swelling (legs/feet)', emoji: '🦵' },
    { key: 'spotting', label: 'Vaginal Spotting', emoji: '⚠️' },
    { key: 'fever', label: 'Fever', emoji: '🌡️' },
  ];

  const handleSymptomIntensity = (key, intensity) => {
    setSymptoms({ ...symptoms, [key]: intensity });
    if (intensity > 0) {
      if (!selectedSymptoms.includes(key)) {
        setSelectedSymptoms([...selectedSymptoms, key]);
      }
    } else {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== key));
    }
  };

  const getTrimesterInfo = (weeks) => {
    const w = parseInt(weeks);
    if (w >= 1 && w <= 13) return { trimester: 1, name: 'First Trimester', color: '#667eea' };
    if (w >= 14 && w <= 26) return { trimester: 2, name: 'Second Trimester', color: '#10b981' };
    if (w >= 27 && w <= 40) return { trimester: 3, name: 'Third Trimester', color: '#f59e0b' };
    return { trimester: 0, name: 'Unknown', color: '#6b7280' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const symptomData = {};
      selectedSymptoms.forEach(key => {
        symptomData[key] = true;
      });

      const response = await healthAPI.assess(symptomData);
      const assessmentResult = {
        ...response.data,
        assessment: response.data.assessment,
        nutrition: response.data.nutrition_suggestions,
        timestamp: new Date().toLocaleDateString(),
        pregnancyWeeks: pregnancyWeeks,
      };
      setResult(assessmentResult);
      setCurrentStep('result');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to assess health'));
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    if (!riskLevel) return '#667eea';
    switch(riskLevel.toLowerCase()) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#667eea';
    }
  };

  const getRiskIcon = (riskLevel) => {
    if (!riskLevel) return '⚪';
    switch(riskLevel.toLowerCase()) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
        ← Back to Dashboard
      </button>

      {currentStep === 'form' ? (
        // FORM STEP - Pregnancy week + Symptom Intensity Scale
        <div style={styles.mainCard}>
          <h1 style={styles.title}>🏥 Advanced Health Assessment</h1>
          <p style={styles.subtitle}>Provide detailed information for accurate health insights</p>

          <form onSubmit={handleSubmit}>
            {/* Pregnancy Week Tracker */}
            <div style={styles.pregnancySection}>
              <label style={styles.inputLabel}>📅 Current Pregnancy Week:</label>
              <div style={styles.inputGroup}>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={pregnancyWeeks}
                  onChange={(e) => setPregnancyWeeks(e.target.value)}
                  placeholder="Enter week (1-40)"
                  style={styles.input}
                />
                {pregnancyWeeks && (
                  <div style={{
                    ...styles.trimesterBadge,
                    backgroundColor: getTrimesterInfo(pregnancyWeeks).color
                  }}>
                    {getTrimesterInfo(pregnancyWeeks).name}
                  </div>
                )}
              </div>
            </div>

            {/* Symptom Intensity Scale */}
            <div style={styles.symptomsContainer}>
              <h3 style={styles.sectionTitle}>📊 Rate Your Symptom Intensity (0-5)</h3>
              <p style={styles.sectionSubtitle}>0 = None, 5 = Severe</p>

              {symptomsList.map((symptom) => (
                <div key={symptom.key} style={styles.symptomRow}>
                  <div style={styles.symptomLabel}>
                    <span style={styles.symptomEmoji}>{symptom.emoji}</span>
                    <span>{symptom.label}</span>
                  </div>
                  <div style={styles.intensityScale}>
                    {[0, 1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => handleSymptomIntensity(symptom.key, level)}
                        style={{
                          ...styles.intensityButton,
                          backgroundColor: symptoms[symptom.key] === level 
                            ? getIntensityColor(level) 
                            : '#e5e7eb',
                          color: symptoms[symptom.key] === level ? 'white' : '#6b7280',
                          fontWeight: symptoms[symptom.key] === level ? 'bold' : 'normal',
                        }}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            {selectedSymptoms.length > 0 && (
              <div style={styles.summaryBox}>
                <h4 style={styles.summaryTitle}>✓ Selected Symptoms:</h4>
                <div style={styles.selectedTags}>
                  {selectedSymptoms.map(sym => 
                    symptomsList.find(s => s.key === sym)
                  ).map((symptom) => (
                    <span key={symptom.key} style={styles.tag}>
                      {symptom.emoji} {symptom.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !pregnancyWeeks || selectedSymptoms.length === 0}
              style={{
                ...styles.submitButton,
                opacity: (loading || !pregnancyWeeks || selectedSymptoms.length === 0) ? 0.5 : 1,
              }}
            >
              {loading ? '⏳ Analyzing...' : '🔍 Get Assessment & Recommendations'}
            </button>
          </form>
        </div>
      ) : (
        // RESULT STEP - Comprehensive Results Display
        <div style={styles.mainCard}>
          <div style={styles.resultHeader}>
            <h1 style={styles.resultTitle}>📋 Your Health Assessment Results</h1>
            <p style={styles.resultDate}>Assessment Date: {result?.timestamp}</p>
          </div>

          {/* Risk Gauge Box - PROMINENT */}
          <div style={{
            ...styles.riskGaugeBox,
            borderColor: getRiskColor(result?.assessment?.risk_level),
            backgroundColor: getRiskColor(result?.assessment?.risk_level) + '15'
          }}>
            <div style={styles.riskGaugeContent}>
              <div style={styles.riskIcon}>{getRiskIcon(result?.assessment?.risk_level)}</div>
              <div style={styles.riskInfo}>
                <h2 style={styles.riskLabel}>Risk Level</h2>
                <p style={{
                  ...styles.riskValue,
                  color: getRiskColor(result?.assessment?.risk_level)
                }}>
                  {result?.assessment?.risk_level || 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Health Condition */}
          <div style={styles.conditionBox}>
            <h3 style={styles.boxTitle}>🏥 Health Condition</h3>
            <p style={styles.conditionText}>{result?.assessment?.condition || 'Normal'}</p>
          </div>

          {/* Pregnancy Info */}
          {result?.pregnancyWeeks && (
            <div style={{...styles.pregnancyInfoBox, borderColor: getTrimesterInfo(result.pregnancyWeeks).color}}>
              <h3 style={styles.boxTitle}>👶 Pregnancy Status</h3>
              <p style={styles.pregnancyWeekDisplay}>
                Week {result.pregnancyWeeks} - {getTrimesterInfo(result.pregnancyWeeks).name}
              </p>
            </div>
          )}

          {/* Recommendations */}
          {result?.assessment?.recommendations && result.assessment.recommendations.length > 0 && (
            <div style={styles.recommendationsBox}>
              <h3 style={styles.boxTitle}>💡 Recommendations</h3>
              <ul style={styles.recommendationsList}>
                {result.assessment.recommendations.map((rec, idx) => (
                  <li key={idx} style={styles.recommendationItem}>
                    <span style={styles.recommendationIcon}>→</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Nutrition Plan */}
          {result?.nutrition && (
            <div style={styles.nutritionBox}>
              <h3 style={styles.boxTitle}>🥗 Personalized Nutrition Plan</h3>
              <div style={styles.foodTagsContainer}>
                {typeof result.nutrition.recommended_foods === 'string'
                  ? result.nutrition.recommended_foods.split(',').map((food, idx) => (
                      <span key={idx} style={styles.foodTag}>{food.trim()}</span>
                    ))
                  : result.nutrition.recommended_foods?.slice(0, 8).map((food, idx) => (
                      <span key={idx} style={styles.foodTag}>{food}</span>
                    ))
                }
              </div>
            </div>
          )}

          {/* Wellness Tips */}
          <div style={styles.wellnessBox}>
            <h3 style={styles.boxTitle}>✨ Wellness Tips for You</h3>
            <div style={styles.tipsGrid}>
              <div style={styles.tipCard}>
                <div style={styles.tipIcon}>💧</div>
                <p style={styles.tipText}>Stay hydrated: Drink 8-10 glasses of water daily</p>
              </div>
              <div style={styles.tipCard}>
                <div style={styles.tipIcon}>🚶</div>
                <p style={styles.tipText}>Light exercise: 30 mins daily helps with circulation</p>
              </div>
              <div style={styles.tipCard}>
                <div style={styles.tipIcon}>😴</div>
                <p style={styles.tipText}>Get rest: 7-9 hours of sleep is crucial</p>
              </div>
              <div style={styles.tipCard}>
                <div style={styles.tipIcon}>🥗</div>
                <p style={styles.tipText}>Eat balanced meals: Include all food groups</p>
              </div>
            </div>
          </div>

          {/* High Risk Alert */}
          {result?.assessment?.risk_level?.toLowerCase() === 'high' && (
            <div style={styles.alertBox}>
              <span style={styles.alertIcon}>⚠️</span>
              <div style={styles.alertContent}>
                <h4 style={styles.alertTitle}>Important: High Risk Detected</h4>
                <p style={styles.alertText}>
                  Based on your assessment, we recommend scheduling an immediate consultation with your medical provider.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button
              onClick={() => {
                setCurrentStep('form');
                setResult(null);
                setSelectedSymptoms([]);
                setSymptoms({
                  nausea: 0,
                  fatigue: 0,
                  backache: 0,
                  headache: 0,
                  swelling: 0,
                  spotting: 0,
                  fever: 0,
                });
              }}
              style={styles.secondaryButton}
            >
              📝 New Assessment
            </button>
            <button
              onClick={() => navigate('/doctors')}
              style={{
                ...styles.primaryButton,
                backgroundColor: result?.assessment?.risk_level?.toLowerCase() === 'high' 
                  ? '#dc2626' 
                  : '#667eea'
              }}
            >
              👨‍⚕️ {result?.assessment?.risk_level?.toLowerCase() === 'high' ? 'Book Urgent Consultation' : 'Book Doctor Appointment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getIntensityColor(level) {
  const colors = ['#10b981', '#84cc16', '#f59e0b', '#f97316', '#ef4444', '#be123c'];
  return colors[level] || '#6b7280';
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f8bbd0 100%)',
    padding: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  backBtn: {
    padding: '10px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid rgba(236, 72, 153, 0.3)',
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
    maxWidth: '900px',
    margin: '0 auto',
    boxShadow: '0 12px 35px rgba(236, 72, 153, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    backgroundClip: 'text',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: 'rgba(236, 72, 153, 0.7)',
    textAlign: 'center',
    marginBottom: '30px',
  },
  pregnancySection: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: 'rgba(236, 72, 153, 0.08)',
    borderRadius: '10px',
    borderLeft: '4px solid rgba(236, 72, 153, 0.5)',
  },
  inputLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgba(236, 72, 153, 0.8)',
    marginBottom: '8px',
  },
  inputGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    border: '2px solid rgba(236, 72, 153, 0.2)',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  trimesterBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
  },
  symptomsContainer: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'rgba(236, 72, 153, 0.9)',
    marginBottom: '4px',
  },
  sectionSubtitle: {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '15px',
  },
  symptomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  symptomLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    minWidth: '200px',
  },
  symptomEmoji: {
    fontSize: '18px',
  },
  intensityScale: {
    display: 'flex',
    gap: '6px',
  },
  intensityButton: {
    width: '40px',
    height: '40px',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  summaryBox: {
    padding: '15px',
    backgroundColor: '#ecfdf5',
    borderRadius: '8px',
    marginBottom: '20px',
    borderLeft: '4px solid #10b981',
  },
  summaryTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#065f46',
    marginBottom: '8px',
  },
  selectedTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tag: {
    padding: '4px 10px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '16px',
    fontSize: '12px',
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)',
  },

  // RESULT STYLES
  resultHeader: {
    textAlign: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #e5e7eb',
  },
  resultTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px',
  },
  resultDate: {
    fontSize: '13px',
    color: '#6b7280',
  },
  riskGaugeBox: {
    padding: '24px',
    borderRadius: '12px',
    border: '3px solid',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  riskGaugeContent: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: '20px',
  },
  riskIcon: {
    fontSize: '48px',
  },
  riskInfo: {
    flex: 1,
  },
  riskLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    margin: '0 0 4px 0',
  },
  riskValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0',
    textTransform: 'capitalize',
  },
  conditionBox: {
    padding: '16px',
    backgroundColor: 'rgba(236, 72, 153, 0.08)',
    borderRadius: '8px',
    borderLeft: '4px solid rgba(236, 72, 153, 0.5)',
    marginBottom: '15px',
  },
  boxTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 8px 0',
  },
  conditionText: {
    fontSize: '16px',
    color: '#111827',
    margin: '0',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  pregnancyInfoBox: {
    padding: '16px',
    backgroundColor: 'rgba(236, 72, 153, 0.08)',
    borderRadius: '8px',
    borderLeft: '4px solid rgba(236, 72, 153, 0.5)',
    marginBottom: '15px',
  },
  pregnancyWeekDisplay: {
    fontSize: '15px',
    color: '#92400e',
    margin: '0',
    fontWeight: '500',
  },
  recommendationsBox: {
    padding: '16px',
    backgroundColor: 'rgba(236, 72, 153, 0.08)',
    borderRadius: '8px',
    borderLeft: '4px solid rgba(236, 72, 153, 0.5)',
    marginBottom: '15px',
  },
  recommendationsList: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
  },
  recommendationItem: {
    fontSize: '14px',
    color: '#065f46',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },
  recommendationIcon: {
    fontWeight: 'bold',
    color: '#10b981',
    minWidth: '16px',
  },
  nutritionBox: {
    padding: '16px',
    backgroundColor: 'rgba(236, 72, 153, 0.08)',
    borderRadius: '8px',
    borderLeft: '4px solid rgba(236, 72, 153, 0.5)',
    marginBottom: '15px',
  },
  foodTagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  foodTag: {
    padding: '6px 12px',
    backgroundColor: '#ffffff',
    color: '#92400e',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid #fcd34d',
  },
  wellnessBox: {
    marginBottom: '15px',
  },
  tipsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginTop: '10px',
  },
  tipCard: {
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    textAlign: 'center',
  },
  tipIcon: {
    fontSize: '24px',
    marginBottom: '6px',
  },
  tipText: {
    fontSize: '12px',
    color: '#374151',
    margin: '0',
    lineHeight: '1.4',
  },
  alertBox: {
    padding: '16px',
    backgroundColor: '#fee2e2',
    borderRadius: '8px',
    borderLeft: '4px solid #dc2626',
    marginBottom: '15px',
    display: 'flex',
    gap: '12px',
  },
  alertIcon: {
    fontSize: '20px',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#7f1d1d',
    margin: '0 0 4px 0',
  },
  alertText: {
    fontSize: '13px',
    color: '#991b1b',
    margin: '0',
  },
  actionButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginTop: '20px',
  },
  primaryButton: {
    padding: '14px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  secondaryButton: {
    padding: '14px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};
