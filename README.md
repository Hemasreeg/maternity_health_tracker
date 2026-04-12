# Maternal Health ML Model Training & Prediction

This project trains machine learning models to predict birth weight categories (Low vs Normal) based on maternal health features. It includes model training, evaluation, and prediction capabilities.

## Dataset

**Source:** [Kaggle - Maternal Health Features Dataset](https://www.kaggle.com/datasets/ziya07/maternal-health-features-dataset)

**Dataset Size:** 200 maternal health records with 15 features

**Target Variable:** `birth_weight_category` (Low or Normal)

**Key Features:**
- Demographics: age, education level, household income
- Health Metrics: BMI, blood pressure, hemoglobin levels
- Pregnancy Info: gestational age, prenatal visits
- Health Conditions: diabetes, hypertension
- Lifestyle: smoking status, alcohol consumption
- Treatment: iron supplementation

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Kaggle API

To download the dataset automatically, you need Kaggle API credentials:

**Setup Steps:**
1. Go to [Kaggle Account Settings](https://www.kaggle.com/account)
2. Scroll to "API" section
3. Click "Create New API Token"
4. A `kaggle.json` file will download
5. Save it to: `~/.kaggle/kaggle.json` (or `C:\Users\<YourUsername>\.kaggle\kaggle.json` on Windows)
6. Set file permissions (Unix/Mac): `chmod 600 ~/.kaggle/kaggle.json`

**Verify Installation:**
```bash
kaggle datasets list
```

## Usage

### Training the Model

```bash
python train_model.py
```

**This script will:**
1. ✓ Download dataset from Kaggle
2. ✓ Explore and analyze data
3. ✓ Preprocess and encode features
4. ✓ Train 3 classification models:
   - Logistic Regression
   - Random Forest
   - Gradient Boosting
5. ✓ Evaluate and select the best model
6. ✓ Analyze feature importance
7. ✓ Save trained models and preprocessors
8. ✓ Generate evaluation visualizations

**Output Files:**
```
models/
├── Gradient_Boosting_model.pkl (or best model)
├── scaler.pkl
├── label_encoders.pkl
├── target_encoder.pkl
├── metadata.json
└── model_evaluation.png
```

### Making Predictions

#### Option 1: Python Script

```bash
python predict.py
```

This demonstrates:
- Single prediction example
- Batch predictions example

#### Option 2: Python API

```python
from predict import MaternalHealthPredictor

# Initialize predictor
predictor = MaternalHealthPredictor()

# Make prediction
result = predictor.predict({
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
})

print(f"Prediction: {result['prediction']}")
print(f"Confidence: {result['confidence']}")
```

#### Option 3: Streamlit Web App Integration

The trained model can be integrated into your Streamlit app:

```python
from predict import MaternalHealthPredictor

# In your Streamlit app
predictor = MaternalHealthPredictor()

# Get user input and make prediction
if st.button("Predict Birth Weight Category"):
    result = predictor.predict(user_data)
    st.success(f"Prediction: {result['prediction']} ({result['confidence']})")
```

## Model Performance

After training, you'll see metrics like:
- **Test Accuracy:** How many predictions were correct
- **ROC-AUC Score:** Model's ability to distinguish between classes (0-1 scale, higher is better)
- **Confusion Matrix:** Distribution of correct/incorrect predictions
- **Feature Importance:** Which features most influence predictions

## Project Structure

```
maternal_health_app/
├── app.py                    # Streamlit pregnancy tracker
├── train_model.py            # Model training script
├── predict.py                # Prediction API
├── requirements.txt          # Python dependencies
├── README.md                 # This file
├── birth_weight_dataset.csv  # Downloaded dataset
└── models/                   # Saved models directory
    ├── *_model.pkl
    ├── scaler.pkl
    ├── label_encoders.pkl
    ├── target_encoder.pkl
    ├── metadata.json
    └── model_evaluation.png
```

## Feature Descriptions

| Feature | Type | Range | Description |
|---------|------|-------|-------------|
| age | Integer | 18-45 | Age of mother in years |
| pre_pregnancy_bmi | Float | 15-40 | Body Mass Index before pregnancy |
| gestational_age_weeks | Integer | 28-42 | Weeks of pregnancy at birth |
| blood_pressure_systolic | Integer | 90-160 | Systolic BP in mmHg |
| blood_pressure_diastolic | Integer | 60-100 | Diastolic BP in mmHg |
| hemoglobin_level | Float | 8-15 | Hemoglobin in g/dL |
| number_of_prenatal_visits | Integer | 0-15 | Number of prenatal checkups |
| has_diabetes | Binary | 0/1 | 1 = Yes, 0 = No |
| has_hypertension | Binary | 0/1 | 1 = Yes, 0 = No |
| smoking_status | Categorical | Yes/No | Smoking during pregnancy |
| alcohol_consumption | Categorical | Yes/No | Alcohol use during pregnancy |
| education_level | Categorical | None/Primary/Secondary/Higher | Mother's education |
| household_income | Integer | 10000-200000 | Monthly household income |
| iron_supplementation | Binary | 0/1 | 1 = Yes, 0 = No |
| **birth_weight_category** | **Categorical** | **Low/Normal** | **Target variable** |

## Model Algorithms

### 1. Logistic Regression
- Fast, interpretable linear model
- Good for baseline performance

### 2. Random Forest
- Ensemble of decision trees
- Captures non-linear relationships
- Provides feature importance

### 3. Gradient Boosting
- Sequential ensemble learning
- Often highest accuracy
- Slower training but best predictions

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'kaggle'"
**Solution:**
```bash
pip install kaggle
```

### Issue: "Kaggle API credentials not found"
**Solution:**
1. Create Kaggle API token (see Setup Instructions above)
2. Place kaggle.json in `~/.kaggle/` directory
3. Ensure correct permissions: `chmod 600 ~/.kaggle/kaggle.json`

### Issue: "Models directory not found"
**Solution:**
Ensure you've run `train_model.py` first to train and save models

### Issue: Dataset not downloading
**Solution:**
1. Verify internet connection
2. Check Kaggle API credentials
3. Try manual download from [Kaggle](https://www.kaggle.com/datasets/ziya07/maternal-health-features-dataset)
4. Place CSV file in project root: `birth_weight_dataset.csv`

## Next Steps

1. **Run Training:**
   ```bash
   python train_model.py
   ```

2. **Test Predictions:**
   ```bash
   python predict.py
   ```

3. **Integration:**
   Add prediction capability to your Streamlit app in `app.py`

4. **Deployment:**
   - Save trained model artifacts
   - Deploy API or Streamlit app to cloud

## Resources

- [Kaggle Datasets](https://www.kaggle.com/datasets)
- [Scikit-learn Documentation](https://scikit-learn.org/)
- [Pandas Documentation](https://pandas.pydata.org/)
- [Streamlit Documentation](https://docs.streamlit.io/)

## License

Dataset License: CC0: Public Domain

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review training logs and error messages
3. Verify all dependencies are installed correctly

---

**Ready to train your model?** Run `python train_model.py` to get started!
