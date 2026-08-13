import React, { useState } from 'react';
import { CheckCircle2, Circle, Edit3, Trash2, Calendar, Tag } from 'lucide-react';

export default function TaskCard({ task, onToggleComplete, onEdit, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`هل أنت تأكد من رغبتك في حذف المهمة "${task.title}"؟`)) {
      setIsDeleting(true);
      onDelete(task._id);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-EG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`task-card priority-${task.priority}`} style={{ opacity: isDeleting ? 0.4 : 1 }}>
      <div>
        <div className="task-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
            <button
              className="btn-icon-only"
              onClick={() => onToggleComplete(task)}
              style={{
                background: 'transparent',
                border: 'none',
                color: task.completed ? 'var(--success)' : 'var(--text-dim)',
                cursor: 'pointer',
                padding: 0,
                marginTop: '2px',
              }}
              title={task.completed ? 'تعيين كغير مكتملة' : 'تعيين كمكتملة'}
            >
              {task.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
            </button>

            <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
              {task.title}
            </h3>
          </div>

          <span className={`priority-badge priority-${task.priority}`}>
            {task.priority === 'High' ? 'عالية' : task.priority === 'Medium' ? 'متوسطة' : 'منخفضة'}
          </span>
        </div>

        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}

        <div className="task-tags">
          <span className="tag">
            <Tag size={12} style={{ display: 'inline', marginLeft: '4px' }} />
            {task.category || 'General'}
          </span>
        </div>
      </div>

      <div className="task-footer">
        <div className="task-date">
          <Calendar size={13} style={{ display: 'inline', marginLeft: '4px' }} />
          {formatDate(task.createdAt)}
        </div>

        <div className="task-actions">
          <button
            className="btn btn-secondary btn-icon-only"
            onClick={() => onEdit(task)}
            title="تعديل (PUT)"
          >
            <Edit3 size={16} />
          </button>
          <button
            className="btn btn-danger btn-icon-only"
            onClick={handleDelete}
            title="حذف (DELETE)"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
