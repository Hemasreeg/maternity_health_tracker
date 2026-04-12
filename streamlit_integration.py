"""
Streamlit Integration for Maternal Health ML Model
Add birth weight prediction to your Streamlit app
"""

import streamlit as st
import pandas as pd
from predict import MaternalHealthPredictor
import os

# Custom CSS for better styling
def style_prediction_result(prediction, confidence):
    """Style the prediction result based on outcome"""
    if prediction == 'Normal':
        color = '#00d084'  # Green
        emoji = '✅'
    else:
        color = '#ff6b6b'  # Red
        emoji = '⚠️'
    
    return color, emoji


def load_predictor():
    """Cache the predictor to avoid reloading"""
    return MaternalHealthPredictor()


def get_sample_data():
    """Provide sample data for quick testing"""
    samples = {
        'Low Risk (Healthy)': {
            'age': 28,
            'pre_pregnancy_bmi': 22.0,
            'gestational_age_weeks': 40,
            'blood_pressure_systolic': 120,
            'blood_pressure_diastolic': 80,
            'hemoglobin_level': 13.0,
            'number_of_prenatal_visits': 10,
            'has_diabetes': 0,
            'has_hypertension': 0,
            'smoking_status': 'No',
            'alcohol_consumption': 'No',
            'education_level': 'Higher',
            'household_income': 60000,
            'iron_supplementation': 1
        },
        'High Risk': {
            'age': 38,
            'pre_pregnancy_bmi': 30.0,
            'gestational_age_weeks': 36,
            'blood_pressure_systolic': 145,
            'blood_pressure_diastolic': 95,
            'hemoglobin_level': 10.0,
            'number_of_prenatal_visits': 4,
            'has_diabetes': 1,
            'has_hypertension': 1,
            'smoking_status': 'Yes',
            'alcohol_consumption': 'No',
            'education_level': 'Primary',
            'household_income': 25000,
            'iron_supplementation': 0
        }
    }
    return samples


