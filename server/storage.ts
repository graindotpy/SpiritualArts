import { 
  type Character, 
  type InsertCharacter,
  type SpiritDiePool,
  type InsertSpiritDiePool,
  type Technique,
  type InsertTechnique,
  type ActiveEffect,
  type InsertActiveEffect,
  type DieSize
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Characters
  getCharacter(id: string): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: string, character: Partial<Character>): Promise<Character | undefined>;

  // Spirit Die Pools
  getSpiritDiePool(characterId: string): Promise<SpiritDiePool | undefined>;
  createSpiritDiePool(pool: InsertSpiritDiePool): Promise<SpiritDiePool>;
  updateSpiritDiePool(characterId: string, pool: Partial<SpiritDiePool>): Promise<SpiritDiePool | undefined>;

  // Techniques
  getTechniques(characterId: string): Promise<Technique[]>;
  getTechnique(id: string): Promise<Technique | undefined>;
  createTechnique(technique: InsertTechnique): Promise<Technique>;
  updateTechnique(id: string, technique: Partial<Technique>): Promise<Technique | undefined>;
  deleteTechnique(id: string): Promise<boolean>;

  // Active Effects
  getActiveEffects(characterId: string): Promise<ActiveEffect[]>;
  createActiveEffect(effect: InsertActiveEffect): Promise<ActiveEffect>;
  updateActiveEffect(id: string, effect: Partial<ActiveEffect>): Promise<ActiveEffect | undefined>;
  deleteActiveEffect(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private characters: Map<string, Character>;
  private spiritDiePools: Map<string, SpiritDiePool>;
  private techniques: Map<string, Technique>;
  private activeEffects: Map<string, ActiveEffect>;

  constructor() {
    this.characters = new Map();
    this.spiritDiePools = new Map();
    this.techniques = new Map();
    this.activeEffects = new Map();
    
    // Initialize with R'aan Fames character
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    const character = await this.createCharacter({
      name: "R'aan Fames",
      path: "Path of Gluttony",
      level: 3
    });

    await this.createSpiritDiePool({
      characterId: character.id,
      diceCount: 2,
      dieSize: "d4",
      currentDice: ["d4", "d4"]
    });

    // Create default techniques from the PDF
    const techniques = [
      {
        name: "Omnivore",
        triggerType: "reaction",
        triggerDescription: "You activate this technique as a reaction when you reduce a creature to 0HP.",
        spEffects: {
          1: "You gain 5 temporary hit points.",
          3: "You grow in size by one stage. Melee attacks now deal 1d4 extra damage, and you have advantage on strength checks and saving throws.",
          4: "You regain HP equal to 3d8 + your Spiritual Arts modifier",
          6: "You gain the ability to absorb one technique from the target - stealing for yourself, temporarily. See Technique Drain for full details. At 6SP, the stolen Technique lasts for one hour, or until you use it."
        }
      },
      {
        name: "Tongue Lash",
        triggerType: "bonus",
        triggerDescription: "You activate this technique as a Bonus Action.",
        spEffects: {
          2: "Your tongue has a 15ft range. The target gains one level of Grung Toxin. Make an attack roll with your Spiritual Arts modifier against a creature within range. You only expend a Spirit Die if the attack makes contact.",
          3: "Your tongue deals 2d6 poison damage",
          4: "Your tongue now has a range of 25ft. You inflict two levels of Grung Toxin.",
          6: "Your tongue now deals 5d6 poison damage. The target must make a Strength saving throw - on a fail, you may choose to either grapple the target (with your tongue) or knock them prone."
        }
      },
      {
        name: "The Thrill of the Hunt",
        triggerType: "reaction",
        triggerDescription: "You activate this technique as a reaction, when you cause damage to a target.",
        spEffects: {
          4: "Your speed increases by 10ft. You have an additional +1 to hit with melee attacks. Your extra bite attack deals 1d8+Wis poison damage. When you activate this technique, you target a creature within 30ft - this creature becomes the target of your hunger.",
          6: "All hits with a melee weapon deal 1d8 extra damage. If you are within 20ft of the target of your hunt, attack rolls are made against you with disadvantage. You are invisible to the target of your hunt outside of this range."
        }
      },
      {
        name: "Bear's Ferocity",
        triggerType: "action",
        triggerDescription: "Once you activate this technique, you must make a melee attack against a creature on each of your turns.",
        spEffects: {
          2: "You grow sharp and your fangs increase in length, becoming natural weapons which deal 1d8 damage. If you make a second attack with your bonus action as part of two weapon fighting, add your full modifier.",
          4: "Your natural weapons receive a +2 bonus to attack and damage. You gain the Extra Attack feature. Once per turn, when you hit with one of these attacks, you can force the target to make a Con saving throw. On a fail, you inflict one level of Grung Toxin.",
          6: "Your natural weapons now inflict 1d12 damage, and their modifier increases to +3. Your size increases by one stage, and your range increases by 5ft. You are immune to the effects of Mind Control"
        }
      }
    ];

    for (const tech of techniques) {
      await this.createTechnique({
        characterId: character.id,
        ...tech
      });
    }
  }

  // Characters
  async getCharacter(id: string): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async createCharacter(character: InsertCharacter): Promise<Character> {
    const id = randomUUID();
    const newCharacter: Character = { 
      ...character, 
      id,
      level: character.level ?? 3 
    };
    this.characters.set(id, newCharacter);
    return newCharacter;
  }

  async updateCharacter(id: string, character: Partial<Character>): Promise<Character | undefined> {
    const existing = this.characters.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...character };
    this.characters.set(id, updated);
    return updated;
  }

  // Spirit Die Pools
  async getSpiritDiePool(characterId: string): Promise<SpiritDiePool | undefined> {
    return Array.from(this.spiritDiePools.values()).find(pool => pool.characterId === characterId);
  }

  async createSpiritDiePool(pool: InsertSpiritDiePool): Promise<SpiritDiePool> {
    const id = randomUUID();
    const newPool: SpiritDiePool = { ...pool, id };
    this.spiritDiePools.set(id, newPool);
    return newPool;
  }

  async updateSpiritDiePool(characterId: string, pool: Partial<SpiritDiePool>): Promise<SpiritDiePool | undefined> {
    const existing = Array.from(this.spiritDiePools.values()).find(p => p.characterId === characterId);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...pool };
    this.spiritDiePools.set(existing.id, updated);
    return updated;
  }

  // Techniques
  async getTechniques(characterId: string): Promise<Technique[]> {
    return Array.from(this.techniques.values()).filter(tech => tech.characterId === characterId && tech.isActive);
  }

  async getTechnique(id: string): Promise<Technique | undefined> {
    return this.techniques.get(id);
  }

  async createTechnique(technique: InsertTechnique): Promise<Technique> {
    const id = randomUUID();
    const newTechnique: Technique = { 
      ...technique, 
      id,
      isActive: technique.isActive ?? true 
    };
    this.techniques.set(id, newTechnique);
    return newTechnique;
  }

  async updateTechnique(id: string, technique: Partial<Technique>): Promise<Technique | undefined> {
    const existing = this.techniques.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...technique };
    this.techniques.set(id, updated);
    return updated;
  }

  async deleteTechnique(id: string): Promise<boolean> {
    const existing = this.techniques.get(id);
    if (!existing) return false;
    
    // Soft delete by marking as inactive
    const updated = { ...existing, isActive: false };
    this.techniques.set(id, updated);
    return true;
  }

  // Active Effects
  async getActiveEffects(characterId: string): Promise<ActiveEffect[]> {
    return Array.from(this.activeEffects.values()).filter(effect => effect.characterId === characterId);
  }

  async createActiveEffect(effect: InsertActiveEffect): Promise<ActiveEffect> {
    const id = randomUUID();
    const newEffect: ActiveEffect = { 
      ...effect, 
      id,
      level: effect.level ?? 1,
      description: effect.description ?? null
    };
    this.activeEffects.set(id, newEffect);
    return newEffect;
  }

  async updateActiveEffect(id: string, effect: Partial<ActiveEffect>): Promise<ActiveEffect | undefined> {
    const existing = this.activeEffects.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...effect };
    this.activeEffects.set(id, updated);
    return updated;
  }

  async deleteActiveEffect(id: string): Promise<boolean> {
    return this.activeEffects.delete(id);
  }
}

export const storage = new MemStorage();
