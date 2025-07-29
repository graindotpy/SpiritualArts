import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const characters = pgTable("characters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  path: text("path").notNull(),
  level: integer("level").notNull().default(3),
});

export const spiritDiePools = pgTable("spirit_die_pools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  characterId: varchar("character_id").notNull(),
  diceCount: integer("dice_count").notNull(),
  dieSize: text("die_size").notNull(), // d4, d6, d8, d10, d12
  currentDice: jsonb("current_dice").notNull(), // Array of current die sizes
});

export const techniques = pgTable("techniques", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  characterId: varchar("character_id").notNull(),
  name: text("name").notNull(),
  triggerType: text("trigger_type").notNull(), // action, bonus, reaction
  triggerDescription: text("trigger_description").notNull(),
  spEffects: jsonb("sp_effects").notNull(), // Object mapping SP amounts to effects
  isActive: boolean("is_active").notNull().default(true),
});

export const activeEffects = pgTable("active_effects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  characterId: varchar("character_id").notNull(),
  name: text("name").notNull(),
  level: integer("level").default(1),
  description: text("description"),
});

// Insert schemas
export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
});

export const insertSpiritDiePoolSchema = createInsertSchema(spiritDiePools).omit({
  id: true,
});

export const insertTechniqueSchema = createInsertSchema(techniques).omit({
  id: true,
});

export const insertActiveEffectSchema = createInsertSchema(activeEffects).omit({
  id: true,
});

// Types
export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;

export type SpiritDiePool = typeof spiritDiePools.$inferSelect;
export type InsertSpiritDiePool = z.infer<typeof insertSpiritDiePoolSchema>;

export type Technique = typeof techniques.$inferSelect;
export type InsertTechnique = z.infer<typeof insertTechniqueSchema>;

export type ActiveEffect = typeof activeEffects.$inferSelect;
export type InsertActiveEffect = z.infer<typeof insertActiveEffectSchema>;

// Additional types for frontend
export type DieSize = 'd4' | 'd6' | 'd8' | 'd10' | 'd12';
export type TriggerType = 'action' | 'bonus' | 'reaction';

export interface SPEffect {
  [spAmount: number]: string;
}

export interface RollResult {
  value: number;
  success: boolean;
  newDicePool: DieSize[];
}
