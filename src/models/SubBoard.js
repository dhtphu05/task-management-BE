import mongoose from 'mongoose';

const subBoardSchema = new mongoose.Schema({
  name: String,
  background: String,
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
});

export const SubBoard = mongoose.model('SubBoard', subBoardSchema);