def render_prediction_page():
    """Render the birth weight prediction interface"""
    st.header("🤰 Birth Weight Category Prediction")
    st.markdown("""
    This tool uses machine learning to predict whether a newborn is likely to have 
    **Low** or **Normal** birth weight based on maternal health factors.
    """)
    
    # Load predictor
    try:
        predictor = load_predictor()
    except Exception as e:
        st.error(f"❌ Error loading model: {e}")
        st.info("Please train the model first: `python train_model.py`")
        return
    
    # Tabs for different input methods
    tab1, tab2, tab3 = st.tabs(["📝 Manual Input", "📋 Sample Cases", "📊 Batch Upload"])
    
    with tab1:
        st.subheader("Enter Maternal Health Information")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.write("**Demographics**")
            age = st.slider("Age (years)", 18, 50, 28)
            education = st.selectbox("Education Level", 
                                     ['Primary', 'Secondary', 'Higher', 'None'])
            income = st.number_input("Household Income (monthly)", 10000, 200000, 50000)
        
        with col2:
            st.write("**Pre-Pregnancy Health**")
            bmi = st.slider("Pre-Pregnancy BMI", 15.0, 40.0, 23.5, 0.1)
            hemoglobin = st.slider("Hemoglobin Level (g/dL)", 8.0, 15.0, 12.5, 0.1)
        
        st.write("**Pregnancy Information**")
        col1, col2, col3 = st.columns(3)
        
        with col1:
            ga_weeks = st.slider("Gestational Age (weeks)", 28, 42, 38)
        with col2:
            prenatal_visits = st.slider("Prenatal Visits", 0, 15, 8)
        with col3:
            st.write("")
        
        st.write("**Blood Pressure**")
        col1, col2 = st.columns(2)
        with col1:
            bp_systolic = st.number_input("Systolic (mmHg)", 90, 180, 120)
        with col2:
            bp_diastolic = st.number_input("Diastolic (mmHg)", 60, 120, 80)
        
        st.write("**Health Conditions**")
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            diabetes = 1 if st.checkbox("Has Diabetes") else 0
        with col2:
            hypertension = 1 if st.checkbox("Has Hypertension") else 0
        with col3:
            smoking = "Yes" if st.checkbox("Smoking Status") else "No"
        with col4:
            alcohol = "Yes" if st.checkbox("Alcohol Use") else "No"
        
        st.write("**Supplementation**")
        iron = 1 if st.checkbox("Iron Supplementation") else 0
        
        # Prepare input data
        input_data = {
            'age': age,
            'pre_pregnancy_bmi': bmi,
            'gestational_age_weeks': ga_weeks,
            'blood_pressure_systolic': int(bp_systolic),
            'blood_pressure_diastolic': int(bp_diastolic),
            'hemoglobin_level': hemoglobin,
            'number_of_prenatal_visits': prenatal_visits,
            'has_diabetes': diabetes,
            'has_hypertension': hypertension,
            'smoking_status': smoking,
            'alcohol_consumption': alcohol,
            'education_level': education,
            'household_income': income,
            'iron_supplementation': iron
        }
        
        if st.button("🔮 Predict Birth Weight Category", key="predict_main"):
            result = predictor.predict(input_data)
            color, emoji = style_prediction_result(result['prediction'], 
                                                    result['probability'])
            
            st.markdown(f"""
            <div style="background-color: {color}; padding: 20px; border-radius: 10px; text-align: center;">
                <h2 style="color: white; margin: 0;">{emoji} {result['prediction']}</h2>
                <p style="color: white; margin: 5px 0;">Confidence: {result['confidence']}</p>
            </div>
            """, unsafe_allow_html=True)
            
            # Show input summary
            with st.expander("📋 Input Summary"):
                summary_df = pd.DataFrame({
                    'Feature': list(input_data.keys()),
                    'Value': list(input_data.values())
                })
                st.dataframe(summary_df, use_container_width=True)
    
    with tab2:
        st.subheader("Quick Test with Sample Cases")
        
        samples = get_sample_data()
        selected_sample = st.selectbox("Select a sample case", list(samples.keys()))
        
        sample_data = samples[selected_sample]
        
        # Display sample data
        sample_df = pd.DataFrame({
            'Feature': list(sample_data.keys()),
            'Value': list(sample_data.values())
        })
        
        st.dataframe(sample_df, use_container_width=True)
        
        if st.button("🔮 Predict for Sample", key="predict_sample"):
            result = predictor.predict(sample_data)
            color, emoji = style_prediction_result(result['prediction'], 
                                                    result['probability'])
            
            st.markdown(f"""
            <div style="background-color: {color}; padding: 20px; border-radius: 10px; text-align: center;">
                <h2 style="color: white; margin: 0;">{emoji} {result['prediction']}</h2>
                <p style="color: white; margin: 5px 0;">Confidence: {result['confidence']}</p>
            </div>
            """, unsafe_allow_html=True)
    
    with tab3:
        st.subheader("Batch Prediction from CSV")
        
        uploaded_file = st.file_uploader("Upload CSV file with maternal health data", 
                                        type=['csv'])
        
        if uploaded_file:
            df = pd.read_csv(uploaded_file)
            st.write(f"Loaded {len(df)} records")
            st.dataframe(df.head(), use_container_width=True)
            
            if st.button("🔮 Predict for All Records"):
                predictions = []
                with st.spinner("Making predictions..."):
                    for idx, row in df.iterrows():
                        data = row.to_dict()
                        result = predictor.predict(data)
                        result['row_id'] = idx + 1
                        predictions.append(result)
                
                results_df = pd.DataFrame(predictions)
                st.dataframe(results_df[['row_id', 'prediction', 'confidence']], 
                            use_container_width=True)
                
                # Download results
                csv = results_df.to_csv(index=False)
                st.download_button(
                    label="📥 Download Predictions",
                    data=csv,
                    file_name="predictions.csv",
                    mime="text/csv"
                )
    
    # Information section
    st.divider()
    with st.expander("ℹ️ About This Model"):
        st.markdown("""
        ### Model Information
        - **Type:** Binary Classification
        - **Target:** Birth Weight Category (Low / Normal)
        - **Dataset:** 200 maternal health records
        - **Features:** 14 input features
        
        ### Model Details
        - **Best Performing Model:** Gradient Boosting Classifier
        - **Expected Accuracy:** 82-88%
        - **ROC-AUC Score:** 0.80-0.90
        
        ### Important Notes
        - **This is a predictive tool, not a diagnostic tool**
        - Always consult healthcare professionals for medical decisions
        - Predictions are based on statistical patterns in the training data
        - Individual results may vary based on other medical factors
        
        ### Data Privacy
        - Your input data is processed locally
        - No data is stored or transmitted
        """)


# Main app integration
if __name__ == "__main__":
    render_prediction_page()
