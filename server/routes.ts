import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTechniqueSchema, insertSpiritDiePoolSchema, insertActiveEffectSchema, type DieSize } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get character (assume first character for now)
  app.get("/api/character", async (req, res) => {
    try {
      const characters = Array.from((storage as any).characters.values());
      if (characters.length === 0) {
        return res.status(404).json({ message: "No character found" });
      }
      res.json(characters[0]);
    } catch (error) {
      res.status(500).json({ message: "Failed to get character" });
    }
  });

  // Get spirit die pool
  app.get("/api/character/:id/spirit-die-pool", async (req, res) => {
    try {
      const pool = await storage.getSpiritDiePool(req.params.id);
      if (!pool) {
        return res.status(404).json({ message: "Spirit die pool not found" });
      }
      res.json(pool);
    } catch (error) {
      res.status(500).json({ message: "Failed to get spirit die pool" });
    }
  });

  // Update spirit die pool
  app.put("/api/character/:id/spirit-die-pool", async (req, res) => {
    try {
      const validatedData = insertSpiritDiePoolSchema.partial().parse(req.body);
      const updated = await storage.updateSpiritDiePool(req.params.id, validatedData);
      if (!updated) {
        return res.status(404).json({ message: "Spirit die pool not found" });
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update spirit die pool" });
    }
  });

  // Roll spirit die
  app.post("/api/character/:id/roll", async (req, res) => {
    try {
      const { spInvestment } = req.body;
      if (!spInvestment || spInvestment < 1) {
        return res.status(400).json({ message: "Invalid SP investment" });
      }

      const pool = await storage.getSpiritDiePool(req.params.id);
      if (!pool) {
        return res.status(404).json({ message: "Spirit die pool not found" });
      }

      const currentDice = pool.currentDice as DieSize[];
      if (currentDice.length === 0) {
        return res.status(400).json({ message: "No dice available to roll" });
      }

      // Roll a random die from the pool
      const dieIndex = Math.floor(Math.random() * currentDice.length);
      const dieSize = currentDice[dieIndex];
      const dieMax = parseInt(dieSize.substring(1));
      const rollValue = Math.floor(Math.random() * dieMax) + 1;
      
      const success = rollValue >= spInvestment;
      let newDicePool = [...currentDice];

      // If failed, reduce die size or remove it
      if (!success) {
        const dieReductions: Record<DieSize, DieSize | null> = {
          'd12': 'd10',
          'd10': 'd8',
          'd8': 'd6',
          'd6': 'd4',
          'd4': null
        };

        const newDieSize = dieReductions[dieSize];
        if (newDieSize) {
          newDicePool[dieIndex] = newDieSize;
        } else {
          newDicePool.splice(dieIndex, 1);
        }
      }

      // Update the pool
      await storage.updateSpiritDiePool(req.params.id, { currentDice: newDicePool });

      res.json({
        value: rollValue,
        success,
        newDicePool,
        dieRolled: dieSize
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to roll die" });
    }
  });

  // Long rest - restore dice
  app.post("/api/character/:id/long-rest", async (req, res) => {
    try {
      const pool = await storage.getSpiritDiePool(req.params.id);
      if (!pool) {
        return res.status(404).json({ message: "Spirit die pool not found" });
      }

      const restoredDice = Array(pool.diceCount).fill(pool.dieSize);
      const updated = await storage.updateSpiritDiePool(req.params.id, { currentDice: restoredDice });
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to restore dice" });
    }
  });

  // Get techniques
  app.get("/api/character/:id/techniques", async (req, res) => {
    try {
      const techniques = await storage.getTechniques(req.params.id);
      res.json(techniques);
    } catch (error) {
      res.status(500).json({ message: "Failed to get techniques" });
    }
  });

  // Create technique
  app.post("/api/character/:id/techniques", async (req, res) => {
    try {
      const validatedData = insertTechniqueSchema.parse({
        ...req.body,
        characterId: req.params.id
      });
      const technique = await storage.createTechnique(validatedData);
      res.json(technique);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create technique" });
    }
  });

  // Update technique
  app.put("/api/techniques/:id", async (req, res) => {
    try {
      const validatedData = insertTechniqueSchema.partial().parse(req.body);
      const updated = await storage.updateTechnique(req.params.id, validatedData);
      if (!updated) {
        return res.status(404).json({ message: "Technique not found" });
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update technique" });
    }
  });

  // Delete technique
  app.delete("/api/techniques/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTechnique(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Technique not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete technique" });
    }
  });

  // Get active effects
  app.get("/api/character/:id/active-effects", async (req, res) => {
    try {
      const effects = await storage.getActiveEffects(req.params.id);
      res.json(effects);
    } catch (error) {
      res.status(500).json({ message: "Failed to get active effects" });
    }
  });

  // Create active effect
  app.post("/api/character/:id/active-effects", async (req, res) => {
    try {
      const validatedData = insertActiveEffectSchema.parse({
        ...req.body,
        characterId: req.params.id
      });
      const effect = await storage.createActiveEffect(validatedData);
      res.json(effect);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create active effect" });
    }
  });

  // Delete active effect
  app.delete("/api/active-effects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteActiveEffect(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Active effect not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete active effect" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
