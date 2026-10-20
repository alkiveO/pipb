-- MySQL dump 10.13  Distrib 9.7.1, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: pipb
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `abouts`
--

DROP TABLE IF EXISTS `abouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `abouts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `abouts`
--

LOCK TABLES `abouts` WRITE;
/*!40000 ALTER TABLE `abouts` DISABLE KEYS */;
INSERT INTO `abouts` VALUES (1,'Mendorong ide menjadi peluang nyata.','\nPIPB merupakan platform untuk memperkenalkan berbagai produk dan inovasi mahasiswa serta memberikan ruang untuk berkembang dan dikenal lebih luas ΓÇö dari gagasan awal sampai produk siap didanai.','abouts/01M5BG1QPM5R8HPR1TJG9R6QQR.jpg','2026-10-19 18:50:37','2026-10-19 18:50:37');
/*!40000 ALTER TABLE `abouts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'F&B','2026-09-23 20:05:00','2026-09-23 20:05:00'),(2,'Digital','2026-09-23 20:05:00','2026-09-23 20:05:00');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `footer_links`
--

DROP TABLE IF EXISTS `footer_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `footer_links` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `section_title` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL,
  `href` varchar(255) NOT NULL,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `is_visible` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `footer_links`
--

LOCK TABLES `footer_links` WRITE;
/*!40000 ALTER TABLE `footer_links` DISABLE KEYS */;
INSERT INTO `footer_links` VALUES (1,'Navigasi','Produk','#produk',1,1,'2026-10-19 18:19:27','2026-10-19 18:19:27'),(2,'Navigasi','Cara Kerja','#cara-kerja',2,1,'2026-10-19 18:20:03','2026-10-19 18:20:03'),(3,'Navigasi','Tentang','#tentang',3,1,'2026-10-19 18:20:32','2026-10-19 18:20:32'),(4,'Navigasi','Berita','#berita',4,1,'2026-10-19 18:20:55','2026-10-19 18:20:55'),(5,'Akun','Login','/login',1,1,'2026-10-19 18:21:21','2026-10-19 18:21:21'),(6,'Akun','Daftar','/register',2,1,'2026-10-19 18:21:44','2026-10-19 18:21:44'),(7,'Akun','Ajukan Produk','/login',3,1,'2026-10-19 18:22:20','2026-10-19 18:22:20');
/*!40000 ALTER TABLE `footer_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `footer_settings`
--

DROP TABLE IF EXISTS `footer_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `footer_settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(255) NOT NULL DEFAULT 'PIPB',
  `logo_path` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `institution_name` varchar(255) DEFAULT NULL,
  `copyright_text` varchar(255) DEFAULT NULL,
  `use_current_year` tinyint(1) NOT NULL DEFAULT 1,
  `copyright_year` smallint(5) unsigned DEFAULT NULL,
  `back_to_top_label` varchar(255) NOT NULL DEFAULT 'Kembali ke atas Γåæ',
  `back_to_top_href` varchar(255) NOT NULL DEFAULT '#home',
  `show_back_to_top` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `footer_settings`
--

LOCK TABLES `footer_settings` WRITE;
/*!40000 ALTER TABLE `footer_settings` DISABLE KEYS */;
INSERT INTO `footer_settings` VALUES (1,'PIPB','footer/01M5BEFARHB0HB6W1XN4HCDQYN.jpeg','Pusat Inkubasi dan Pengembangan Bisnis\n\n','STT Terpadu Nurul Fikri','┬⌐ 2026 PIPB ΓÇö STT Terpadu Nurul Fikri. All rights reserved.',1,NULL,'Kembali ke atas Γåæ','#home',1,'2026-10-19 18:23:05','2026-10-19 18:23:05');
/*!40000 ALTER TABLE `footer_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `how_it_works`
--

DROP TABLE IF EXISTS `how_it_works`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `how_it_works` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `number` int(10) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `how_it_works_number_unique` (`number`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `how_it_works`
--

LOCK TABLES `how_it_works` WRITE;
/*!40000 ALTER TABLE `how_it_works` DISABLE KEYS */;
INSERT INTO `how_it_works` VALUES (1,1,'Buat Produk','Mahasiswa mendaftar dan mengunggah produk dengan informasi lengkap: nama, deskripsi, kategori, funding, dan foto.','2026-10-19 19:01:12','2026-10-19 19:01:12'),(2,2,'Submit Review','Produk yang diajukan masuk antrean review tim PIPB. Status awal adalah \"Pending\".','2026-10-19 19:01:32','2026-10-19 19:01:32'),(3,3,'Tim Review','Tim reviewer memeriksa kelengkapan, kualitas, dan relevansi produk. Keputusan: Approve atau Reject dengan alasan.\n','2026-10-19 19:01:56','2026-10-19 19:01:56'),(4,4,'Publish & Funding','Produk yang disetujui tayang di katalog publik. Investor dapat mendanai produk untuk mendukung pengembangan.','2026-10-19 19:02:17','2026-10-19 19:02:17');
/*!40000 ALTER TABLE `how_it_works` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (4,'0001_01_01_000000_create_users_table',1),(5,'0001_01_01_000001_create_cache_table',1),(6,'0001_01_01_000002_create_jobs_table',1),(7,'2026_09_24_024435_create_categories_table',2),(8,'2026_09_24_024521_create_products_table',3),(9,'2026_09_24_024548_create_product_images_table',3),(10,'2026_09_24_024634_create_news_table',3),(11,'2026_09_24_025159_create_personal_access_tokens_table',4),(12,'2026_09_29_014529_update_user_roles_enum',5),(13,'2026_09_29_015919_add_initial_fund_to_products_table',6),(14,'2026_09_29_022817_add_is_primary_to_product_images_table',7),(15,'2026_09_29_023129_create_product_votes_table',8),(16,'2026_10_01_010851_update_product_approval_statuses',9),(17,'2026_10_01_012644_add_feedback_to_product_votes_table',10),(18,'2026_10_01_013049_create_notifications_table',11),(19,'2026_10_01_064024_ensure_initial_fund_exists_on_products_table',12),(20,'2026_10_01_072111_add_detailed_scores_to_product_votes_table',13),(21,'2026_10_02_044718_add_plain_password_to_users_table',14),(22,'2026_10_02_064519_create_product_documents_table',15),(23,'2026_10_13_050627_add_event_fields_to_news_table',16),(24,'2026_10_13_071312_create_abouts_table',16),(25,'2026_10_13_082222_create_how_it_works_table',16),(26,'2026_10_13_084441_create_reviewers_table',16),(27,'2026_10_13_085219_add_photo_to_reviewers_table',16),(28,'2026_10_15_031126_add_category_scores_and_feedback_to_product_votes_table',16),(29,'2026_10_15_033035_create_navbar_items_table',16),(30,'2026_10_16_012216_create_footer_links_table',16),(31,'2026_10_16_013142_create_footer_settings_table',16),(32,'2026_10_16_020806_add_logo_path_to_navbar_items_table',16),(33,'2026_10_16_021143_create_navbar_settings_table',16);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `navbar_items`
--

DROP TABLE IF EXISTS `navbar_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `navbar_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  `href` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'link',
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `is_visible` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `logo_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `navbar_items`
--

LOCK TABLES `navbar_items` WRITE;
/*!40000 ALTER TABLE `navbar_items` DISABLE KEYS */;
INSERT INTO `navbar_items` VALUES (1,'Home','#home','link',1,1,'2026-10-19 18:14:31','2026-10-19 18:14:31',NULL),(2,'Tentang','#tentang','link',2,1,'2026-10-19 18:15:53','2026-10-19 18:15:53',NULL),(3,'Produk','#produk','link',3,1,'2026-10-19 18:16:18','2026-10-19 18:16:18',NULL),(4,'Berita','#berita','link',4,1,'2026-10-19 18:16:51','2026-10-19 18:16:51',NULL),(5,'Submit Product','/login','cta',5,1,'2026-10-19 18:17:26','2026-10-19 18:17:26',NULL);
/*!40000 ALTER TABLE `navbar_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `navbar_settings`
--

DROP TABLE IF EXISTS `navbar_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `navbar_settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(255) NOT NULL DEFAULT 'PIPB',
  `logo_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `navbar_settings`
--

LOCK TABLES `navbar_settings` WRITE;
/*!40000 ALTER TABLE `navbar_settings` DISABLE KEYS */;
INSERT INTO `navbar_settings` VALUES (1,'PIPB','navbar/01M5BE796VPD1J8MMS02HBZCAP.jpg','2026-10-19 18:18:41','2026-10-19 18:18:41');
/*!40000 ALTER TABLE `navbar_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `admin_id` bigint(20) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `event_time` time DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `news_admin_id_foreign` (`admin_id`),
  CONSTRAINT `news_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (1,6,'Seminar Technopreneurship','Peluang, Tantangan, dan Strategi Sukses untuk Mahasiswa','news/01M5BFEREGQFVC14X8E4JN9PW0.jpg','2026-11-22','10:00:00','Auditorium Kampus B2','2026-10-19 18:40:15','2026-10-19 18:40:30'),(2,6,'seminar','Writing, Publishing, and Celebrating Research Impact\n','news/01M5BFJXZBT9TQ8QY8D8AVNKBT.jpg','2026-12-16','10:20:00','Aula Kampus STT','2026-10-19 18:42:32','2026-10-19 18:42:32');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_documents`
--

DROP TABLE IF EXISTS `product_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_documents` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `file_size` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_documents_product_id_foreign` (`product_id`),
  CONSTRAINT `product_documents_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_documents`
--

LOCK TABLES `product_documents` WRITE;
/*!40000 ALTER TABLE `product_documents` DISABLE KEYS */;
INSERT INTO `product_documents` VALUES (2,8,'Pertemuan ketiga.pdf','product-documents/oWUdvklANGG8196alx51VvPbZQEWk5W20JyQByPr.pdf','application/pdf',1042247,'2026-10-19 18:29:53','2026-10-19 18:29:53'),(3,9,'Pertemuan ketiga.pdf','product-documents/LCr1CnpIdUI5cHqJJ63qQH0a5gGpOTd3lUrWNODe.pdf','application/pdf',1042247,'2026-10-19 18:34:58','2026-10-19 18:34:58');
/*!40000 ALTER TABLE `product_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_foreign` (`product_id`),
  CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (22,8,'products/ptFE9N7tBfDfkOBjWL5wSU6EXn4yxuXYPY2WIn4L.png',1,'2026-10-19 18:29:51','2026-10-19 18:29:51'),(23,8,'products/IaDrVUyIQmeEFJtpQgK1qwgOkgS4W4XpSoj8EtUS.png',0,'2026-10-19 18:29:51','2026-10-19 18:29:51'),(24,8,'products/wFXLnZTdcza08IVGmMEzYgdoBrvQBIrDik8FXncp.png',0,'2026-10-19 18:29:51','2026-10-19 18:29:51'),(25,8,'products/y8hbJdJKZC3qhXaEkCTO5gu7V4sxbgqU9wcAwrXI.png',0,'2026-10-19 18:29:51','2026-10-19 18:29:51'),(26,9,'products/baRERq3TOx6U7V3fU1Cdqm9rHmeqIbCLTCAPdnhe.png',1,'2026-10-19 18:34:57','2026-10-19 18:34:57'),(27,9,'products/ECUxO4Zs7VxJ4eEyMvkx8ssuibFBd6mwe7Kg4r3p.png',0,'2026-10-19 18:34:57','2026-10-19 18:34:57'),(28,9,'products/m0Cvnmo56ZrVWbQXsxGyCiJdmvz8gViufjojxuxA.png',0,'2026-10-19 18:34:57','2026-10-19 18:34:57'),(29,9,'products/ezvwNpluQxKuBrSFnJyu7iGMV7C1uLQBkIon4YZj.png',0,'2026-10-19 18:34:57','2026-10-19 18:34:57');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_votes`
--

DROP TABLE IF EXISTS `product_votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_votes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned NOT NULL,
  `content_manager_id` bigint(20) unsigned NOT NULL,
  `score` tinyint(3) unsigned NOT NULL,
  `design_score` tinyint(3) unsigned DEFAULT NULL,
  `usability_score` tinyint(3) unsigned DEFAULT NULL,
  `creativity_score` tinyint(3) unsigned DEFAULT NULL,
  `content_score` tinyint(3) unsigned DEFAULT NULL,
  `overall_score` decimal(5,2) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_votes_product_id_content_manager_id_unique` (`product_id`,`content_manager_id`),
  KEY `product_votes_content_manager_id_foreign` (`content_manager_id`),
  KEY `product_votes_score_index` (`score`),
  CONSTRAINT `product_votes_content_manager_id_foreign` FOREIGN KEY (`content_manager_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_votes_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_votes`
--

LOCK TABLES `product_votes` WRITE;
/*!40000 ALTER TABLE `product_votes` DISABLE KEYS */;
INSERT INTO `product_votes` VALUES (7,8,6,95,95,92,96,98,95.25,'keren nih, saya suka hebat ≡ƒæÅ','2026-10-19 18:36:06','2026-10-19 18:36:06'),(8,9,6,97,98,96,98,97,97.25,'kereennnn hebat sekali kamuuu ≡ƒæÅ≡ƒæÅ≡ƒæÅ≡ƒæÅ','2026-10-19 18:36:53','2026-10-19 18:36:53');
/*!40000 ALTER TABLE `product_votes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `category_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `target_fund` decimal(15,2) NOT NULL DEFAULT 0.00,
  `initial_fund` decimal(15,2) NOT NULL DEFAULT 0.00,
  `investment_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `launch_date` date DEFAULT NULL,
  `approval_status` enum('pending_review','needs_revision','rejected','published') NOT NULL DEFAULT 'pending_review',
  `launch_status` enum('belum_launch','launch') NOT NULL DEFAULT 'belum_launch',
  `rejection_reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `products_new_user_id_foreign` (`user_id`),
  KEY `products_new_category_id_foreign` (`category_id`),
  CONSTRAINT `products_new_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `products_new_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (8,4,2,'Giordano Betti','Giordano Betti is an independent cinematographer and DOP. The website is a smooth visual experience designed to showcase his portfolio through rich imagery and fluid interactions.',15000000.00,1000000.00,1000000.00,'2026-12-31','published','belum_launch',NULL,'2026-10-19 18:29:48','2026-10-19 18:35:21'),(9,8,2,'Sweet Tape','Reimagine an everyday tape essential as something more thoughtful, expressive, and full of heart.',16000000.00,8000000.00,8000000.00,'2027-01-12','published','belum_launch',NULL,'2026-10-19 18:34:55','2026-10-19 18:36:21');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviewers`
--

DROP TABLE IF EXISTS `reviewers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviewers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviewers`
--

LOCK TABLES `reviewers` WRITE;
/*!40000 ALTER TABLE `reviewers` DISABLE KEYS */;
INSERT INTO `reviewers` VALUES (1,'Rian Pratama','Dosen','reviewers/01M5BG90TGKFTAR31BXF7M1CCV.jpg',1,'2026-10-19 18:54:35','2026-10-19 18:54:35'),(3,'Aris Prasetyo','Dosen','reviewers/01M5BGBEFC678EFK5DBBXY4D0B.jpg',3,'2026-10-19 18:55:55','2026-10-19 18:55:55'),(4,'Dewi Lestari','Dosen','reviewers/01M5BGC7ZSJPKM98ZTHSKVN104.jpg',4,'2026-10-19 18:56:21','2026-10-19 18:56:21'),(5,'Maya Indah','Dosen','reviewers/01M5BGD0QS1754TQ5Q9W4A5PWM.jpg',5,'2026-10-19 18:56:46','2026-10-19 18:56:46'),(6,'Siska Utami','Dosen','reviewers/01M5BGE0038Y5CPPK525FM3022.jpg',6,'2026-10-19 18:57:18','2026-10-19 18:57:18'),(7,'Hendra Wijaya','Dosen','reviewers/01M5BGK7XSC762YBBR0R6BZXB6.jpg',2,'2026-10-19 19:00:10','2026-10-19 19:00:10');
/*!40000 ALTER TABLE `reviewers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `plain_password` varchar(255) DEFAULT NULL,
  `role` enum('admin','content_manager','mahasiswa') NOT NULL DEFAULT 'mahasiswa',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'al','al@gmail.com',NULL,'$2y$12$mv5uTOtT95Hot2xXuzNymuJFhPa2yNeykIzX2OnKlMCsB8Ae04/Ya',NULL,'mahasiswa',NULL,'2026-09-24 01:03:47','2026-09-24 01:03:47'),(5,'Admin PIPB','admin@pipb.com',NULL,'$2y$12$gNyIDedEr5hccRMZkSfHVO6Kftxwxcg2D/zpSF/.PkuKy2wbgKtDq',NULL,'admin',NULL,'2026-09-27 20:16:35','2026-09-27 20:16:35'),(6,'Hendra Wijaya','dosen@pipb.com',NULL,'$2y$12$9JufXBM3IczVAEIymkmIBOsTi3YY7o70fwaNYDJHCHPKvC8VqFarm',NULL,'content_manager',NULL,'2026-09-28 18:47:13','2026-10-19 18:49:30'),(7,'Rian Pratama','dosen2@gmail.com',NULL,'$2y$12$/VIEURkdwdIaQeEbAa66EOzZ0hUyk/bCQLKTh7Pf8l7LF3GvB7Bku',NULL,'content_manager',NULL,'2026-09-29 20:56:46','2026-10-19 18:49:03'),(8,'shaina abinaya','shaina@gmail.com',NULL,'$2y$12$WHUBLQ9G6duTAaOigDYJo.pxoRl7fB7mZI.6h1SBFKyuwqcoGq53e',NULL,'mahasiswa',NULL,'2026-10-19 18:32:34','2026-10-19 18:32:34');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-20  9:19:33
