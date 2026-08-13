import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-400" />}
          {toast.type === 'danger' && <AlertCircle size={18} className="text-rose-400" />}
          {toast.type === 'info' && <Info size={18} className="text-indigo-400" />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
