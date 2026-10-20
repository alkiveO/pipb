-- MySQL dump 10.13  Distrib 9.7.1, for Win64 (x86_64)
--
-- Host: localhost    Database: pipb
-- ------------------------------------------------------
-- Server version	9.7.1

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '38ac890d-7e07-11f1-8fe7-eb0c7a41d56b:1-1403';

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('laravel-cache-livewire-rate-limiter:16d36dff9abd246c67dfac3e63b993a169af77e6','i:2;',1791516589),('laravel-cache-livewire-rate-limiter:16d36dff9abd246c67dfac3e63b993a169af77e6:timer','i:1791516589;',1791516589);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
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
INSERT INTO `categories` VALUES (1,'F&B','2026-09-23 20:05:00','2026-09-23 20:05:00'),(2,'Digital','2026-09-23 20:05:00','2026-09-23 20:05:00'),(5,'kategori 3','2026-10-08 20:24:33','2026-10-08 20:24:33');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (4,'0001_01_01_000000_create_users_table',1),(5,'0001_01_01_000001_create_cache_table',1),(6,'0001_01_01_000002_create_jobs_table',1),(7,'2026_09_24_024435_create_categories_table',2),(8,'2026_09_24_024521_create_products_table',3),(9,'2026_09_24_024548_create_product_images_table',3),(10,'2026_09_24_024634_create_news_table',3),(11,'2026_09_24_025159_create_personal_access_tokens_table',4),(12,'2026_09_29_014529_update_user_roles_enum',5),(13,'2026_09_29_015919_add_initial_fund_to_products_table',6),(14,'2026_09_29_022817_add_is_primary_to_product_images_table',7),(15,'2026_09_29_023129_create_product_votes_table',8),(16,'2026_10_01_010851_update_product_approval_statuses',9),(17,'2026_10_01_012644_add_feedback_to_product_votes_table',10),(18,'2026_10_01_013049_create_notifications_table',11),(19,'2026_10_01_064024_ensure_initial_fund_exists_on_products_table',12),(20,'2026_10_01_072111_add_detailed_scores_to_product_votes_table',13),(21,'2026_10_02_044718_add_plain_password_to_users_table',14),(22,'2026_10_02_064519_create_product_documents_table',15);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `admin_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `news_admin_id_foreign` (`admin_id`),
  CONSTRAINT `news_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_id` bigint unsigned NOT NULL,
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',3,'api-token','7ec69f3d311d82823cbf6ce54ee618970ed9daa9002a5b0ce4aa3a77a9cb7355','[\"*\"]',NULL,NULL,'2026-09-23 21:45:58','2026-09-23 21:45:58'),(2,'App\\Models\\User',3,'api-token','145b3692ef868a387ac3b05d8280fe2e33f3ce76e394c879cfbda797af6ce739','[\"*\"]',NULL,NULL,'2026-09-23 21:46:49','2026-09-23 21:46:49'),(3,'App\\Models\\User',3,'api-token','546fc0aea507a4599d7af7373b5e5b69b42edd3e66c6ecdc498bbbca4174a3dd','[\"*\"]',NULL,NULL,'2026-09-23 21:49:49','2026-09-23 21:49:49'),(5,'App\\Models\\User',3,'api-token','dc394d5e3f560f1f5d9555f5109e2a686fc68db39a76ceac9489637cd2445cee','[\"*\"]',NULL,NULL,'2026-09-23 21:57:18','2026-09-23 21:57:18'),(6,'App\\Models\\User',3,'api-token','47eee8ac79de3934931f46075b7fe499d229267b5a38ab22350b04aacbeb0100','[\"*\"]',NULL,NULL,'2026-09-24 00:52:11','2026-09-24 00:52:11'),(8,'App\\Models\\User',4,'api-token','abf3a939aff0fac541c8251e9580c02aeb6b848ecf987c4930f89f067d24c0d5','[\"*\"]',NULL,NULL,'2026-09-24 01:03:53','2026-09-24 01:03:53'),(9,'App\\Models\\User',4,'api-token','6476ac825e6a1327644418e28a9f46a2b1e63f3b173ab22b68e5d32256f3b01b','[\"*\"]','2026-09-24 01:19:54',NULL,'2026-09-24 01:10:56','2026-09-24 01:19:54'),(10,'App\\Models\\User',4,'api-token','09f6cf1f1a2a9b5d487225f4abeac274d679b4c52b9b4b8bc5bd205f9a6c2da3','[\"*\"]','2026-09-27 18:37:21',NULL,'2026-09-27 18:36:47','2026-09-27 18:37:21'),(11,'App\\Models\\User',4,'api-token','5fffab734a20a000bf8ef349c8c9ace2dde651dca30817601f137a889ec4aa4c','[\"*\"]',NULL,NULL,'2026-09-27 18:37:34','2026-09-27 18:37:34'),(12,'App\\Models\\User',4,'api-token','a54bfc90136a86aa883edb2c978fbd0ed0070be07ae28b3ecf7918d6c633cfb3','[\"*\"]',NULL,NULL,'2026-09-27 18:39:37','2026-09-27 18:39:37'),(13,'App\\Models\\User',4,'api-token','429cb73044777a56033aba1e2c32a989dfdcdfa1680a2fc6fa8cedaa92f8e011','[\"*\"]',NULL,NULL,'2026-09-27 18:42:43','2026-09-27 18:42:43'),(14,'App\\Models\\User',4,'api-token','54185fab3cb1884140997b59c2baab288e1311293882ada1b1e20f13289ad0d6','[\"*\"]',NULL,NULL,'2026-09-27 18:46:35','2026-09-27 18:46:35'),(15,'App\\Models\\User',5,'api-token','f234cb56ff8b1462545df2372aa91b1e671b12c055c5eecb76b53fe717c86839','[\"*\"]','2026-09-27 20:18:14',NULL,'2026-09-27 20:18:03','2026-09-27 20:18:14'),(16,'App\\Models\\User',5,'api-token','d9d300462216a9a23814837aa1591c5fe315f988e8ffc9c6e0d803a5042e9770','[\"*\"]','2026-09-28 00:13:57',NULL,'2026-09-28 00:05:36','2026-09-28 00:13:57'),(23,'App\\Models\\User',6,'api-token','97d3121f63ad3ef5fec9c822b6225a0b712f6ea93437c116eff3882febb8294c','[\"*\"]',NULL,NULL,'2026-09-29 20:33:26','2026-09-29 20:33:26'),(32,'App\\Models\\User',4,'api-token','81c84e8de8d072043570002a6fa15b9dd7a9e138973f37e1a71c722ba2072c92','[\"*\"]','2026-09-29 21:07:16',NULL,'2026-09-29 21:07:13','2026-09-29 21:07:16'),(33,'App\\Models\\User',4,'api-token','061d1876510c07d9509fa112254ee383d983ec3f899c27ee2b4737b8ae88a349','[\"*\"]','2026-09-30 18:42:56',NULL,'2026-09-30 18:42:49','2026-09-30 18:42:56'),(34,'App\\Models\\User',4,'api-token','0c00a742bb865293bad03f7f378683644e9c4e8c93a65612e80b904493737489','[\"*\"]','2026-09-30 23:43:19',NULL,'2026-09-30 23:35:51','2026-09-30 23:43:19'),(35,'App\\Models\\User',4,'api-token','f25ee3bbb867aa586aadc20f4f6acfbf894da28c85aa481e5e34052267544fb1','[\"*\"]','2026-10-01 00:19:19',NULL,'2026-10-01 00:18:50','2026-10-01 00:19:19'),(36,'App\\Models\\User',4,'api-token','f34675c27afefda5900e10b554624d100456b15d8409efa751bdd86d5a90c7f9','[\"*\"]','2026-10-01 21:24:50',NULL,'2026-10-01 21:20:08','2026-10-01 21:24:50'),(37,'App\\Models\\User',4,'api-token','2892d427f6923257d7c7745058f616afbd0d196a85e11be3ade44c8fc1a99563','[\"*\"]','2026-10-01 21:41:41',NULL,'2026-10-01 21:41:31','2026-10-01 21:41:41'),(38,'App\\Models\\User',4,'api-token','78af7844074463c1aba78e83a7333f1133e15a4d2c18c841b3078838e4d99d48','[\"*\"]','2026-10-02 00:05:09',NULL,'2026-10-01 23:55:27','2026-10-02 00:05:09'),(39,'App\\Models\\User',4,'api-token','3fdb9970440348db2dcbe0d4cd338a0fcca87488ffc9ed8581c8fe8d5d0a9f92','[\"*\"]','2026-10-02 00:07:13',NULL,'2026-10-02 00:05:30','2026-10-02 00:07:13'),(40,'App\\Models\\User',4,'api-token','cbebbb032c8bb4a053c07c6584011a8e94319b8809384ec6c5ba51e737dfead5','[\"*\"]','2026-10-02 01:27:13',NULL,'2026-10-02 01:27:03','2026-10-02 01:27:13'),(43,'App\\Models\\User',5,'api-token','dce2692039e27344bd91463197513b29afa1343291743cbbee8fa8cd1f147450','[\"*\"]','2026-10-08 20:16:41',NULL,'2026-10-08 20:16:11','2026-10-08 20:16:41'),(44,'App\\Models\\User',5,'api-token','70134f243a0cb92e0426b7e221159e1e4a5c7e6fd378adb1196ad9621d4ccb1a','[\"*\"]',NULL,NULL,'2026-10-08 20:16:57','2026-10-08 20:16:57'),(46,'App\\Models\\User',6,'api-token','18902f08662f89b79a799a4f94b124ff5f3d38d855416c5ddd48a7047527f75e','[\"*\"]','2026-10-08 20:17:40',NULL,'2026-10-08 20:17:31','2026-10-08 20:17:40'),(50,'App\\Models\\User',5,'api-token','38731722ece52dea5276eff5e65084a4aa50fc0d26575ff4ca865c6448459559','[\"*\"]','2026-10-08 20:21:58',NULL,'2026-10-08 20:21:49','2026-10-08 20:21:58');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_documents`
--

