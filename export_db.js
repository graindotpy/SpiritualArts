#!/usr/bin/env node

// Database export script for Replit -> Railway migration
import { db } from './server/db.js';
import { 
  characters, 
  spiritDiePools, 
  techniques, 
  activeEffects, 
  glossaryTerms, 
  users, 
  techniquePreferences,
  sessions 
} from './shared/schema.js';
import fs from 'fs';

async function exportData() {
  try {
    console.log('🔄 Exporting database data...');
    
    const data = {
      characters: await db.select().from(characters),
      spiritDiePools: await db.select().from(spiritDiePools),
      techniques: await db.select().from(techniques),
      activeEffects: await db.select().from(activeEffects),
      glossaryTerms: await db.select().from(glossaryTerms),
      users: await db.select().from(users),
      techniquePreferences: await db.select().from(techniquePreferences),
      sessions: await db.select().from(sessions)
    };

    // Write to JSON file
    fs.writeFileSync('database_export.json', JSON.stringify(data, null, 2));
    
    console.log('✅ Database exported to database_export.json');
    console.log('📊 Export summary:');
    console.log(`   Characters: ${data.characters.length}`);
    console.log(`   Spirit Die Pools: ${data.spiritDiePools.length}`);
    console.log(`   Techniques: ${data.techniques.length}`);
    console.log(`   Active Effects: ${data.activeEffects.length}`);
    console.log(`   Glossary Terms: ${data.glossaryTerms.length}`);
    console.log(`   Users: ${data.users.length}`);
    console.log(`   Technique Preferences: ${data.techniquePreferences.length}`);
    console.log(`   Sessions: ${data.sessions.length}`);
    
    // Generate SQL INSERT statements
    let sqlOutput = '-- Database export for Railway migration\n\n';
    
    // Export each table
    const tables = [
      { name: 'users', data: data.users },
      { name: 'characters', data: data.characters },
      { name: 'spirit_die_pools', data: data.spiritDiePools },
      { name: 'techniques', data: data.techniques },
      { name: 'active_effects', data: data.activeEffects },
      { name: 'glossary_terms', data: data.glossaryTerms },
      { name: 'technique_preferences', data: data.techniquePreferences },
      { name: 'sessions', data: data.sessions }
    ];
    
    for (const table of tables) {
      if (table.data.length > 0) {
        sqlOutput += `-- ${table.name}\n`;
        for (const row of table.data) {
          const columns = Object.keys(row).map(k => `"${k}"`).join(', ');
          const values = Object.values(row).map(v => {
            if (v === null) return 'NULL';
            if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
            if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
            return v;
          }).join(', ');
          sqlOutput += `INSERT INTO ${table.name} (${columns}) VALUES (${values});\n`;
        }
        sqlOutput += '\n';
      }
    }
    
    fs.writeFileSync('database_export.sql', sqlOutput);
    console.log('✅ SQL export saved to database_export.sql');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

exportData();