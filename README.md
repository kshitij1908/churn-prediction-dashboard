# 🚀 Customer Churn Prediction Dashboard

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A high-performance, premium machine learning dashboard designed to predict telecom customer churn with high precision. This project leverages advanced ML algorithms and a modern glassmorphic UI to provide actionable business insights.

![Dashboard Preview](https://raw.githubusercontent.com/kshitij1908/churn-prediction-dashboard/main/preview.png) *(Note: Add your screenshot here)*

## ✨ Key Features

- **🎯 Precision Analytics**: Compare Logistic Regression, Random Forest, and XGBoost models.
- **⚖️ Class Balancing**: Implements SMOTE (Synthetic Minority Over-sampling Technique) to handle imbalanced churn data.
- **⚡ Real-time Predictions**: Instant churn risk assessment for individual customers.
- **📊 Interactive Visualizations**: Dynamic charts showing churn drivers, tenure distribution, and contract impacts.
- **💎 Premium UI/UX**: Built with Framer Motion, TailwindCSS, and Lucide icons for a state-of-the-art experience.

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | FastAPI, Scikit-Learn, XGBoost, Pandas, NumPy, SMOTE |
| **Frontend** | Vite, React 18, TailwindCSS, Recharts, Framer Motion |
| **Development** | Python 3.9+, Node.js 18+, PowerShell |

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/kshitij1908/churn-prediction-dashboard.git
cd churn-prediction-dashboard
```

### 2. Setup Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Quick Start (Windows)
Simply run the included PowerShell script to launch both servers simultaneously:
```powershell
./run.ps1
```

## 📈 Model Performance

| Model | Accuracy | ROC-AUC |
|---|---|---|
| **XGBoost** | 83.4% | 0.92 |
| **Random Forest** | 81.2% | 0.89 |
| **Logistic Regression** | 79.5% | 0.86 |

## 📂 Project Structure

```text
churn-prediction-dashboard/
├── backend/            # FastAPI Server & ML Logic
│   ├── data/           # Dataset storage
│   ├── main.py         # API Endpoints
│   └── model.py        # ML Model Training & Inference
├── frontend/           # React Dashboard
│   ├── src/            # Components & Logic
│   └── public/         # Static Assets
└── run.ps1             # Startup Script
```

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Developed with ❤️ by [Kshitij](https://github.com/kshitij1908)
