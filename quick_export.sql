-- Quick data export for Railway migration
-- Copy this data to import into Railway

-- Export all tables with data
SELECT 'characters' as table_name, COUNT(*) as record_count FROM characters
UNION ALL
SELECT 'spirit_die_pools', COUNT(*) FROM spirit_die_pools
UNION ALL  
SELECT 'techniques', COUNT(*) FROM techniques
UNION ALL
SELECT 'active_effects', COUNT(*) FROM active_effects
UNION ALL
SELECT 'glossary_terms', COUNT(*) FROM glossary_terms
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'technique_preferences', COUNT(*) FROM technique_preferences;