/*
  Warnings:

  - You are about to drop the column `equipments` on the `service_center` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `service_center` DROP COLUMN `equipments`,
    MODIFY `description` TEXT NULL,
    MODIFY `lab_methodology` TEXT NULL,
    MODIFY `future_prospective` TEXT NULL,
    ALTER COLUMN `updated_at` DROP DEFAULT;
