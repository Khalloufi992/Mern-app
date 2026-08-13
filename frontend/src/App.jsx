import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsHeader from './components/StatsHeader';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import Toast from './components/Toast';
import { taskApi } from './services/api';
import { Search, Filter, Loader2, Inbox, RefreshCw } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState({ status: 'checking', database: '' });
  
  // Search and Filter State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  
  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  
  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // 1. GET: Fetch Tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedPriority !== 'All') params.priority = selectedPriority;

      const res = await taskApi.getTasks(params);
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      addToast(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Check backend server status
  const checkServer = async () => {
    const status = await taskApi.checkHealth();
    setServerStatus(status);
  };

  useEffect(() => {
    checkServer();
    fetchTasks();
  }, [selectedCategory, selectedPriority]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // 2. POST / PUT Save handler
  const handleSaveTask = async (formData) => {
    try {
      if (taskToEdit) {
        // PUT (Update)
        const res = await taskApi.updateTask(taskToEdit._id, formData);
        if (res.success) {
          setTasks((prev) => prev.map((t) => (t._id === taskToEdit._id ? res.data : t)));
          addToast('تم تحديث المهمة بنجاح (PUT)', 'success');
        }
      } else {
        // POST (Create)
        const res = await taskApi.createTask(formData);
        if (res.success) {
          setTasks((prev) => [res.data, ...prev]);
          addToast('تمت إضافة المهمة بنجاح (POST)', 'success');
        }
      }
      setIsModalOpen(false);
      setTaskToEdit(null);
    } catch (err) {
      addToast(err.message, 'danger');
    }
  };

  // Toggle complete state (PUT)
  const handleToggleComplete = async (task) => {
    try {
      const updatedStatus = !task.completed;
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, completed: updatedStatus } : t))
      );

      const res = await taskApi.updateTask(task._id, { completed: updatedStatus });
      if (res.success) {
        addToast(
          updatedStatus ? 'تم نقل المهمة للمكتملة' : 'تم استرجاع المهمة لقيد الإنجاز',
          'info'
        );
      }
    } catch (err) {
      fetchTasks(); // Rollback
      addToast(err.message, 'danger');
    }
  };

  // 3. DELETE Task
  const handleDeleteTask = async (id) => {
    try {
      const res = await taskApi.deleteTask(id);
      if (res.success) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        addToast('تم حذف المهمة بنجاح (DELETE)', 'success');
      }
    } catch (err) {
      addToast(err.message, 'danger');
    }
  };

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <Toast toasts={toasts} />

      {/* Navbar */}
      <Navbar
        onOpenNewTaskModal={handleOpenCreateModal}
        serverStatus={serverStatus}
      />

      {/* Overview Stats */}
      <StatsHeader tasks={tasks} />

      {/* Filter and Search Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="ابحث عن مهمة أو كلمة مفتاحية..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          
          <select
            className="select-input"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">كل التصنيفات</option>
            <option value="General">عام (General)</option>
            <option value="Work">عمل (Work)</option>
            <option value="Personal">شخصي (Personal)</option>
            <option value="Projects">مشاريع (Projects)</option>
            <option value="Shopping">تسوق (Shopping)</option>
          </select>

          <select
            className="select-input"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="All">كل الأولويات</option>
            <option value="High">عالية (High)</option>
            <option value="Medium">متوسطة (Medium)</option>
            <option value="Low">منخفضة (Low)</option>
          </select>

          <button
            className="btn btn-secondary btn-icon-only"
            onClick={fetchTasks}
            title="تحديث القائمة"
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tasks List / Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <Loader2 size={40} className="spin" style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>جاري تحميل المهام عبر API (GET)...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Inbox size={32} />
          </div>
          <h3>لا توجد مهام حالياً</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            {search || selectedCategory !== 'All' || selectedPriority !== 'All'
              ? 'لم نجد مهام تطابق الفلاتر المحددة'
              : 'قم بإضافة مهمتك الأولى للبدء في استخدام التطبيق'}
          </p>
          <button className="btn btn-primary" onClick={handleOpenCreateModal}>
            إضافة مهمة جديدة (POST)
          </button>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Task Edit/Create Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
