-- Convert MenuCategory enum into a model-backed category table without breaking existing menu items.

ALTER TABLE "MenuItem"
    ALTER COLUMN "category" TYPE TEXT USING "category"::text;

DROP TYPE IF EXISTS "MenuCategory";

CREATE TABLE IF NOT EXISTS "MenuCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuCategory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "MenuCategory_name_key" ON "MenuCategory"("name");

-- Seed defaults for backward compatibility and also preserve any existing values.
INSERT INTO "MenuCategory" ("id", "name", "updatedAt")
VALUES
    (md5(random()::text || clock_timestamp()::text), 'APPETIZER', CURRENT_TIMESTAMP),
    (md5(random()::text || clock_timestamp()::text), 'MAIN_COURSE', CURRENT_TIMESTAMP),
    (md5(random()::text || clock_timestamp()::text), 'DESSERT', CURRENT_TIMESTAMP),
    (md5(random()::text || clock_timestamp()::text), 'BEVERAGE', CURRENT_TIMESTAMP),
    (md5(random()::text || clock_timestamp()::text), 'SIDE', CURRENT_TIMESTAMP),
    (md5(random()::text || clock_timestamp()::text), 'SALAD', CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "MenuCategory" ("id", "name", "updatedAt")
SELECT md5(random()::text || clock_timestamp()::text), "category"::text, CURRENT_TIMESTAMP
FROM "MenuItem"
ON CONFLICT ("name") DO NOTHING;

CREATE INDEX IF NOT EXISTS "MenuItem_category_idx" ON "MenuItem"("category");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'MenuItem_category_fkey'
    ) THEN
        ALTER TABLE "MenuItem"
            ADD CONSTRAINT "MenuItem_category_fkey"
            FOREIGN KEY ("category") REFERENCES "MenuCategory"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
