-- CreateTable
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dimensions" JSONB NOT NULL,
    "position" JSONB NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#f3f4f6',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Table" ADD COLUMN     "zoneId" TEXT;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_zoneId_fkey" FOREIGN KEY("zoneId") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;