-- CreateTable
CREATE TABLE "BlogEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "slug" TEXT NOT NULL,
    "publishAt" TIMESTAMP(3),

    CONSTRAINT "BlogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogEntryBodyHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "blogEntryId" TEXT NOT NULL,

    CONSTRAINT "BlogEntryBodyHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogEntryBodyDraft" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "blogEntryId" TEXT NOT NULL,

    CONSTRAINT "BlogEntryBodyDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogMetaTag" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BlogMetaTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogEntryToBlogMetaTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogEntry_slug_key" ON "BlogEntry"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogEntryBodyDraft_blogEntryId_key" ON "BlogEntryBodyDraft"("blogEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogMetaTag_name_key" ON "BlogMetaTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogEntryToBlogMetaTag_AB_unique" ON "_BlogEntryToBlogMetaTag"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogEntryToBlogMetaTag_B_index" ON "_BlogEntryToBlogMetaTag"("B");

-- AddForeignKey
ALTER TABLE "BlogEntryBodyHistory" ADD CONSTRAINT "BlogEntryBodyHistory_blogEntryId_fkey" FOREIGN KEY ("blogEntryId") REFERENCES "BlogEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogEntryBodyDraft" ADD CONSTRAINT "BlogEntryBodyDraft_blogEntryId_fkey" FOREIGN KEY ("blogEntryId") REFERENCES "BlogEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogEntryToBlogMetaTag" ADD CONSTRAINT "_BlogEntryToBlogMetaTag_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogEntryToBlogMetaTag" ADD CONSTRAINT "_BlogEntryToBlogMetaTag_B_fkey" FOREIGN KEY ("B") REFERENCES "BlogMetaTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
