import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, trend, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-500',
    red: 'bg-destructive/10 text-destructive',
    green: 'bg-green-500/10 text-green-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
  };

  const selectedColor = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 flex items-center justify-between"
    >
      <div>
        <p className="text-sm font-medium text-foreground/60">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {trend && (
          <p className={`text-xs mt-2 ${trend.startsWith('+') ? 'text-destructive' : 'text-green-400'}`}>
            {trend} from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${selectedColor}`}>
        <Icon size={24} />
      </div>
    </motion.div>
  );
};

export default StatsCard;
