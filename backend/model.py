import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, roc_auc_score, confusion_matrix
from imblearn.over_sampling import SMOTE
import os
import requests

DATA_URL = "https://raw.githubusercontent.com/treselle-systems/customer_churn_analysis/master/WA_Fn-UseC_-Telco-Customer-Churn.csv"
DATA_PATH = "data/WA_Fn-UseC_-Telco-Customer-Churn.csv"

class ChurnModel:
    def __init__(self):
        self.models = {}
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.df = None
        self.feature_names = []
        self.is_trained = False
        self.metrics = {}
        self.feature_importance = []

    def download_data(self):
        if not os.path.exists("data"):
            os.makedirs("data")
        
        if not os.path.exists(DATA_PATH):
            print("Downloading dataset...")
            response = requests.get(DATA_URL)
            with open(DATA_PATH, 'wb') as f:
                f.write(response.content)
            print("Download complete.")

    def preprocess(self):
        self.download_data()
        df = pd.read_csv(DATA_PATH)
        self.df = df.copy()
        
        # Drop customerID
        df.drop(columns=['customerID'], inplace=True)
        
        # Fix TotalCharges
        df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
        df['TotalCharges'] = df['TotalCharges'].fillna(df['TotalCharges'].median())
        
        # Fill any other potential NaNs in the dataset
        df = df.ffill().bfill()
        
        # Encode binary columns
        binary_cols = ['Partner', 'Dependents', 'PhoneService', 'PaperlessBilling', 'Churn']
        for col in binary_cols:
            df[col] = df[col].map({'Yes': 1, 'No': 0})
            
        # gender
        df['gender'] = df['gender'].map({'Male': 1, 'Female': 0})
        
        # MultipleLines
        df['MultipleLines'] = df['MultipleLines'].map({'Yes': 1, 'No': 0, 'No phone service': 0})
        
        # Multi-category columns
        multi_cat_cols = [
            'InternetService', 'OnlineSecurity', 'OnlineBackup',
            'DeviceProtection', 'TechSupport', 'StreamingTV',
            'StreamingMovies', 'Contract', 'PaymentMethod'
        ]
        
        for col in multi_cat_cols:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
            self.label_encoders[col] = le
            
        self.feature_names = df.drop(columns=['Churn']).columns.tolist()
        return df

    def train(self):
        self.models = {} # Clear old models
        df = self.preprocess()
        X = df.drop(columns=['Churn'])
        y = df['Churn']
        
        # SMOTE
        smote = SMOTE(random_state=42)
        X_resampled, y_resampled = smote.fit_resample(X, y)
        
        X_train, X_test, y_train, y_test = train_test_split(
            X_resampled, y_resampled, test_size=0.2, random_state=42, stratify=y_resampled
        )
        
        # Scaling
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # 1. Logistic Regression
        lr = LogisticRegression(max_iter=1000, random_state=42)
        lr.fit(X_train_scaled, y_train)
        self.models['lr'] = lr
        
        # 2. Random Forest
        rf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
        rf.fit(X_train, y_train)
        self.models['rf'] = rf
        
        # 3. XGBoost
        xgb = XGBClassifier(n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42, use_label_encoder=False, eval_metric='logloss')
        xgb.fit(X_train, y_train)
        self.models['xgb'] = xgb
        
        # Calculate Metrics
        for name, model in self.models.items():
            X_eval = X_test_scaled if name == 'lr' else X_test
            y_pred = model.predict(X_eval)
            y_prob = model.predict_proba(X_eval)[:, 1]
            
            self.metrics[name] = {
                "accuracy": accuracy_score(y_test, y_pred),
                "auc": roc_auc_score(y_test, y_prob),
                "cm": confusion_matrix(y_test, y_pred).tolist()
            }
            
        # Feature Importance (Random Forest)
        importances = rf.feature_importances_
        feat_imp = [{"feature": f, "importance": float(i)} for f, i in zip(self.feature_names, importances)]
        self.feature_importance = sorted(feat_imp, key=lambda x: x['importance'], reverse=True)
        
        self.is_trained = True
        print("Models trained successfully.")

    def predict(self, data_dict, model_name='xgb'):
        if not self.is_trained:
            self.train()
            
        # Convert dict to DataFrame
        input_df = pd.DataFrame([data_dict])
        
        # Ensure correct column order
        input_df = input_df[self.feature_names]
        
        model = self.models.get(model_name, self.models['rf'])
        
        if model_name == 'lr':
            input_data = self.scaler.transform(input_df)
        else:
            input_data = input_df
            
        prob = model.predict_proba(input_data)[0][1]
        prediction = int(model.predict(input_data)[0])
        
        return {
            "churn_probability": float(prob),
            "prediction": prediction,
            "model_used": model_name
        }

    def get_stats(self):
        if self.df is None:
            self.preprocess()
        
        # Simple EDA stats for the frontend
        churn_dist = self.df['Churn'].value_counts(normalize=True).to_dict()
        contract_churn = self.df.groupby('Contract')['Churn'].value_counts(normalize=True).unstack().to_dict('index')
        
        # Simplify contract churn for JS
        # Contract mapping: 0: Month-to-month, 1: One year, 2: Two year
        contract_names = {0: "Month-to-month", 1: "One year", 2: "Two year"}
        formatted_contract_churn = []
        for k, v in contract_churn.items():
            formatted_contract_churn.append({
                "name": contract_names.get(k, str(k)),
                "churn": v.get('Yes', 0) if isinstance(v.get('Yes'), float) else 0, # Depending on encoding state
                "stay": v.get('No', 0) if isinstance(v.get('No'), float) else 1
            })

        return {
            "total_customers": len(self.df),
            "churn_rate": churn_dist.get('Yes', 0) if 'Yes' in churn_dist else 0.26, # Fallback
            "contract_churn": formatted_contract_churn
        }
