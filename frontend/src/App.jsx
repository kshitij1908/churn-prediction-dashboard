import React, { useState, useEffect } from 'react';
import { 
  Users, UserMinus, BarChart3, PieChart as PieIcon, 
  Activity, Zap, ShieldCheck, Phone, Cpu, Settings
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import StatsCard from './components/StatsCard';
import PredictorForm from './components/PredictorForm';
import api from './lib/api';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

const App = () => {
  const [metrics, setMetrics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, sRes] = await Promise.all([
          api.get('/metrics'),
          api.get('/stats')
        ]);
        setMetrics(mRes.data);
        setStats(sRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-foreground/60 font-medium">Training AI Models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg text-white">
              <Zap size={20} />
            </div>
            <span className="font-['Outfit'] text-xl font-bold tracking-tight">ChurnGuard AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-foreground/60">
            <a href="#" className="text-primary hover:text-primary/80">Dashboard</a>
            <a href="#" className="hover:text-foreground">Analytics</a>
            <a href="#" className="hover:text-foreground">Settings</a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Telecom Churn Dashboard</h1>
          <p className="text-foreground/60">Real-time customer retention analytics powered by Machine Learning.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Customers" 
            value={stats?.total_customers.toLocaleString()} 
            icon={Users} 
            color="blue"
          />
          <StatsCard 
            title="Avg. Churn Rate" 
            value={`${(stats?.churn_rate * 100).toFixed(1)}%`} 
            icon={UserMinus} 
            trend="+2.1%"
            color="red"
          />
          <StatsCard 
            title="Model Accuracy" 
            value={`${(metrics?.metrics.rf.accuracy * 100).toFixed(1)}%`} 
            icon={ShieldCheck} 
            color="green"
          />
          <StatsCard 
            title="ROC-AUC Score" 
            value={metrics?.metrics.rf.auc.toFixed(3)} 
            icon={Activity} 
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analytics Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Churn by Contract Chart */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <BarChart3 size={20} className="text-primary" />
                Churn Rate by Contract Type
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.contract_churn}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9' }}
                      itemStyle={{ color: '#f1f5f9' }}
                    />
                    <Bar dataKey="churn" name="Churn Risk" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Feature Importance */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Cpu size={20} className="text-primary" />
                Key Drivers of Churn (Random Forest)
              </h3>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics?.feature_importance.slice(0, 8)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis dataKey="feature" type="category" stroke="#94a3b8" width={120} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9' }}
                    />
                    <Bar dataKey="importance" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <PredictorForm />

            {/* Model Comparison Table */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4">Model Performance</h3>
              <div className="space-y-4">
                {Object.entries(metrics?.metrics || {})
                  .filter(([key]) => key !== 'xgb')
                  .map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                    <div className="flex flex-col">
                      <span className="font-semibold uppercase text-xs text-foreground/50">{key}</span>
                      <span className="font-bold">{key === 'xgb' ? 'XGBoost' : key === 'rf' ? 'Random Forest' : 'Logistic Regression'}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary">{(val.accuracy * 100).toFixed(1)}% Acc</div>
                      <div className="text-xs text-foreground/50">AUC: {val.auc.toFixed(3)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
