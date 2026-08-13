const API_BASE = '/api/tasks';

export const taskApi = {
  // GET: Fetch all tasks with optional filters
  async getTasks(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}?${query}` : API_BASE;
    const res = await fetch(url);
    if (!res.ok) throw new Error('فشل جلب البيانات من السيرفر');
    return await res.json();
  },

  // GET: Single Task
  async getTask(id) {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('فشل جلب تفاصيل المهمة');
    return await res.json();
  },

  // POST: Create Task
  async createTask(taskData) {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'فشل إضافة المهمة');
    }
    return await res.json();
  },

  // PUT: Update Task
  async updateTask(id, taskData) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'فشل تحديث المهمة');
    }
    return await res.json();
  },

  // DELETE: Delete Task
  async deleteTask(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('فشل حذف المهمة');
    return await res.json();
  },

  // Health check for Backend status
  async checkHealth() {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) return { status: 'offline' };
      return await res.json();
    } catch (e) {
      return { status: 'offline' };
    }
  }
};
