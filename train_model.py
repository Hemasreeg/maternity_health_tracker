"""
Maternal Health Model Training Script
Downloads dataset from Kaggle and trains a classification model
to predict birth weight categories (Low vs Normal)
"""

import os
import pandas as pd
import numpy as np
import warnings
import sys
import subprocess
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_auc_score, roc_curve
import matplotlib.pyplot as plt
import seaborn as sns
import pickle
import json

# Set style for visualizations
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)

print("=" * 60)
print("MATERNAL HEALTH MODEL TRAINING")
print("=" * 60)

# Step 1: Download dataset from Kaggle
print("\n[Step 1] Downloading dataset from Kaggle...")
print("-" * 60)

try:
    # Check if Kaggle API is configured
    kaggle_dir = os.path.expanduser('~/.kaggle')
    if not os.path.exists(os.path.join(kaggle_dir, 'kaggle.json')):
        print("⚠️ Kaggle API credentials not found!")
        print("Setup instructions:")
        print("1. Go to https://www.kaggle.com/account")
        print("2. Click 'Create New API Token'")
        print(f"3. Save the kaggle.json to: {kaggle_dir}")
        print("4. Run this script again")
        exit(1)
    
    # Download dataset using Kaggle API
    from kaggle.api.kaggle_api_extended import KaggleApi
    api = KaggleApi()
    api.authenticate()
    api.dataset_download_files('ziya07/maternal-health-features-dataset', path='.', unzip=True)
    print("✓ Dataset downloaded successfully!")
    
except FileNotFoundError:
    print("⚠️ Dataset file not found locally, attempting manual download...")
except Exception as e:
    print(f"⚠️ Warning: {e}")
    print("Continuing with training...")

# Step 2: Load and explore data
print("\n[Step 2] Loading and exploring data...")
print("-" * 60)

try:
    df = pd.read_csv('birth_weight_dataset.csv')
except FileNotFoundError:
    print(f"❌ Dataset file not found. Expected 'birth_weight_dataset.csv'")
    exit(1)

print(f"Dataset shape: {df.shape}")
print(f"\nFirst few rows:")
print(df.head())
print(f"\nData types:")
print(df.dtypes)
print(f"\nMissing values:")
print(df.isnull().sum())
print(f"\nDataset statistics:")
print(df.describe())
print(f"\nTarget variable distribution:")
print(df['birth_weight_category'].value_counts())

# Step 3: Data preprocessing
print("\n[Step 3] Preprocessing data...")
print("-" * 60)

# Create a copy for processing
X = df.drop('birth_weight_category', axis=1).copy()
y = df['birth_weight_category'].copy()

print(f"Features: {list(X.columns)}")
print(f"Target: {y.name} - Classes: {y.unique()}")

# Handle categorical variables
categorical_cols = X.select_dtypes(include=['object']).columns.tolist()
numeric_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()

print(f"\nCategorical columns: {categorical_cols}")
print(f"Numeric columns: {numeric_cols}")

# Encode categorical features
label_encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col].astype(str))
    label_encoders[col] = le
    print(f"  {col}: {dict(zip(le.classes_, le.transform(le.classes_)))}")

