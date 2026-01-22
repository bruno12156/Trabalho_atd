import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const clicks = pgTable("clicks", {
  id: serial("id").primaryKey(),
  buttonLabel: text("button_label").notNull(), // e.g., "Button 1"
  dailySequence: integer("daily_sequence").notNull(), // 1, 2, 3... for the current day
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// === BASE SCHEMAS ===
export const insertClickSchema = createInsertSchema(clicks).pick({
  buttonLabel: true,
});

// === EXPLICIT API CONTRACT TYPES ===
export type Click = typeof clicks.$inferSelect;
export type InsertClick = z.infer<typeof insertClickSchema>;

// Request types
export type CreateClickRequest = InsertClick;

// Response types
export type ClickResponse = Click;
export type ClicksListResponse = Click[];
