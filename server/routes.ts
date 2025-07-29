import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { db } from "./db";
import { characters, insertTechniqueSchema, insertSpiritDiePoolSchema, insertActiveEffectSchema, type DieSize } from "@shared/schema";
import { z } from "zod";

// Configure multer for portrait uploads
const uploadsDir = path.join(process.cwd(), 'uploads', 'portraits');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'portrait-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded portraits
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  // Get all characters
  app.get("/api/characters", async (req, res) => {
    try {
      const characterList = await db.select().from(characters);
      res.json(characterList);
    } catch (error) {
      console.error("Characters fetch error:", error);
      res.status(500).json({ message: "Failed to get characters" });
    }
  });

  // Get current/default character (first one for now)
  app.get("/api/character", async (req, res) => {
    try {
      // For now, we'll get the first character from the database
      const characterList = await db.select().from(characters).limit(1);
      if (characterList.length === 0) {
        return res.status(404).json({ message: "No character found" });
      }
      res.json(characterList[0]);
    } catch (error) {
      console.error("Character fetch error:", error);
      res.status(500).json({ message: "Failed to get character" });
    }
  });

  // Get specific character by ID
  app.get("/api/character/:id", async (req, res) => {
    try {
      const character = await storage.getCharacter(req.params.id);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(character);
    } catch (error) {
      console.error("Character fetch error:", error);
      res.status(500).json({ message: "Failed to get character" });
    }
  });

  // Create a new character
  app.post("/api/character", async (req, res) => {
    try {
      const { name, path, level = 1 } = req.body;
      
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ message: "Name is required" });
      }
      
      if (!path || typeof path !== 'string' || path.trim().length === 0) {
        return res.status(400).json({ message: "Path is required" });
      }
      
      if (typeof level !== 'number' || level < 1 || level > 20) {
        return res.status(400).json({ message: "Level must be between 1 and 20" });
      }
      
      const character = await storage.createCharacter({
        name: name.trim(),
        path: path.trim(),
        level
      });
      
      res.json(character);
    } catch (error) {
      res.status(500).json({ message: "Failed to create character" });
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

  // Update character (level, name, path)
  app.put("/api/character/:id", async (req, res) => {
    try {
      const { level, name, path } = req.body;
      const updateData: any = {};
      
      if (level !== undefined) {
        if (typeof level !== 'number' || level < 1 || level > 20) {
          return res.status(400).json({ message: "Level must be between 1 and 20" });
        }
        updateData.level = level;
      }
      
      if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0) {
          return res.status(400).json({ message: "Name must be a non-empty string" });
        }
        updateData.name = name.trim();
      }
      
      if (path !== undefined) {
        if (typeof path !== 'string' || path.trim().length === 0) {
          return res.status(400).json({ message: "Path must be a non-empty string" });
        }
        updateData.path = path.trim();
      }
      
      const updated = await storage.updateCharacter(req.params.id, updateData);
      if (!updated) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update character" });
    }
  });

  // Upload character portrait
  app.post("/api/character/:id/portrait", upload.single('portrait'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No portrait file provided" });
      }

      const portraitUrl = `/uploads/portraits/${req.file.filename}`;
      const updated = await storage.updateCharacter(req.params.id, { portraitUrl });
      
      if (!updated) {
        // Clean up uploaded file if character update fails
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: "Character not found" });
      }

      res.json({ portraitUrl });
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error("Failed to cleanup uploaded file:", cleanupError);
        }
      }
      console.error("Portrait upload error:", error);
      res.status(500).json({ message: "Failed to upload portrait" });
    }
  });

  // Delete character portrait
  app.delete("/api/character/:id/portrait", async (req, res) => {
    try {
      const character = await storage.getCharacter(req.params.id);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }

      // Delete the old portrait file if it exists
      if (character.portraitUrl) {
        const oldFilePath = path.join(process.cwd(), character.portraitUrl);
        try {
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        } catch (fileError) {
          console.error("Failed to delete old portrait file:", fileError);
        }
      }

      const updated = await storage.updateCharacter(req.params.id, { portraitUrl: null });
      res.json(updated);
    } catch (error) {
      console.error("Portrait delete error:", error);
      res.status(500).json({ message: "Failed to delete portrait" });
    }
  });

  // Roll spirit die
  app.post("/api/character/:id/roll", async (req, res) => {
    try {
      const { spInvestment, dieIndex = 0 } = req.body;
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

      // Validate die index
      if (dieIndex < 0 || dieIndex >= currentDice.length) {
        return res.status(400).json({ message: "Invalid die index" });
      }

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

      console.log(`Roll result for ${spInvestment} SP using die ${dieIndex} (${dieSize}):`, {
        value: rollValue,
        success,
        newDicePool
      });

      res.json({
        value: rollValue,
        success,
        newDicePool,
        dieRolled: dieSize
      });
    } catch (error) {
      console.error("Error rolling die:", error);
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

      // Get the character to determine level-based dice
      const character = await storage.getCharacter(req.params.id);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }

      const { SPIRIT_DIE_PROGRESSION } = await import("@shared/schema");
      const baseDice = SPIRIT_DIE_PROGRESSION[character.level] || ['d4'];
      const restoredDice = pool.overrideDice ? (pool.overrideDice as any[]) : baseDice;
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
