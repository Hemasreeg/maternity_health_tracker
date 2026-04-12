"""
Maternal Health Model Prediction Script
Uses trained model to make predictions on new maternal health data
"""

import pickle
import json
import pandas as pd
import numpy as np
import os

class MaternalHealthPredictor:
    """Load and use trained model for predictions"""
    
    def __init__(self, model_dir='models'):
        """Initialize predictor with trained models and preprocessors"""
        self.model_dir = model_dir
        self.model = None
        self.scaler = None
        self.label_encoders = None
        self.target_encoder = None
        self.metadata = None
        
        self.load_models()
    
    def load_models(self):
        """Load all saved models and preprocessing objects"""
        try:
            # Load metadata
            with open(os.path.join(self.model_dir, 'metadata.json'), 'r') as f:
                self.metadata = json.load(f)
            
            # Find and load the best model
            best_model_name = self.metadata['best_model'].replace(' ', '_')
            model_path = os.path.join(self.model_dir, f'{best_model_name}_model.pkl')
            
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            
            # Load scaler
            with open(os.path.join(self.model_dir, 'scaler.pkl'), 'rb') as f:
                self.scaler = pickle.load(f)
            
            # Load label encoders
            with open(os.path.join(self.model_dir, 'label_encoders.pkl'), 'rb') as f:
                self.label_encoders = pickle.load(f)
            
            # Load target encoder
            with open(os.path.join(self.model_dir, 'target_encoder.pkl'), 'rb') as f:
                self.target_encoder = pickle.load(f)
            
            print(f"✓ Loaded model: {self.metadata['best_model']}")
            print(f"✓ Test Accuracy: {self.metadata['test_accuracy']:.4f}")
            print(f"✓ ROC-AUC: {self.metadata['roc_auc']:.4f}")
            
        except FileNotFoundError as e:
            raise Exception(f"Model files not found. Please train the model first. Error: {e}")
    
    def predict(self, data_dict):
        """
        Make prediction on new maternal health data
        
        Args:
            data_dict: Dictionary with feature names as keys and values
                      Example: {'age': 25, 'pre_pregnancy_bmi': 22.5, ...}
        
        Returns:
            dict with 'prediction' (class name) and 'probability' (confidence)
        """
        # Create DataFrame from input
        df = pd.DataFrame([data_dict])
        
        # Ensure all features are present
        for feature in self.metadata['feature_names']:
            if feature not in df.columns:
                raise ValueError(f"Missing feature: {feature}")
        
        # Select and reorder features
        df = df[self.metadata['feature_names']]
        
        # Encode categorical features
        for col in self.metadata['categorical_features']:
            if col in self.label_encoders:
                df[col] = self.label_encoders[col].transform(df[col].astype(str))
        
        # Scale features
        df_scaled = self.scaler.transform(df)
        
        # Make prediction
        prediction = self.model.predict(df_scaled)[0]
        probability = np.max(self.model.predict_proba(df_scaled))
        
        # Decode prediction
        prediction_label = self.target_encoder.inverse_transform([prediction])[0]
        
        return {
            'prediction': prediction_label,
            'probability': float(probability),
            'confidence': f"{probability*100:.2f}%"
        }
    
    def predict_batch(self, data_list):
        """
        Make predictions on multiple samples
        
        Args:
            data_list: List of dictionaries, each containing feature values
        
        Returns:
            DataFrame with predictions
        """
        results = []
        for data in data_list:
            result = self.predict(data)
            result['input'] = data
            results.append(result)
        
        return pd.DataFrame(results)


# Example usage
if __name__ == '__main__':
    # Initialize predictor
    predictor = MaternalHealthPredictor()
    
    # Example 1: Single prediction
    print("\n" + "="*60)
    print("EXAMPLE 1: Single Prediction")
    print("="*60)
    
    example_data = {
        'age': 28,
        'pre_pregnancy_bmi': 23.5,
        'gestational_age_weeks': 38,
        'blood_pressure_systolic': 120,
        'blood_pressure_diastolic': 80,
        'hemoglobin_level': 12.5,
        'number_of_prenatal_visits': 8,
        'has_diabetes': 0,
        'has_hypertension': 0,
        'smoking_status': 'No',
        'alcohol_consumption': 'No',
        'education_level': 'Higher',
        'household_income': 50000,
        'iron_supplementation': 1
    }
    
    result = predictor.predict(example_data)
    print(f"\nInput Data: {example_data}")
    print(f"Prediction: {result['prediction']}")
    print(f"Confidence: {result['confidence']}")
    
    # Example 2: Batch prediction
    print("\n" + "="*60)
    print("EXAMPLE 2: Batch Predictions")
    print("="*60)
    
    batch_data = [
        {
            'age': 25, 'pre_pregnancy_bmi': 21.0, 'gestational_age_weeks': 37,
            'blood_pressure_systolic': 115, 'blood_pressure_diastolic': 75,
            'hemoglobin_level': 13.0, 'number_of_prenatal_visits': 10,
            'has_diabetes': 0, 'has_hypertension': 0, 'smoking_status': 'No',
            'alcohol_consumption': 'No', 'education_level': 'Higher',
            'household_income': 60000, 'iron_supplementation': 1
        },
        {
            'age': 35, 'pre_pregnancy_bmi': 28.0, 'gestational_age_weeks': 36,
            'blood_pressure_systolic': 140, 'blood_pressure_diastolic': 90,
            'hemoglobin_level': 11.0, 'number_of_prenatal_visits': 5,
            'has_diabetes': 1, 'has_hypertension': 1, 'smoking_status': 'Yes',
            'alcohol_consumption': 'No', 'education_level': 'Primary',
            'household_income': 30000, 'iron_supplementation': 0
        }
    ]
    
    batch_results = predictor.predict_batch(batch_data)
    print("\nBatch Results:")
    print(batch_results[['prediction', 'confidence']].to_string(index=False))
