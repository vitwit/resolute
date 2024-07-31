
-- Check if the primary key constraint exists
DO $$ 
BEGIN
    -- Attempt to create the primary key constraint on denom
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE table_name = 'price_info' 
        AND constraint_type = 'PRIMARY KEY'
    ) THEN
        ALTER TABLE price_info
        ADD CONSTRAINT price_info_pkey PRIMARY KEY (denom);
    END IF;
END $$;

-- Example data to be inserted or updated
-- Replace this with your actual data
WITH new_data AS (
  VALUES
    ('utia', 'celestia', true, NOW(), '{}'::jsonb),
    ('ubld', 'agoric', true, NOW(), '{}'::jsonb),
    ('attoaioz', 'aioz-network', true, NOW(), '{}'::jsonb),
    ('uandr', 'andromeda-2', true, NOW(), '{}'::jsonb),
    ('aarch', 'archway', true, NOW(), '{}'::jsonb),
    ('arkh', 'arkham', true, NOW(), '{}'::jsonb),
    ('umntl', 'assetmantle', true, NOW(), '{}'::jsonb),
    ('uaura', 'aura-network', true, NOW(), '{}'::jsonb),
    ('uaxl', 'axelar', true, NOW(), '{}'::jsonb),
    ('ubze', 'bzedge', true, NOW(), '{}'::jsonb),
    ('ubcna', 'bitcanna', true, NOW(), '{}'::jsonb),
    ('ubtsg', 'bitsong', true, NOW(), '{}'::jsonb),
    ('ubnt', 'bluzelle', true, NOW(), '{}'::jsonb),
    ('boot', 'bostrom', true, NOW(), '{}'::jsonb),
    ('acanto', 'canto', true, NOW(), '{}'::jsonb)
)

-- Insert or update the data
INSERT INTO price_info (denom, coingecko_name, enabled, last_updated, info)
SELECT * FROM new_data
ON CONFLICT (denom) DO UPDATE
SET
  coingecko_name = EXCLUDED.coingecko_name,
  enabled = EXCLUDED.enabled,
  last_updated = EXCLUDED.last_updated,
  info = EXCLUDED.info;


  -- Example data1 to be inserted or updated
-- Replace this with your actual data
WITH new_data1 AS (
  VALUES
    ('amand', 'mande-network', true, NOW(), '{}'::jsonb)
)

-- Insert or update the data
INSERT INTO price_info (denom, coingecko_name, enabled, last_updated, info)
SELECT * FROM new_data1
ON CONFLICT (denom) DO UPDATE
SET
  coingecko_name = EXCLUDED.coingecko_name,
  enabled = EXCLUDED.enabled,
  last_updated = EXCLUDED.last_updated,
  info = EXCLUDED.info;
