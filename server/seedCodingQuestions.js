/**
 * Seed Script for Coding Questions
 * Run this once to populate the database with DSA problems
 * 
 * Usage: node server/seedCodingQuestions.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const CodingQuestion = require('./models/CodingQuestion');
const dsaQuestions = require('./data/dsaQuestions');
const connectDB = require('./config/db');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing questions
    const deletedCount = await CodingQuestion.deleteMany({});
    console.log(`Deleted ${deletedCount.deletedCount} existing questions`);

    // Insert new questions
    const inserted = await CodingQuestion.insertMany(dsaQuestions);
    console.log(`✓ Successfully inserted ${inserted.length} coding questions`);

    console.log('\nQuestions added:');
    inserted.forEach((q, idx) => {
      console.log(`${idx + 1}. ${q.title} (${q.difficulty} - ${q.topic})`);
    });

    // Display database stats
    const stats = {
      total: await CodingQuestion.countDocuments(),
      byDifficulty: {
        easy: await CodingQuestion.countDocuments({ difficulty: 'Easy' }),
        medium: await CodingQuestion.countDocuments({ difficulty: 'Medium' }),
        hard: await CodingQuestion.countDocuments({ difficulty: 'Hard' })
      },
      byTopic: {}
    };

    const topics = await CodingQuestion.distinct('topic');
    for (const topic of topics) {
      stats.byTopic[topic] = await CodingQuestion.countDocuments({ topic });
    }

    console.log('\n--- Database Stats ---');
    console.log(`Total: ${stats.total}`);
    console.log(`By Difficulty: Easy=${stats.byDifficulty.easy}, Medium=${stats.byDifficulty.medium}, Hard=${stats.byDifficulty.hard}`);
    console.log(`By Topic:`, stats.byTopic);

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
}

seedDatabase();
