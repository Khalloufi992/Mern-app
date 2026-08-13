const Task = require('../models/Task');
const { getIsConnected } = require('../config/db');

// In-Memory storage fallback when MongoDB is offline
let inMemoryTasks = [
  {
    _id: 'mem_1',
    title: 'تصفح التطبيق واختبار العمليات (CRUD Demo)',
    description: 'مرحباً بك في تطبيق MERN! تم إنشاء هذه المهمة تلقائياً لتجربة الإضافة والتعديل والحذف.',
    category: 'Projects',
    priority: 'High',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mem_2',
    title: 'إضافة مهمة جديدة (POST)',
    description: 'قم بالضغط على زر "مهمة جديدة" لتجربة إضافة عنصر جديد إلى القائمة.',
    category: 'Work',
    priority: 'Medium',
    completed: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

// @desc    Get all tasks
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const { search, category, priority } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }
      if (category && category !== 'All') {
        query.category = category;
      }
      if (priority && priority !== 'All') {
        query.priority = priority;
      }
      const tasks = await Task.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } else {
      // Memory fallback
      let filtered = [...inMemoryTasks];
      if (search) {
        filtered = filtered.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
      }
      if (category && category !== 'All') {
        filtered = filtered.filter(t => t.category === category);
      }
      if (priority && priority !== 'All') {
        filtered = filtered.filter(t => t.priority === priority);
      }
      return res.status(200).json({ success: true, count: filtered.length, data: filtered });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      const task = await Task.findById(id);
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      return res.status(200).json({ success: true, data: task });
    } else {
      const task = inMemoryTasks.find(t => t._id === id);
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      return res.status(200).json({ success: true, data: task });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create new task (POST)
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, category, priority, completed } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    if (getIsConnected()) {
      const task = await Task.create({
        title,
        description: description || '',
        category: category || 'General',
        priority: priority || 'Medium',
        completed: completed || false,
      });
      return res.status(201).json({ success: true, data: task });
    } else {
      const newTask = {
        _id: 'mem_' + Date.now(),
        title,
        description: description || '',
        category: category || 'General',
        priority: priority || 'Medium',
        completed: completed || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryTasks.unshift(newTask);
      return res.status(201).json({ success: true, data: newTask });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create task', error: error.message });
  }
};

// @desc    Update task (PUT)
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, priority, completed } = req.body;

    if (getIsConnected()) {
      let task = await Task.findById(id);
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

      task.title = title !== undefined ? title : task.title;
      task.description = description !== undefined ? description : task.description;
      task.category = category !== undefined ? category : task.category;
      task.priority = priority !== undefined ? priority : task.priority;
      task.completed = completed !== undefined ? completed : task.completed;

      const updatedTask = await task.save();
      return res.status(200).json({ success: true, data: updatedTask });
    } else {
      const index = inMemoryTasks.findIndex(t => t._id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Task not found' });

      inMemoryTasks[index] = {
        ...inMemoryTasks[index],
        title: title !== undefined ? title : inMemoryTasks[index].title,
        description: description !== undefined ? description : inMemoryTasks[index].description,
        category: category !== undefined ? category : inMemoryTasks[index].category,
        priority: priority !== undefined ? priority : inMemoryTasks[index].priority,
        completed: completed !== undefined ? completed : inMemoryTasks[index].completed,
        updatedAt: new Date().toISOString(),
      };
      return res.status(200).json({ success: true, data: inMemoryTasks[index] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task', error: error.message });
  }
};

// @desc    Delete task (DELETE)
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const task = await Task.findById(id);
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

      await task.deleteOne();
      return res.status(200).json({ success: true, message: 'Task deleted successfully', id });
    } else {
      const index = inMemoryTasks.findIndex(t => t._id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Task not found' });

      inMemoryTasks.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Task deleted successfully', id });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete task', error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
