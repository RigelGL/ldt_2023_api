-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ldt_2023
-- ------------------------------------------------------
-- Server version	8.0.19

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

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'ba468b5e-a95c-11ea-9094-0a0027000013:1-159162,
e235f4a1-a95c-11ea-9dcd-0a0027000013:1-77';

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `main_category_id` bigint NOT NULL,
  `age_min` tinyint unsigned NOT NULL DEFAULT '0',
  `age_max` tinyint unsigned NOT NULL DEFAULT '100',
  `difficulty_id` int NOT NULL,
  `duration` int unsigned NOT NULL,
  `type` enum('online','offline','combined') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `course_course_main_category_id_fk` (`main_category_id`),
  KEY `course_course_difficulty_id_fk` (`difficulty_id`),
  CONSTRAINT `course_course_difficulty_id_fk` FOREIGN KEY (`difficulty_id`) REFERENCES `course_difficulty` (`id`),
  CONSTRAINT `course_course_main_category_id_fk` FOREIGN KEY (`main_category_id`) REFERENCES `course_main_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (2,'Рисование','Навыки рисования карандашом на А4 позволят вам не заскучать на нудных уроках в школе, а затем и в вузе на томных лекциях.',3,10,15,1,30,'offline'),(3,'Рисование','Рисование в Paint для тех кто не знает как включать компьютер',3,60,100,4,7,'offline');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_difficulty`
--

DROP TABLE IF EXISTS `course_difficulty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_difficulty` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `value` float NOT NULL,
  `color` int unsigned NOT NULL DEFAULT '16777215',
  `text_color` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_difficulty`
--

LOCK TABLES `course_difficulty` WRITE;
/*!40000 ALTER TABLE `course_difficulty` DISABLE KEYS */;
INSERT INTO `course_difficulty` VALUES (1,'Лёгко',0.3,16777215,0),(2,'Средне',0.5,16777215,0),(3,'Сложно',0.8,16777215,0),(4,'Элементарно',0.1,16777215,0),(5,'Грызть гранит науки',1,16777215,0);
/*!40000 ALTER TABLE `course_difficulty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_main_category`
--

DROP TABLE IF EXISTS `course_main_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_main_category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `color` int unsigned NOT NULL DEFAULT '16777215',
  `text_color` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_main_category`
--

LOCK TABLES `course_main_category` WRITE;
/*!40000 ALTER TABLE `course_main_category` DISABLE KEYS */;
INSERT INTO `course_main_category` VALUES (1,'Музыка','Текст про музыку',16777215,0),(2,'Хореография','Текст про танцы',16777215,0),(3,'Живопись','Текст про живопись',16777215,0),(4,'Театр','Текст про театр',16777215,0);
/*!40000 ALTER TABLE `course_main_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_tag`
--

DROP TABLE IF EXISTS `course_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_tag` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `main_category_id` bigint DEFAULT NULL,
  `color` int unsigned NOT NULL DEFAULT '16777215',
  `text_color` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `course_tag_course_main_category_id_fk` (`main_category_id`),
  CONSTRAINT `course_tag_course_main_category_id_fk` FOREIGN KEY (`main_category_id`) REFERENCES `course_main_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_tag`
--

LOCK TABLES `course_tag` WRITE;
/*!40000 ALTER TABLE `course_tag` DISABLE KEYS */;
INSERT INTO `course_tag` VALUES (1,'Скрипка',NULL,1,16777215,0),(2,'Фортепиано',NULL,1,16777215,0),(3,'Балет',NULL,2,16777215,0),(4,'Бальные танцы',NULL,2,16777215,0),(5,'Классическая',NULL,3,16777215,0),(6,'Абстрактная',NULL,3,16777215,0),(7,'Графика',NULL,3,16777215,0),(8,'Трагедия',NULL,4,16777215,0),(9,'Комедия',NULL,4,16777215,0),(10,'Скульптура',NULL,NULL,16777215,0),(11,'На А4',NULL,3,16777215,0),(12,'Digital Art',NULL,3,16777215,0);
/*!40000 ALTER TABLE `course_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `category` enum('common','grant','ad') NOT NULL,
  `author_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `news_user_id_fk` (`author_id`),
  CONSTRAINT `news_user_id_fk` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_token`
--

DROP TABLE IF EXISTS `refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_token` (
  `user_id` bigint NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `token` varchar(60) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  KEY `refresh_token_user_id_fk` (`user_id`),
  CONSTRAINT `refresh_token_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_token`
--

LOCK TABLES `refresh_token` WRITE;
/*!40000 ALTER TABLE `refresh_token` DISABLE KEYS */;
INSERT INTO `refresh_token` VALUES (1,'2023-05-21 19:25:57','JtP7IUhU7o0YQf9cE6_XWjocycndz8SEkU91O9LNiDbWnIJHhcNYhsXph_8e');
/*!40000 ALTER TABLE `refresh_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag_to_course`
--

DROP TABLE IF EXISTS `tag_to_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tag_to_course` (
  `course_id` bigint NOT NULL,
  `tag_id` bigint NOT NULL,
  PRIMARY KEY (`course_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_to_course`
--

LOCK TABLES `tag_to_course` WRITE;
/*!40000 ALTER TABLE `tag_to_course` DISABLE KEYS */;
INSERT INTO `tag_to_course` VALUES (1,7),(1,11),(2,12);
/*!40000 ALTER TABLE `tag_to_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  `telegram_id` bigint DEFAULT NULL,
  `telegram_chat_id` bigint DEFAULT NULL,
  `telegram_username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `vk_id` bigint DEFAULT NULL,
  `invite_link` varchar(30) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `attraction` varchar(32) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_pk` (`invite_link`),
  UNIQUE KEY `user_email_uindex` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'User Test','user@test.test','$2b$08$apFLCvdyEKa6zCLrDTToCeUMb3tILPyRFLh./TDsjutTZSF3wEM06',NULL,NULL,NULL,NULL,'pl7rXlhU9pi0erk_8DES-wIwTXGy6n',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_fcm`
--

DROP TABLE IF EXISTS `user_fcm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_fcm` (
  `user_id` bigint NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `token` varchar(255) NOT NULL,
  KEY `user_fcm_user_id_fk` (`user_id`),
  CONSTRAINT `user_fcm_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_fcm`
--

LOCK TABLES `user_fcm` WRITE;
/*!40000 ALTER TABLE `user_fcm` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_fcm` ENABLE KEYS */;
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

-- Dump completed on 2023-05-22  9:33:59
