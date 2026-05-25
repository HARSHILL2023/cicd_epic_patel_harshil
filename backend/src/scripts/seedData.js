// src/scripts/seedData.js
import 'dotenv/config';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import KnowledgeItem from '../models/knowledge.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const run = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.log('Error: MONGODB_URI is not set in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB');

  // Read dataset from backend root
  const datasetPath = join(__dirname, '../../dataset.json');
  const raw = readFileSync(datasetPath, 'utf8');
  const parsed = JSON.parse(raw);
  const records = Array.isArray(parsed) ? parsed : Object.values(parsed)[0];

  console.log('Total records in file:', records.length);

  // Check existing count to avoid re-seeding
  const existing = await KnowledgeItem.countDocuments();
  if (existing > 0) {
    console.log('Collection already has', existing, 'records. Skipping import.');
    await mongoose.disconnect();
    return;
  }

  // Normalize and insert in batches to avoid memory issues
  const BATCH_SIZE = 500;
  let inserted = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE).map(item => ({
      instruction: item.instruction,
      output: item.output,
      topic: (item.topic || '').toLowerCase().trim(),
      difficulty: (item.difficulty || 'beginner').toLowerCase().trim()
    }));

    await KnowledgeItem.insertMany(batch, { ordered: false });
    inserted += batch.length;
    console.log('Inserted', inserted, '/', records.length);
  }

  console.log('Seeding complete. Total inserted:', inserted);
  await mongoose.disconnect();
};

run().catch(err => {
  console.log('Seed failed:', err.message);
  process.exit(1);
});
