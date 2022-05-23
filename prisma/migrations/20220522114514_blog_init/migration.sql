-- CreateTable
CREATE TABLE "BlogEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "slug" TEXT NOT NULL,
    "publishedAt" DATETIME
);

-- CreateTable
CREATE TABLE "BlogEntryBody" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "blogEntryId" TEXT NOT NULL,
    CONSTRAINT "BlogEntryBody_blogEntryId_fkey" FOREIGN KEY ("blogEntryId") REFERENCES "BlogEntry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlogEntryBodyDraft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "blogEntryId" TEXT NOT NULL,
    CONSTRAINT "BlogEntryBodyDraft_blogEntryId_fkey" FOREIGN KEY ("blogEntryId") REFERENCES "BlogEntry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogEntry_slug_key" ON "BlogEntry"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogEntryBodyDraft_blogEntryId_key" ON "BlogEntryBodyDraft"("blogEntryId");
