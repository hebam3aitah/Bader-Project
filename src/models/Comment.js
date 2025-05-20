import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'يجب كتابة تعليق'],
    trim: true,
    minlength: [1, 'يجب أن يكون التعليق حرفاً واحداً على الأقل'],
    maxlength: [1000, 'يجب أن لا يتجاوز التعليق 1000 حرف']
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'يجب تحديد المشروع']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// تحديث updatedAt عند تحديث التعليق
commentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// حذف التعليق من المشروع عند حذفه
commentSchema.pre('remove', async function(next) {
  try {
    await this.model('Project').updateOne(
      { _id: this.project },
      { $pull: { comments: this._id } }
    );
    next();
  } catch (error) {
    next(error);
  }
});

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment; 