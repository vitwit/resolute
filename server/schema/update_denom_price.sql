
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
    ('amand', 'mande-network', true, NOW(), '{}'::jsonb),
    ('uom', 'mantra-dao', true, NOW(), '{}'::jsonb),
    ('umars', 'mars-protocol-a7fcbcfb-fd61-4017-92f0-7ee9f9cc6da3', true, NOW(), '{}'::jsonb),
    ('cacao', 'cacao', true, NOW(), '{}'::jsonb),
    ('utick', 'microtick', true, NOW(), '{}'::jsonb),
    ('uwhale', 'white-whale', true, NOW(), '{}'::jsonb),
    ('umove', 'movement', true, NOW(), '{}'::jsonb),
    ('aMYT', 'mythos', true, NOW(), '{}'::jsonb),
    ('uneutaro', 'neutaro', true, NOW(), '{}'::jsonb),
    ('untrn', 'neutron-3', true, NOW(), '{}'::jsonb),
    ('unibi', 'nibiru', true, NOW(), '{}'::jsonb),
    ('anim', 'nim-network', true, NOW(), '{}'::jsonb),
    ('unois', 'nois', true, NOW(), '{}'::jsonb),
    ('unls', 'nolus', true, NOW(), '{}'::jsonb),
    ('loki', 'odin-protocol', true, NOW(), '{}'::jsonb),
    ('wei', 'oec-token', true, NOW(), '{}'::jsonb),
    ('anom', 'onomy-protocol', true, NOW(), '{}'::jsonb),
    ('orai', 'oraichain-token', true, NOW(), '{}'::jsonb),
    ('uosmo', 'osmosis', true, NOW(), '{}'::jsonb),
    ('umed', 'medibloc', true, NOW(), '{}'::jsonb),
    ('upasg', 'passage', true, NOW(), '{}'::jsonb),
    ('uxprt', 'persistence', true, NOW(), '{}'::jsonb),
    ('aplanq', 'planq', true, NOW(), '{}'::jsonb),
    ('apoint', 'point-network', true, NOW(), '{}'::jsonb),
    ('nhash', 'provenance-blockchain', true, NOW(), '{}'::jsonb),
    ('ubedrock', 'pylons-bedrock', true, NOW(), '{}'::jsonb),
    ('uqsr', 'quasar-2', true, NOW(), '{}'::jsonb),
    ('uqck', 'quicksilver', true, NOW(), '{}'::jsonb),
    ('uqwoyn', 'qwoyn', true, NOW(), '{}'::jsonb),
    ('ario', 'realio-network', true, NOW(), '{}'::jsonb),
    ('arebus', 'rebus', true, NOW(), '{}'::jsonb),
    ('uregen', 'regen', true, NOW(), '{}'::jsonb),
    ('uatolo', 'rizon', true, NOW(), '{}'::jsonb),
    ('usaga', 'saga-2', true, NOW(), '{}'::jsonb),
    ('nscr', 'scorum', true, NOW(), '{}'::jsonb),
    ('uscrt', 'secret', true, NOW(), '{}'::jsonb),
    ('aseda', 'seda-2', true, NOW(), '{}'::jsonb),
    ('usei', 'sei-network', true, NOW(), '{}'::jsonb),
    ('uslf', 'self-chain', true, NOW(), '{}'::jsonb),
    ('udvpn', 'sentinel', true, NOW(), '{}'::jsonb),
    ('usge', 'six-sigma', true, NOW(), '{}'::jsonb),
    ('nshr', 'shareledger', true, NOW(), '{}'::jsonb),
    ('uctk', 'certik', true, NOW(), '{}'::jsonb),
    ('shido', 'shido-2', true, NOW(), '{}'::jsonb),
    ('rowan', 'sifchain', true, NOW(), '{}'::jsonb),
    ('usomm', 'sommelier', true, NOW(), '{}'::jsonb),
    ('usource', 'source', true, NOW(), '{}'::jsonb),
    ('ufis', 'stafi', true, NOW(), '{}'::jsonb),
    ('ustars', 'stargaze', true, NOW(), '{}'::jsonb),
    ('uiov', 'starname', true, NOW(), '{}'::jsonb),
    ('wei', 'stratos', true, NOW(), '{}'::jsonb),
    ('ustrd', 'stride', true, NOW(), '{}'::jsonb),
    ('atenet', 'tenet-1b000f7b-59cb-4e06-89ce-d62b32d362b9', true, NOW(), '{}'::jsonb),
    ('utori', 'teritori', true, NOW(), '{}'::jsonb),
    ('uluna', 'terra-luna-2', true, NOW(), '{}'::jsonb),
    ('utgd', 'tgrade', true, NOW(), '{}'::jsonb),
    ('atkx', 'tokenize-xchange', true, NOW(), '{}'::jsonb),
    ('uumee', 'umee', true, NOW(), '{}'::jsonb),
    ('nund', 'unification', true, NOW(), '{}'::jsonb),
    ('uvdl', 'vidulum', true, NOW(), '{}'::jsonb),
    ('axpla', 'xpla', true, NOW(), '{}'::jsonb),
    ('azeta', 'zetachain', true, NOW(), '{}'::jsonb)    
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
