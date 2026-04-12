# QUICK START GUIDE - Maternal Health ML Model

## 🚀 Get Started in 5 Steps

### Step 1: Install Dependencies (2 minutes)
```bash
pip install -r requirements.txt
```

### Step 2: Configure Kaggle API (5 minutes)
**Windows:**
1. Go to https://www.kaggle.com/account
2. Click "Create New API Token"
3. Save `kaggle.json` to: `C:\Users\<YourUsername>\.kaggle\`
4. Run: `kaggle datasets list` (verify it works)

**Mac/Linux:**
1. Same steps as Windows
2. Save to: `~/.kaggle/kaggle.json`
3. Run: `chmod 600 ~/.kaggle/kaggle.json`
4. Run: `kaggle datasets list` (verify it works)

### Step 3: Train the Model (5-10 minutes)
```bash
python train_model.py
```

**Wait for:**
- ✓ Dataset downloaded
- ✓ Data analysis complete
- ✓ 3 models trained
- ✓ Best model selected
- ✓ Models saved to `models/` folder
- ✓ Evaluation plots generated

### Step 4: Test Predictions (2 minutes)
```bash
python predict.py
```

**You'll see:**
- Example prediction 1 (healthy mother)
- Example prediction 2 (high-risk mother)
- Confidence scores

### Step 5: Use in Your Code (optional)
```python
from predict import MaternalHealthPredictor

predictor = MaternalHealthPredictor()

# Make a prediction
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

print(result)
# Output: {'prediction': 'Normal', 'probability': 0.92, 'confidence': '92.00%'}
```

## 📊 What You Get

### Training Output
```
models/
├── Gradient_Boosting_model.pkl  (best model)
├── scaler.pkl                   (feature normalization)
├── label_encoders.pkl           (categorical encoding)
├── target_encoder.pkl           (class labels)
├── metadata.json                (model metadata)
└── model_evaluation.png         (4 plots)
```

### Model Performance Metrics
- **Test Accuracy:** ~75-85%
- **ROC-AUC:** ~0.80-0.90
- **Confusion Matrix:** True positives vs false positives
- **Feature Importance:** Top 10 most influential features

## 📈 Expected Results

**Model Comparison:**
```
Logistic Regression:  ~75-80% accuracy
Random Forest:        ~80-85% accuracy
Gradient Boosting:    ~82-88% accuracy (Usually Wins!)
```

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Kaggle API not found | Run: `pip install kaggle` |
| "kaggle.json not found" | Verify file location and permissions |
| ModuleNotFoundError | Run: `pip install -r requirements.txt` |
| Models directory not found | Run training script first: `python train_model.py` |
| Slow processing | First run is slower due to dataset download |

## 📝 Feature List

**Required input features (14 total):**
- age (int: 18-45)
- pre_pregnancy_bmi (float: 15-40)
- gestational_age_weeks (int: 28-42)
- blood_pressure_systolic (int: 90-160)
- blood_pressure_diastolic (int: 60-100)
- hemoglobin_level (float: 8-15)
- number_of_prenatal_visits (int: 0-15)
- has_diabetes (0 or 1)
- has_hypertension (0 or 1)
- smoking_status ('Yes' or 'No')
- alcohol_consumption ('Yes' or 'No')
- education_level ('None', 'Primary', 'Secondary', or 'Higher')
- household_income (int: 10000-200000)
- iron_supplementation (0 or 1)

**Target classes:**
- Low (low birth weight)
- Normal (normal birth weight)

## 🎯 Next Steps After Training

1. ✅ Review `model_evaluation.png` for visual performance metrics
2. ✅ Check `metadata.json` for model details
3. ✅ Integrate prediction API into your Streamlit app
4. ✅ Deploy model to production (if needed)

## 📚 Learn More

- See `README.md` for detailed documentation
- Check `train_model.py` for training implementation
- See `predict.py` for prediction API details
- Original dataset: https://www.kaggle.com/datasets/ziya07/maternal-health-features-dataset

---

**Everything ready? Run:** `python train_model.py`
