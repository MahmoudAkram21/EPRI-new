-- CreateTable
CREATE TABLE `service_center` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `headline` VARCHAR(191) NULL,
  `description` LONGTEXT NULL,
  `image` VARCHAR(191) NULL,
  `banner_image` VARCHAR(191) NULL,
  `location` VARCHAR(191) NULL,
  `contact_phone` VARCHAR(191) NULL,
  `contact_email` VARCHAR(191) NULL,
  `equipments` JSON NULL,
  `products` JSON NULL,
  `lab_methodology` LONGTEXT NULL,
  `work_volume` JSON NULL,
  `company_activity` JSON NULL,
  `future_prospective` LONGTEXT NULL,
  `services` JSON NULL,
  `metrics` JSON NULL,
  `is_featured` BOOLEAN NOT NULL DEFAULT false,
  `is_published` BOOLEAN NOT NULL DEFAULT true,
  `order_index` INTEGER NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `service_center_slug_key`(`slug`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


