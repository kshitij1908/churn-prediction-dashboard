import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import api from '../lib/api';

const PredictorForm = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    gender: 1,
    SeniorCitizen: 0,
    Partner: 0,
    Dependents: 0,
    tenure: 12,
    PhoneService: 1,
    MultipleLines: 0,
    InternetService: 1,
    OnlineSecurity: 0,
    OnlineBackup: 0,
    DeviceProtection: 0,
    TechSupport: 0,
    StreamingTV: 0,
    StreamingMovies: 0,
    Contract: 0,
    PaperlessBilling: 1,
    PaymentMethod: 1,
    MonthlyCharges: 70.0,
    TotalCharges: 840.0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await api.post('/predict', { data: formData, model: 'rf' });
      setResult(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-primary" />
        <h2 className="text-xl font-bold">Churn Predictor Tool</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">Tenure (months)</label>
            <input 
              type="number" name="tenure" value={formData.tenure} 
              onChange={handleChange} className="input-field" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">Monthly Charges ($)</label>
            <input 
              type="number" name="MonthlyCharges" value={formData.MonthlyCharges} 
              onChange={handleChange} className="input-field" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">Contract Type</label>
            <select name="Contract" value={formData.Contract} onChange={handleChange} className="input-field">
              <option value={0}>Month-to-month</option>
              <option value={1}>One year</option>
              <option value={2}>Two year</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">Internet Service</label>
            <select name="InternetService" value={formData.InternetService} onChange={handleChange} className="input-field">
              <option value={0}>DSL</option>
              <option value={1}>Fiber optic</option>
              <option value={2}>None</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">Online Security</label>
            <select name="OnlineSecurity" value={formData.OnlineSecurity} onChange={handleChange} className="input-field">
              <option value={0}>No</option>
              <option value={2}>Yes</option>
              <option value={1}>No internet service</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">Tech Support</label>
            <select name="TechSupport" value={formData.TechSupport} onChange={handleChange} className="input-field">
              <option value={0}>No</option>
              <option value={2}>Yes</option>
              <option value={1}>No internet service</option>
            </select>
          </div>
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Analyze Customer Risk"}
        </button>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 pt-8 border-t border-border"
          >
            <div className={`p-6 rounded-2xl flex flex-col items-center text-center ${
              result.prediction === 1 ? 'bg-destructive/10 border border-destructive/20' : 'bg-green-500/10 border border-green-500/20'
            }`}>
              {result.prediction === 1 ? (
                <AlertCircle className="text-destructive mb-3" size={48} />
              ) : (
                <CheckCircle2 className="text-green-500 mb-3" size={48} />
              )}
              
              <h3 className="text-2xl font-bold mb-1">
                {result.prediction === 1 ? 'High Risk of Churn' : 'Low Risk / Loyal Customer'}
              </h3>
              <p className="text-foreground/70 mb-4">
                The model predicts a <span className="font-bold text-foreground">{(result.churn_probability * 100).toFixed(1)}%</span> chance of this customer leaving.
              </p>
              
              <div className="w-full bg-muted rounded-full h-4 mb-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.churn_probability * 100}%` }}
                  className={`h-full ${result.prediction === 1 ? 'bg-destructive' : 'bg-green-500'}`}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PredictorForm;
