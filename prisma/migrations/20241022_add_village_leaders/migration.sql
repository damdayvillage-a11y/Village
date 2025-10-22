-- CreateTable: village_leaders
-- This migration creates the village_leaders table if it doesn't exist

-- Create the village_leaders table
CREATE TABLE IF NOT EXISTS "village_leaders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "message" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "village_leaders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "village_leaders_priority_idx" ON "village_leaders"("priority");

-- Insert default village leaders if table is empty
INSERT INTO "village_leaders" ("id", "name", "position", "photo", "message", "priority", "isActive", "createdAt", "updatedAt")
SELECT 
    'cldefault001',
    'श्री नरेंद्र मोदी',
    'प्रधान मंत्री',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Narendra_Modi_2022_portrait.jpg/800px-Narendra_Modi_2022_portrait.jpg',
    NULL,
    0,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "village_leaders" WHERE "id" = 'cldefault001');

INSERT INTO "village_leaders" ("id", "name", "position", "photo", "message", "priority", "isActive", "createdAt", "updatedAt")
SELECT 
    'cldefault002',
    'श्री पुष्कर सिंह धामी',
    'मुख्य मंत्री, उत्तराखंड',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Pushkar_Singh_Dhami.jpg/800px-Pushkar_Singh_Dhami.jpg',
    NULL,
    1,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "village_leaders" WHERE "id" = 'cldefault002');

INSERT INTO "village_leaders" ("id", "name", "position", "photo", "message", "priority", "isActive", "createdAt", "updatedAt")
SELECT 
    'cldefault003',
    'श्री रामलाल सिंह',
    'ग्राम प्रधान, दामदे',
    '/images/leaders/gram-pradhan.jpg',
    'हमारे गांव में आपका स्वागत है। दामदे गांव कार्बन-मुक्त और तकनीकी रूप से उन्नत मॉडल गांव बनने की दिशा में प्रतिबद्ध है।',
    2,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "village_leaders" WHERE "id" = 'cldefault003');
