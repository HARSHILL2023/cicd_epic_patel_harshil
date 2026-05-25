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
    console.log('[ERROR] MONGODB_URI is not set in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoURI);
  console.log('[INFO] Connected to MongoDB');

  const args = process.argv.slice(2);
  const shouldReset = args.includes('--reset');

  if (shouldReset) {
    console.log('[WARN] --reset flag detected. Clearing existing knowledge items...');
    await KnowledgeItem.deleteMany({});
    console.log('[INFO] Collection cleared.');
  }

  const datasetPath = join(__dirname, '../../dataset.json');
  let raw;
  try {
    raw = readFileSync(datasetPath, 'utf8');
  } catch (err) {
    console.log('[ERROR] Could not read dataset.json:', err.message);
    process.exit(1);
  }

  const parsed = JSON.parse(raw);
  const records = Array.isArray(parsed) ? parsed : Object.values(parsed)[0];

  console.log(`[INFO] Found ${records.length} records in dataset.json`);

  const existing = await KnowledgeItem.countDocuments();
  if (existing > 0 && !shouldReset) {
    console.log(`[INFO] Collection already contains ${existing} records. Skipping import to prevent duplicates.`);
    console.log('[INFO] Use "npm run seed -- --reset" to clear and re-seed the database.');
    await mongoose.disconnect();
    return;
  }

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
    console.log(`[INFO] Inserted batch: ${inserted} / ${records.length}`);
  }

  console.log(`[SUCCESS] Seeding complete. Total records inserted: ${inserted}`);
  await mongoose.disconnect();
};

run().catch(err => {
  console.log('[ERROR] Seed failed:', err.message);
  process.exit(1);
});
