
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
    ('acanto', 'canto', true, NOW(), '{}'::jsonb),
    ('swth', 'switcheo', true, NOW(), '{}'::jsonb),
    ('ucrbrus', 'cerberus-2', true, NOW(), '{}'::jsonb),
    ('uc4e', 'chain4energy', true, NOW(), '{}'::jsonb),
    ('ncheq', 'cheqd-network', true, NOW(), '{}'::jsonb),
    ('uhuahua', 'chihuahua-token', true, NOW(), '{}'::jsonb),
    ('ucmdx', 'comdex', true, NOW(), '{}'::jsonb),
    ('acvnt', 'consciousdao', true, NOW(), '{}'::jsonb),
    ('ucore', 'coreum', true, NOW(), '{}'::jsonb),
    ('uatom', 'cosmos', true, NOW(), '{}'::jsonb),
    ('ucoss', 'coss-2', true, NOW(), '{}'::jsonb),
    ('ucre', 'crescent-network', true, NOW(), '{}'::jsonb),
    ('acudos', 'cudos', true, NOW(), '{}'::jsonb),
    ('udec', 'decentr', true, NOW(), '{}'::jsonb),
    ('udsm', 'desmos', true, NOW(), '{}'::jsonb),
    ('udhp', 'dhealth', true, NOW(), '{}'::jsonb),
    ('udig', 'dig-chain', true, NOW(), '{}'::jsonb),
    ('adydx', 'dydx-chain', true, NOW(), '{}'::jsonb),
    ('adym', 'dymension', true, NOW(), '{}'::jsonb),
    ('ungm', 'e-money', true, NOW(), '{}'::jsonb),
    ('aevmos', 'evmos', true, NOW(), '{}'::jsonb),
    ('afet', 'fetch-ai', true, NOW(), '{}'::jsonb),
    ('cony', 'link', true, NOW(), '{}'::jsonb),
    ('ufct', 'firmachain', true, NOW(), '{}'::jsonb),
    ('ufury', 'fanfury', true, NOW(), '{}'::jsonb),
    ('FX', 'fx-coin', true, NOW(), '{}'::jsonb),
    ('ulore', 'gitopia', true, NOW(), '{}'::jsonb),
    ('gusdc', 'gravity-bridge-usdc', true, NOW(), '{}'::jsonb),
    ('ugraviton', 'graviton', true, NOW(), '{}'::jsonb),
    ('aISLM', 'islamic-coin', true, NOW(), '{}'::jsonb),
    ('uheli', 'helichain', true, NOW(), '{}'::jsonb),
    ('aheart', 'humans-ai', true, NOW(), '{}'::jsonb),
    ('uixo', 'ixo', true, NOW(), '{}'::jsonb),
    ('aimv', 'imv', true, NOW(), '{}'::jsonb),
    ('inj', 'injective-protocol', true, NOW(), '{}'::jsonb),
    ('autism', 'autism', true, NOW(), '{}'::jsonb),
    ('NINJA', 'dog-wif-nuchucks', true, NOW(), '{}'::jsonb),
    ('hava', 'hava-coin', true, NOW(), '{}'::jsonb),
    ('uiris', 'iris-network', true, NOW(), '{}'::jsonb),
    ('ujkl', 'jackal-protocol', true, NOW(), '{}'::jsonb),
    ('ujolt', 'joltify', true, NOW(), '{}'::jsonb),
    ('ujuno', 'juno-network', true, NOW(), '{}'::jsonb),
    ('neta', 'neta', true, NOW(), '{}'::jsonb),
    ('rac', 'racoon', true, NOW(), '{}'::jsonb),
    ('loop', 'loop', true, NOW(), '{}'::jsonb),
    ('phmn', 'posthuman', true, NOW(), '{}'::jsonb),
    ('wynd', 'wynd', true, NOW(), '{}'::jsonb),
    ('bJUNO', 'backbone-labs-staked-juno', true, NOW(), '{}'::jsonb),
    ('usdc', 'usd-coin', true, NOW(), '{}'::jsonb),
    ('ukava', 'kava', true, NOW(), '{}'::jsonb),
    ('hard', 'kava-lend', true, NOW(), '{}'::jsonb),
    ('swp', 'kava-swap', true, NOW(), '{}'::jsonb),
    ('usdx', 'usdx', true, NOW(), '{}'::jsonb),
    ('usdt', 'tether', true, NOW(), '{}'::jsonb),
    ('uxki', 'ki', true, NOW(), '{}'::jsonb),
    ('lvn', 'lvn', true, NOW(), '{}'::jsonb),
    ('udarc', 'darcmatter-coin', true, NOW(), '{}'::jsonb),
    ('usk', 'usk', true, NOW(), '{}'::jsonb),
    ('fuzn', 'fuzion', true, NOW(), '{}'::jsonb),
    ('AQLA', 'aqualibre', true, NOW(), '{}'::jsonb),
    ('nstk', 'unstake-fi', true, NOW(), '{}'::jsonb),
    ('nami', 'nami-protocol', true, NOW(), '{}'::jsonb),
    ('ukyve', 'kyve-network', true, NOW(), '{}'::jsonb),
    ('ulamb', 'lambda', true, NOW(), '{}'::jsonb),
    ('ulava', 'lava-network', true, NOW(), '{}'::jsonb),
    ('nanolike', 'likecoin', true, NOW(), '{}'::jsonb),
    ('ulum', 'lum-network', true, NOW(), '{}'::jsonb)
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