DROP TABLE IF EXISTS `product_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_documents_product_id_foreign` (`product_id`),
  CONSTRAINT `product_documents_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_documents`
--

LOCK TABLES `product_documents` WRITE;
/*!40000 ALTER TABLE `product_documents` DISABLE KEYS */;
INSERT INTO `product_documents` VALUES (1,7,'dokumen_dummy_pipb_10mb.pdf','product-documents/WPAPOn8MbJXtDiMHFsrjsFzITHOtQxV7bFhA8RUP.pdf','application/pdf',34228764,'2026-10-02 00:06:42','2026-10-02 00:06:42');
/*!40000 ALTER TABLE `product_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_foreign` (`product_id`),
  CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (2,3,'products/a8cA6CAvzlrLfip1Ik6WSTZZaYZthcswdk8f9Fil.png',1,'2026-09-29 20:31:53','2026-09-29 20:31:53'),(3,3,'products/wKcBN5Adx1EFtU3ZsLDgVM1WggHf8Iz3LPyUZyE7.png',0,'2026-09-29 20:31:53','2026-09-29 20:31:53'),(4,3,'products/ZXSudNe97gD99qA1NxyIuJkoFNhpvJNX875fGimC.png',0,'2026-09-29 20:31:53','2026-09-29 20:31:53'),(5,3,'products/sxU6GkrGhUjvBEu6FrseZm05efAZWvqahZsez888.png',0,'2026-09-29 20:31:53','2026-09-29 20:31:53'),(6,4,'products/HfxqlUH6tI1jaKqk9J0pX4Pf3Ge4zwAjSuUNsbqJ.png',1,'2026-09-30 23:43:19','2026-09-30 23:43:19'),(7,4,'products/WCPqvr1JhuaG1aPpGLmFEXBu9p1Y0h5L29iuf3qu.png',0,'2026-09-30 23:43:19','2026-09-30 23:43:19'),(8,4,'products/G5fTlhTTRW0p7jHIB9u0byqE50eVByqC8ou7LuKk.png',0,'2026-09-30 23:43:19','2026-09-30 23:43:19'),(9,4,'products/v7Y38ecBRjXyRQgqpFSoOpwODc3fbbFOW3z2ivTQ.png',0,'2026-09-30 23:43:19','2026-09-30 23:43:19'),(10,5,'products/GrXL25X9dFZ1J3viD4LO0MEUZHKfe8IPuoqr6Lqc.png',1,'2026-10-01 21:23:22','2026-10-01 21:23:22'),(11,5,'products/mj225VlfjveER8m8GYnsqSHysLmLDNRI1Y1axpsg.png',0,'2026-10-01 21:23:22','2026-10-01 21:23:22'),(12,5,'products/BscD4ZaqPPCZxklMu55isET4Vqz5OYPPioaoyjiL.png',0,'2026-10-01 21:23:22','2026-10-01 21:23:22'),(13,5,'products/CXq3hVj0RdOakiOAx00xuYsSGUt6gG7l2qK26gMr.png',0,'2026-10-01 21:23:22','2026-10-01 21:23:22'),(14,6,'products/KX6wVXdAJeL1YYrlZl9DyUprLYz6ANvbbko611JB.png',1,'2026-10-02 00:05:10','2026-10-02 00:05:10'),(15,6,'products/ChI2N0XT41bLEVCx1eSEh92QzvOG8nANaxFRlnlf.png',0,'2026-10-02 00:05:10','2026-10-02 00:05:10'),(16,6,'products/AQMKExGRNgIzgD7U7cV3oRKY2iT51OUxxKDExksv.png',0,'2026-10-02 00:05:10','2026-10-02 00:05:10'),(17,6,'products/hvU6PKTGw6pyotWmEdl43TWKtUeEWfehk7cWwIBP.png',0,'2026-10-02 00:05:10','2026-10-02 00:05:10'),(18,7,'products/e1K2cEHJYSMeSImJQoPeBWfNxn9bKnrmbKMukEci.jpg',1,'2026-10-02 00:06:24','2026-10-02 00:06:24'),(19,7,'products/Ge1WvqhXn3jsfcTboU95m0tPRucip0LKIgDzFYBG.jpg',0,'2026-10-02 00:06:25','2026-10-02 00:06:25'),(20,7,'products/aoDEZXO1BqETwTSuM4XL9lrpjMuJRunUci5VV7Uf.jpg',0,'2026-10-02 00:06:25','2026-10-02 00:06:25'),(21,7,'products/mdBVdRRW2LrjgUQg27WkyKgf5AfsIcPD277X2HsN.jpg',0,'2026-10-02 00:06:25','2026-10-02 00:06:25');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_votes`
--

DROP TABLE IF EXISTS `product_votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_votes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `content_manager_id` bigint unsigned NOT NULL,
  `score` tinyint unsigned NOT NULL,
  `design_score` tinyint unsigned DEFAULT NULL,
  `usability_score` tinyint unsigned DEFAULT NULL,
  `creativity_score` tinyint unsigned DEFAULT NULL,
  `content_score` tinyint unsigned DEFAULT NULL,
  `overall_score` decimal(5,2) DEFAULT NULL,
  `feedback` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_votes_product_id_content_manager_id_unique` (`product_id`,`content_manager_id`),
  KEY `product_votes_content_manager_id_foreign` (`content_manager_id`),
  KEY `product_votes_score_index` (`score`),
  CONSTRAINT `product_votes_content_manager_id_foreign` FOREIGN KEY (`content_manager_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_votes_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_votes`
--

LOCK TABLES `product_votes` WRITE;
/*!40000 ALTER TABLE `product_votes` DISABLE KEYS */;
INSERT INTO `product_votes` VALUES (2,3,6,80,NULL,NULL,NULL,NULL,NULL,NULL,'2026-09-29 20:34:22','2026-09-29 20:34:22'),(3,3,7,76,NULL,NULL,NULL,NULL,NULL,NULL,'2026-09-29 20:57:19','2026-09-29 20:57:19'),(4,4,6,5,NULL,NULL,NULL,NULL,NULL,'asczasc','2026-10-01 00:18:30','2026-10-01 00:18:30'),(5,5,6,91,91,90,85,98,91.00,'keren','2026-10-01 21:24:41','2026-10-01 21:24:41'),(6,5,7,91,94,91,81,96,90.50,'keren\n','2026-10-01 21:41:22','2026-10-01 21:41:22');
/*!40000 ALTER TABLE `product_votes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_fund` decimal(15,2) NOT NULL DEFAULT '0.00',
  `initial_fund` decimal(15,2) NOT NULL DEFAULT '0.00',
  `investment_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `launch_date` date DEFAULT NULL,
  `approval_status` enum('pending_review','needs_revision','rejected','published') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending_review',
  `launch_status` enum('belum_launch','launch') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'belum_launch',
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `products_new_user_id_foreign` (`user_id`),
  KEY `products_new_category_id_foreign` (`category_id`),
  CONSTRAINT `products_new_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `products_new_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (3,4,2,'kue pukis','adsaws',50000000.00,0.00,999999979.00,'2026-12-04','published','belum_launch',NULL,'2026-09-29 20:31:51','2026-09-29 20:33:47'),(4,4,1,'suki','aj,qwas',14999956.00,10000000.00,10000000.00,'2026-10-09','published','belum_launch',NULL,'2026-09-30 23:43:17','2026-10-01 00:19:07'),(5,4,2,'suki','sqaws',14999956.00,10000000.00,10000000.00,'2026-10-09','published','belum_launch',NULL,'2026-10-01 21:23:20','2026-10-01 21:23:55'),(6,4,2,'suki','ajsam,',14999956.00,10000000.00,10000000.00,'2026-10-09','pending_review','belum_launch',NULL,'2026-10-02 00:05:05','2026-10-02 00:05:05'),(7,4,2,'sukikerre','kerennnnnnnnnnnnnn',14999956.00,10000000.00,10000000.00,'2026-10-09','published','belum_launch',NULL,'2026-10-02 00:06:23','2026-10-02 00:09:10');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('RXYzY6C8mj2shBqcqF8tylt8UBNzmugPwBmuabGq',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJZMGZiaFNZaXVydExZd0tDOFRVNnhtbzFra0RnRFRBOHJHRlVCRFMzIiwidXJsIjp7ImludGVuZGVkIjoiaHR0cDpcL1wvMTI3LjAuMC4xOjgwMDBcL2FkbWluIn0sIl9wcmV2aW91cyI6eyJ1cmwiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvYWRtaW5cL2xvZ2luIiwicm91dGUiOiJmaWxhbWVudC5hZG1pbi5hdXRoLmxvZ2luIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1791516461),('uBzydTff3w9yFboZYkgfHxVZi7hYnSAi2fcyAXw1',5,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36 Edg/154.0.0.0','eyJfdG9rZW4iOiJlenVPNXhwUURJUWh1ZnVHeW9IWnQwSENTVXJWanJiWXhORGM1VGY2IiwidXJsIjpbXSwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9hZG1pblwvdXNlcnNcLzciLCJyb3V0ZSI6ImZpbGFtZW50LmFkbWluLnJlc291cmNlcy51c2Vycy52aWV3In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfSwibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiOjUsInBhc3N3b3JkX2hhc2hfd2ViIjoiYTVhYTJhYjE2MjUwMjY3MTI3OWRhNzRmNDY0MDAxMzliZmQ3NzdhMmQ0NmE2YjljMmY1YjY1ZDk5OTAzMWQ4NiIsInRhYmxlcyI6eyI3ZWI4M2QxMmQ1NGU5MzNjODY3YjdlMGRiOTMzNzk3OF9jb2x1bW5zIjpbeyJ0eXBlIjoiY29sdW1uIiwibmFtZSI6Im5hbWUiLCJsYWJlbCI6Ik5hbWEiLCJpc0hpZGRlbiI6ZmFsc2UsImlzVG9nZ2xlZCI6dHJ1ZSwiaXNUb2dnbGVhYmxlIjpmYWxzZSwiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjpudWxsfSx7InR5cGUiOiJjb2x1bW4iLCJuYW1lIjoiZW1haWwiLCJsYWJlbCI6IkVtYWlsIiwiaXNIaWRkZW4iOmZhbHNlLCJpc1RvZ2dsZWQiOnRydWUsImlzVG9nZ2xlYWJsZSI6ZmFsc2UsImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI6bnVsbH0seyJ0eXBlIjoiY29sdW1uIiwibmFtZSI6InJvbGUiLCJsYWJlbCI6IlJvbGUiLCJpc0hpZGRlbiI6ZmFsc2UsImlzVG9nZ2xlZCI6dHJ1ZSwiaXNUb2dnbGVhYmxlIjpmYWxzZSwiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjpudWxsfSx7InR5cGUiOiJjb2x1bW4iLCJuYW1lIjoiZW1haWxfdmVyaWZpZWRfYXQiLCJsYWJlbCI6IkVtYWlsIFZlcmlmaWVkIiwiaXNIaWRkZW4iOmZhbHNlLCJpc1RvZ2dsZWQiOnRydWUsImlzVG9nZ2xlYWJsZSI6ZmFsc2UsImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI6bnVsbH0seyJ0eXBlIjoiY29sdW1uIiwibmFtZSI6ImNyZWF0ZWRfYXQiLCJsYWJlbCI6IkRpYnVhdCIsImlzSGlkZGVuIjpmYWxzZSwiaXNUb2dnbGVkIjp0cnVlLCJpc1RvZ2dsZWFibGUiOmZhbHNlLCJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiOm51bGx9XX19',1791516611);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plain_password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','content_manager','mahasiswa') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'mahasiswa',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'Mahasiswa1','mahasiswa@test.com',NULL,'$2y$12$R8MW11lskwCdNNxytlXV0.B0txYuyu2xt35lWLMf.cAYtxm3mErxO',NULL,'mahasiswa',NULL,'2026-09-23 20:14:11','2026-09-29 20:55:59'),(4,'al','al@gmail.com',NULL,'$2y$12$mv5uTOtT95Hot2xXuzNymuJFhPa2yNeykIzX2OnKlMCsB8Ae04/Ya',NULL,'mahasiswa',NULL,'2026-09-24 01:03:47','2026-09-24 01:03:47'),(5,'Admin PIPB','admin@pipb.com',NULL,'$2y$12$gNyIDedEr5hccRMZkSfHVO6Kftxwxcg2D/zpSF/.PkuKy2wbgKtDq',NULL,'admin',NULL,'2026-09-27 20:16:35','2026-09-27 20:16:35'),(6,'Dosen PIPB','dosen@pipb.com',NULL,'$2y$12$OBDrdGM2levQmgcl8E1lHOUBZ9ilIeJOEVoWpdccW6sDB8ASXZake',NULL,'content_manager',NULL,'2026-09-28 18:47:13','2026-09-28 18:47:13'),(7,'dosen 2','dosen2@gmail.com',NULL,'$2y$12$ewtO0cVsFjhjTluBLEmVBuBe8t8yk1wqIS95xvaZNZK/XnvMx2p66',NULL,'content_manager',NULL,'2026-09-29 20:56:46','2026-10-01 21:40:33');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-09 10:33:22