import React from 'react';
import { ListTodo, CheckCircle2, Clock, Flame } from 'lucide-react';

export default function StatsHeader({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter(t => t.priority === 'High' && !t.completed).length;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-info">
          <h4>إجمالي المهام</h4>
          <div className="value" style={{ color: 'var(--primary)' }}>{total}</div>
        </div>
        <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
          <ListTodo size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <h4>المهام المكتملة</h4>
          <div className="value" style={{ color: 'var(--success)' }}>{completed}</div>
        </div>
        <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
          <CheckCircle2 size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <h4>قيد الإنجاز</h4>
          <div className="value" style={{ color: 'var(--warning)' }}>{pending}</div>
        </div>
        <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
          <Clock size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <h4>أولوية عالية</h4>
          <div className="value" style={{ color: 'var(--danger)' }}>{highPriority}</div>
        </div>
        <div className="stat-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
          <Flame size={24} />
        </div>
      </div>
    </div>
  );
}
