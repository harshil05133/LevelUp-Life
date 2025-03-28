const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  dueDate: { 
    type: Date 
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  points: { //TODO : change the default value depending on scale
    type: Number, 
    default: 50
  },
  type: { //TODO : use this to add points to specific stats
    type: String, 
    default: 'general'
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
// This code defines a Mongoose schema and model for tasks in a task management application.
// It includes fields for task name, due date, completion status, and a reference to the user who created the task.