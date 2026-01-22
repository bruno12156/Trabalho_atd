import { db } from "./db";
import { clicks, type InsertClick, type Click } from "@shared/schema";
import { sql, desc, gte, eq, and } from "drizzle-orm";

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
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Count clicks for this specific button today
    const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(clicks)
        .where(
          and(
            gte(clicks.createdAt, startOfDay),
            eq(clicks.buttonLabel, insertClick.buttonLabel)
          )
        );

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
