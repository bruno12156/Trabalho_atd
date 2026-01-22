import { db } from "./db";
import { clicks, type InsertClick, type Click } from "@shared/schema";
import { sql, desc, gte } from "drizzle-orm";

export interface IStorage {
  getTodayClicks(): Promise<Click[]>;
  createClick(click: InsertClick): Promise<Click>;
}

export class DatabaseStorage implements IStorage {
  async getTodayClicks(): Promise<Click[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    return await db.select()
      .from(clicks)
      .where(gte(clicks.createdAt, startOfDay))
      .orderBy(desc(clicks.createdAt));
  }

  async createClick(insertClick: InsertClick): Promise<Click> {
    // We need to calculate the daily sequence.
    // In a real high-concurrency app we'd need locking, but for this simple app,
    // counting existing records for today + 1 is sufficient.
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Get count of clicks today
    const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(clicks)
        .where(gte(clicks.createdAt, startOfDay));

    const nextSequence = Number(result.count) + 1;

    const [newClick] = await db
      .insert(clicks)
      .values({
        ...insertClick,
        dailySequence: nextSequence,
      })
      .returning();

    return newClick;
  }
}

export const storage = new DatabaseStorage();
