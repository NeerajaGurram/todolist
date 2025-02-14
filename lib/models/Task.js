import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Associate task with user
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export default Task;
// import mongoose from 'mongoose';

// const taskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Associate task with user
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

// export default Task;