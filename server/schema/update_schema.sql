-- File: add_columns_if_not_exists.sql

DO $$
BEGIN
    -- Check and add new_column_name if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'transactions' AND column_name = 'title'
    ) THEN
        ALTER TABLE transactions
        ADD COLUMN title VARCHAR(255) DEFAULT '';
    END IF;
END $$;

DO $$
BEGIN
    -- Check and add new_column_name if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'transactions' AND column_name = 'signed_at'
    ) THEN
        ALTER TABLE transactions
        ADD COLUMN signed_at TIMESTAMP DEFAULT NULL;
    END IF;
END $$;
