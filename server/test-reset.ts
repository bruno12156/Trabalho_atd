
import { DatabaseStorage } from './storage';
import { db } from './db';
import { clicks } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';

async function testReset() {
  console.log("Starting reset logic test...");
  const storage = new DatabaseStorage();
  const label = "Test Button " + Date.now();

  // 1. Clear previous test data for this label
  await db.delete(clicks).where(eq(clicks.buttonLabel, label));

  // 2. Mock today's first click
  console.log("Recording first click...");
  const click1 = await storage.createClick({ buttonLabel: label });
  console.log(`Click 1 Sequence: ${click1.dailySequence}`);
  if (click1.dailySequence !== 1) throw new Error("First click should be 1");

  // 3. Mock today's second click
  console.log("Recording second click...");
  const click2 = await storage.createClick({ buttonLabel: label });
  console.log(`Click 2 Sequence: ${click2.dailySequence}`);
  if (click2.dailySequence !== 2) throw new Error("Second click should be 2");

  // 4. Simulate "Next Day" by manually inserting a record from yesterday
  console.log("Simulating 'Yesterday' data...");
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  await db.insert(clicks).values({
    buttonLabel: label,
    dailySequence: 10, // Some high number from yesterday
    createdAt: yesterday
  });

  // 5. Record a new click "today" and verify it starts from 1
  console.log("Recording click after 'reset'...");
  // IMPORTANT: We need a fresh Date object in createClick that uses the CURRENT time
  // which is definitely after the 'yesterday' entry we just added.
  const click3 = await storage.createClick({ buttonLabel: label });
  console.log(`Click 3 Sequence: ${click3.dailySequence}`);
  
  if (click3.dailySequence === 1) {
    console.log("✅ SUCCESS: Counter reset to 1 for the new day!");
  } else {
    // Debug info
    const all = await db.select().from(clicks).where(eq(clicks.buttonLabel, label));
    console.log("Current DB state for label:", JSON.stringify(all, null, 2));
    console.log(`❌ FAILURE: Counter is ${click3.dailySequence}, expected 1`);
  }

  // Cleanup
  await db.delete(clicks).where(eq(clicks.buttonLabel, label));
  process.exit(0);
}

testReset().catch(err => {
  console.error(err);
  process.exit(1);
});