# Encode target variable
y_encoder = LabelEncoder()
y_encoded = y_encoder.fit_transform(y)
print(f"\nTarget encoding: {dict(zip(y_encoder.classes_, y_encoder.transform(y_encoder.classes_)))}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

print(f"\nTraining set: {X_train.shape}")
print(f"Test set: {X_test.shape}")
print(f"Class distribution in train: {np.bincount(y_train)}")
print(f"Class distribution in test: {np.bincount(y_test)}")

# Standardize features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("✓ Data preprocessing completed!")

# Step 4: Train multiple models
print("\n[Step 4] Training classification models...")
print("-" * 60)

models = {
    'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
}

trained_models = {}
results = {}

for model_name, model in models.items():
    print(f"\nTraining {model_name}...")
    model.fit(X_train_scaled, y_train)
    trained_models[model_name] = model
    
    # Predictions
    y_pred_train = model.predict(X_train_scaled)
    y_pred_test = model.predict(X_test_scaled)
    y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
    
    # Metrics
    train_acc = accuracy_score(y_train, y_pred_train)
    test_acc = accuracy_score(y_test, y_pred_test)
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    
    results[model_name] = {
        'train_accuracy': train_acc,
        'test_accuracy': test_acc,
        'roc_auc': roc_auc,
        'y_pred': y_pred_test,
        'y_pred_proba': y_pred_proba
    }
    
    print(f"  Train Accuracy: {train_acc:.4f}")
    print(f"  Test Accuracy: {test_acc:.4f}")
    print(f"  ROC-AUC: {roc_auc:.4f}")

# Step 5: Select best model and evaluate
print("\n[Step 5] Evaluating best model...")
print("-" * 60)

best_model_name = max(results, key=lambda x: results[x]['test_accuracy'])
best_model = trained_models[best_model_name]
best_result = results[best_model_name]

print(f"Best Model: {best_model_name}")
print(f"Test Accuracy: {best_result['test_accuracy']:.4f}")
print(f"ROC-AUC Score: {best_result['roc_auc']:.4f}")

print(f"\nClassification Report:")
print(classification_report(y_test, best_result['y_pred'], 
                          target_names=y_encoder.classes_))

# Confusion Matrix
cm = confusion_matrix(y_test, best_result['y_pred'])
print(f"\nConfusion Matrix:")
print(cm)

# Step 6: Feature importance
print("\n[Step 6] Feature importance analysis...")
print("-" * 60)

if hasattr(best_model, 'feature_importances_'):
    importances = best_model.feature_importances_
    feature_importance_df = pd.DataFrame({
        'feature': X.columns,
        'importance': importances
    }).sort_values('importance', ascending=False)
    
    print("\nTop 10 Most Important Features:")
    print(feature_importance_df.head(10).to_string(index=False))

# Step 7: Save models and metadata
print("\n[Step 7] Saving models and metadata...")
print("-" * 60)

# Create models directory
os.makedirs('models', exist_ok=True)

# Save best model
model_path = f'models/{best_model_name.replace(" ", "_")}_model.pkl'
with open(model_path, 'wb') as f:
    pickle.dump(best_model, f)
print(f"✓ Saved best model: {model_path}")

# Save scaler
scaler_path = 'models/scaler.pkl'
with open(scaler_path, 'wb') as f:
    pickle.dump(scaler, f)
print(f"✓ Saved scaler: {scaler_path}")

# Save label encoders
encoders_path = 'models/label_encoders.pkl'
with open(encoders_path, 'wb') as f:
    pickle.dump(label_encoders, f)
print(f"✓ Saved label encoders: {encoders_path}")

# Save target encoder
target_encoder_path = 'models/target_encoder.pkl'
with open(target_encoder_path, 'wb') as f:
    pickle.dump(y_encoder, f)
print(f"✓ Saved target encoder: {target_encoder_path}")

# Save metadata
metadata = {
    'best_model': best_model_name,
    'test_accuracy': float(best_result['test_accuracy']),
    'roc_auc': float(best_result['roc_auc']),
    'feature_names': X.columns.tolist(),
    'categorical_features': categorical_cols,
    'numeric_features': numeric_cols,
    'target_classes': y_encoder.classes_.tolist()
}

metadata_path = 'models/metadata.json'
with open(metadata_path, 'w') as f:
    json.dump(metadata, f, indent=4)
print(f"✓ Saved metadata: {metadata_path}")

# Step 8: Create visualizations
print("\n[Step 8] Creating visualizations...")
print("-" * 60)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# 1. Confusion Matrix
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[0, 0],
            xticklabels=y_encoder.classes_,
            yticklabels=y_encoder.classes_)
axes[0, 0].set_title(f'Confusion Matrix - {best_model_name}')
axes[0, 0].set_ylabel('True Label')
axes[0, 0].set_xlabel('Predicted Label')

# 2. Model Comparison
model_names = list(results.keys())
test_accs = [results[m]['test_accuracy'] for m in model_names]
axes[0, 1].bar(model_names, test_accs, color=['#1f77b4', '#ff7f0e', '#2ca02c'])
axes[0, 1].set_title('Model Comparison - Test Accuracy')
axes[0, 1].set_ylabel('Accuracy')
axes[0, 1].set_ylim([0, 1])
for i, v in enumerate(test_accs):
    axes[0, 1].text(i, v + 0.02, f'{v:.3f}', ha='center')

# 3. ROC Curve
fpr, tpr, _ = roc_curve(y_test, best_result['y_pred_proba'])
axes[1, 0].plot(fpr, tpr, lw=2, label=f'ROC curve (AUC = {best_result["roc_auc"]:.3f})')
axes[1, 0].plot([0, 1], [0, 1], 'k--', lw=1, label='Random Classifier')
axes[1, 0].set_xlabel('False Positive Rate')
axes[1, 0].set_ylabel('True Positive Rate')
axes[1, 0].set_title('ROC Curve')
axes[1, 0].legend()
axes[1, 0].grid(True, alpha=0.3)

# 4. Feature Importance (if available)
if hasattr(best_model, 'feature_importances_'):
    top_features = feature_importance_df.head(10)
    axes[1, 1].barh(range(len(top_features)), top_features['importance'].values)
    axes[1, 1].set_yticks(range(len(top_features)))
    axes[1, 1].set_yticklabels(top_features['feature'].values)
    axes[1, 1].set_xlabel('Importance')
    axes[1, 1].set_title('Top 10 Feature Importance')
    axes[1, 1].invert_yaxis()
else:
    axes[1, 1].text(0.5, 0.5, 'Feature importance not available for this model',
                   ha='center', va='center', transform=axes[1, 1].transAxes)
    axes[1, 1].set_title('Feature Importance')

plt.tight_layout()
plt.savefig('models/model_evaluation.png', dpi=300, bbox_inches='tight')
print("✓ Saved evaluation plot: models/model_evaluation.png")
plt.close()

# Summary
print("\n" + "=" * 60)
print("TRAINING COMPLETED SUCCESSFULLY!")
print("=" * 60)
print(f"\nBest Model: {best_model_name}")
print(f"Test Accuracy: {best_result['test_accuracy']:.4f}")
print(f"ROC-AUC Score: {best_result['roc_auc']:.4f}")
print(f"\nModels saved in directory: models/")
print(f"  - {best_model_name.replace(' ', '_')}_model.pkl")
print(f"  - scaler.pkl")
print(f"  - label_encoders.pkl")
print(f"  - target_encoder.pkl")
print(f"  - metadata.json")
print(f"  - model_evaluation.png")
print("=" * 60)
