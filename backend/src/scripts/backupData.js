// src/scripts/backupData.js
import 'dotenv/config';
import { writeFileSync } from 'fs';
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
  console.log('[INFO] Connected to MongoDB for Backup');

  try {
    const items = await KnowledgeItem.find().lean();
    console.log(`[INFO] Found ${items.length} records. Exporting...`);

    const backupPath = join(__dirname, '../../backup.json');
    writeFileSync(backupPath, JSON.stringify(items, null, 2), 'utf8');

    console.log(`[SUCCESS] Database backup saved to ${backupPath}`);
  } catch (err) {
    console.log('[ERROR] Backup failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[INFO] Disconnected from MongoDB');
  }
};

run();
