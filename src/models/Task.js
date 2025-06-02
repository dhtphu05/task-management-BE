import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueTime: { type: Date },
  documentLink: { type: String },
  githubRepo: { type: String },
  subBoards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubBoard'
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  createdAt: { type: Date, default: Date.now}
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);
