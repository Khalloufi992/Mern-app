import React from 'react';
import { Layers, Plus, Database, Server } from 'lucide-react';

export default function Navbar({ onOpenNewTaskModal, serverStatus }) {
  const isOnline = serverStatus.status === 'online';

  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <Layers size={24} />
        </div>
        <div>
          <h1 className="brand-title">MERN TaskPulse</h1>
          <p className="brand-subtitle">تطبيق بسيط لإدارة المهام مع عمليات CRUD الكاملة</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="status-pill">
          <span className={`status-dot ${!isOnline ? 'offline' : ''}`}></span>
          <span style={{ color: 'var(--text-muted)' }}>
            {isOnline ? (serverStatus.database || 'السيرفر متصل') : 'جاري الاتصال بالسيرفر...'}
          </span>
        </div>

        <button className="btn btn-primary" onClick={onOpenNewTaskModal}>
          <Plus size={18} />
          <span>مهمة جديدة</span>
        </button>
      </div>
    </header>
  );
}
