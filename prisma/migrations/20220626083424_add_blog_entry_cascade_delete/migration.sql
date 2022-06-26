-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlogEntryBodyDraft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "blogEntryId" TEXT NOT NULL,
    CONSTRAINT "BlogEntryBodyDraft_blogEntryId_fkey" FOREIGN KEY ("blogEntryId") REFERENCES "BlogEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BlogEntryBodyDraft" ("blogEntryId", "body", "createdAt", "id", "title", "updatedAt") SELECT "blogEntryId", "body", "createdAt", "id", "title", "updatedAt" FROM "BlogEntryBodyDraft";
DROP TABLE "BlogEntryBodyDraft";
ALTER TABLE "new_BlogEntryBodyDraft" RENAME TO "BlogEntryBodyDraft";
CREATE UNIQUE INDEX "BlogEntryBodyDraft_blogEntryId_key" ON "BlogEntryBodyDraft"("blogEntryId");
CREATE TABLE "new_BlogEntryBodyHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "blogEntryId" TEXT NOT NULL,
    CONSTRAINT "BlogEntryBodyHistory_blogEntryId_fkey" FOREIGN KEY ("blogEntryId") REFERENCES "BlogEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BlogEntryBodyHistory" ("blogEntryId", "body", "createdAt", "id", "title", "updatedAt") SELECT "blogEntryId", "body", "createdAt", "id", "title", "updatedAt" FROM "BlogEntryBodyHistory";
DROP TABLE "BlogEntryBodyHistory";
ALTER TABLE "new_BlogEntryBodyHistory" RENAME TO "BlogEntryBodyHistory";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
