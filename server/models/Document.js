import mongoose from 'mongoose';

const versionSchema = new mongoose.Schema({
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  message: String,
});

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: '',
  },
  metadata: {
    tags: [String],
    category: String,
    description: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    permission: {
      type: String,
      enum: ['read', 'write', 'admin'],
      default: 'read',
    },
  }],
  versions: [versionSchema],
  aiResearchHistory: [{
    query: String,
    responses: [String],
    timestamp: {
      type: Date,
      default: Date.now,
    },
    perspectives: [String],
  }],
  analytics: {
    views: {
      type: Number,
      default: 0,
    },
    edits: {
      type: Number,
      default: 0,
    },
    aiQueries: {
      type: Number,
      default: 0,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

documentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Document', documentSchema);
