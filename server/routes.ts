import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const todayClicks = await storage.getTodayClicks();
  if (todayClicks.length === 0) {
    console.log("Seeding database with initial clicks...");
    await storage.createClick({ buttonLabel: "Button 1" });
    await storage.createClick({ buttonLabel: "Button 2" });
    console.log("Seeding complete.");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Seed data on startup
  seedDatabase().catch(console.error);

  app.get(api.clicks.listToday.path, async (req, res) => {
    const todayClicks = await storage.getTodayClicks();
    res.json(todayClicks);
  });

  app.post(api.clicks.create.path, async (req, res) => {
    try {
      const input = api.clicks.create.input.parse(req.body);
      const click = await storage.createClick(input);
      res.status(201).json(click);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
