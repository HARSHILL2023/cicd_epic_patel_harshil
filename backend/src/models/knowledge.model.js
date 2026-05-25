// src/models/knowledge.model.js
import mongoose from 'mongoose';

const knowledgeSchema = new mongoose.Schema(
  {
    instruction: {
      type: String,
      required: [true, 'Instruction is required'],
      trim: true
    },
    output: {
      type: String,
      required: [true, 'Output is required']
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
      lowercase: true,
      index: true
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      lowercase: true,
      index: true
    }
  },
  { timestamps: true }
);

// Text index for keyword search on instruction field
knowledgeSchema.index({ instruction: 'text' });

export default mongoose.model('KnowledgeItem', knowledgeSchema, 'knowledge_items');
