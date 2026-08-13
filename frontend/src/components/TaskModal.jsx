import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState('Medium');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setCategory(taskToEdit.category || 'General');
      setPriority(taskToEdit.priority || 'Medium');
      setCompleted(taskToEdit.completed || false);
    } else {
      setTitle('');
      setDescription('');
      setCategory('General');
      setPriority('Medium');
      setCompleted(false);
    }
    setError('');
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('يرجى إدخال عنوان المهمة');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      completed,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {taskToEdit ? 'تعديل المهمة (PUT / UPDATE)' : 'إضافة مهمة جديدة (POST / CREATE)'}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.6rem 1rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>عنوان المهمة *</label>
            <input
              type="text"
              className="form-control"
              placeholder="مثال: مراجعة مشروع MERN..."
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>الوصف والتفاصيل</label>
            <textarea
              className="form-control"
              placeholder="أدخل ملاحظات إضافية حول المهمة..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>التصنيف</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="General">عام (General)</option>
                <option value="Work">عمل (Work)</option>
                <option value="Personal">شخصي (Personal)</option>
                <option value="Projects">مشاريع (Projects)</option>
                <option value="Shopping">تسوق (Shopping)</option>
              </select>
            </div>

            <div className="form-group">
              <label>الأولوية</label>
              <select
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">منخفضة (Low)</option>
                <option value="Medium">متوسطة (Medium)</option>
                <option value="High">عالية (High)</option>
              </select>
            </div>
          </div>

          {taskToEdit && (
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="checkbox"
                id="completed-check"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="completed-check" style={{ marginBottom: 0, cursor: 'pointer' }}>
                مكتملة (Completed)
              </label>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              إلغاء
            </button>
            <button type="submit" className="btn btn-primary">
              {taskToEdit ? <Save size={18} /> : <Plus size={18} />}
              <span>{taskToEdit ? 'حفظ التغيرات' : 'إضافة المهمة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
