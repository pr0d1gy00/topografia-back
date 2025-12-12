-- CreateEnum
CREATE TYPE "InstrumentType" AS ENUM ('THEODOLITE', 'LEVEL', 'TOTAL_STATION', 'GPS');

-- CreateEnum
CREATE TYPE "SurfaceType" AS ENUM ('INITIAL', 'FINAL');

-- CreateTable
CREATE TABLE "app_user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instrument" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InstrumentType" NOT NULL,
    "serial" TEXT,
    "stadiaConstant" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "stadiaAddition" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "instrument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "station" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "instrumentId" INTEGER NOT NULL,
    "occupiedPointId" INTEGER NOT NULL,
    "heightInstrument" DOUBLE PRECISION NOT NULL,
    "backsightPointId" INTEGER,
    "backsightAngle" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observation" (
    "id" SERIAL NOT NULL,
    "stationId" INTEGER NOT NULL,
    "targetPointId" INTEGER,
    "angleHorizontal" DOUBLE PRECISION NOT NULL,
    "angleVertical" DOUBLE PRECISION,
    "heightTarget" DOUBLE PRECISION NOT NULL,
    "isStadia" BOOLEAN NOT NULL DEFAULT false,
    "stadiaTop" DOUBLE PRECISION,
    "stadiaBottom" DOUBLE PRECISION,
    "stadiaMiddle" DOUBLE PRECISION,
    "distanceSlope" DOUBLE PRECISION,
    "distanceHoriz" DOUBLE PRECISION,
    "description" TEXT,

    CONSTRAINT "observation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "levelingRun" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "instrumentId" INTEGER,

    CONSTRAINT "levelingRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "levelingReading" (
    "id" SERIAL NOT NULL,
    "runId" INTEGER NOT NULL,
    "pointId" INTEGER,
    "backsight" DOUBLE PRECISION,
    "intermediate" DOUBLE PRECISION,
    "foresight" DOUBLE PRECISION,
    "calculatedAI" DOUBLE PRECISION,
    "calculatedZ" DOUBLE PRECISION,
    "order" INTEGER NOT NULL,

    CONSTRAINT "levelingReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "point" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "z" DOUBLE PRECISION NOT NULL,
    "code" TEXT,
    "isFixed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "layer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "projectId" INTEGER NOT NULL,
    "drawingData" JSONB,

    CONSTRAINT "layer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surface" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "type" "SurfaceType" NOT NULL,
    "contourIntervalMajor" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "contourIntervalMinor" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "contourGeometry" JSONB,

    CONSTRAINT "surface_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pointsOnSurfaces" (
    "pointId" INTEGER NOT NULL,
    "surfaceId" INTEGER NOT NULL,

    CONSTRAINT "pointsOnSurfaces_pkey" PRIMARY KEY ("pointId","surfaceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_user_email_key" ON "app_user"("email");

-- AddForeignKey
ALTER TABLE "instrument" ADD CONSTRAINT "instrument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "station" ADD CONSTRAINT "station_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "station" ADD CONSTRAINT "station_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "instrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "station" ADD CONSTRAINT "station_occupiedPointId_fkey" FOREIGN KEY ("occupiedPointId") REFERENCES "point"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "station" ADD CONSTRAINT "station_backsightPointId_fkey" FOREIGN KEY ("backsightPointId") REFERENCES "point"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observation" ADD CONSTRAINT "observation_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observation" ADD CONSTRAINT "observation_targetPointId_fkey" FOREIGN KEY ("targetPointId") REFERENCES "point"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "levelingRun" ADD CONSTRAINT "levelingRun_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "levelingRun" ADD CONSTRAINT "levelingRun_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "instrument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "levelingReading" ADD CONSTRAINT "levelingReading_runId_fkey" FOREIGN KEY ("runId") REFERENCES "levelingRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "levelingReading" ADD CONSTRAINT "levelingReading_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "point"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point" ADD CONSTRAINT "point_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "layer" ADD CONSTRAINT "layer_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surface" ADD CONSTRAINT "surface_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pointsOnSurfaces" ADD CONSTRAINT "pointsOnSurfaces_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "point"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pointsOnSurfaces" ADD CONSTRAINT "pointsOnSurfaces_surfaceId_fkey" FOREIGN KEY ("surfaceId") REFERENCES "surface"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
