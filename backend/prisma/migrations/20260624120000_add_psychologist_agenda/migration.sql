CREATE TABLE "psychologist_agenda_entries" (
    "id" TEXT NOT NULL,
    "psychologistId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "patientName" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "psychologist_agenda_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "psychologist_agenda_entries_psychologistId_startsAt_idx"
ON "psychologist_agenda_entries"("psychologistId", "startsAt");

ALTER TABLE "psychologist_agenda_entries"
ADD CONSTRAINT "psychologist_agenda_entries_psychologistId_fkey"
FOREIGN KEY ("psychologistId") REFERENCES "psychologists"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
