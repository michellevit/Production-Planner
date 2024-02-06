-- MySQL dump 10.13  Distrib 8.2.0, for Linux (x86_64)
--
-- Host: localhost    Database: Production_Planner_DB
-- ------------------------------------------------------
-- Server version	8.2.0

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
-- Table structure for table `api_dimension`
--

DROP TABLE IF EXISTS `api_dimension`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_dimension` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `package_size` varchar(50) NOT NULL,
  `height` double NOT NULL,
  `length` double NOT NULL,
  `width` double NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_dimension_length_width_height_package_size_d4eb52e5_uniq` (`length`,`width`,`height`,`package_size`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_dimension`
--

LOCK TABLES `api_dimension` WRITE;
/*!40000 ALTER TABLE `api_dimension` DISABLE KEYS */;
INSERT INTO `api_dimension` VALUES (1,'8\" x 6\" x 4\"',4,8,6),(2,'9\" x 7\" x 1\"',1,9,7),(3,'10\" x 8\" x 3\"',3,10,8),(4,'10\" x 8\" x 4\"',4,10,8),(5,'12\" x 8\" x 3\"',3,12,8),(6,'12\" x 9\" x 6\"',6,12,9),(7,'12\" x 9\" x 9\"',9,12,9),(8,'12.25\" x 9.25\" x 12\"',12,12.25,9.25),(9,'13\" x 10\" x 3\"',3,13,10),(10,'13\" x 10\" x 8\"',8,13,10),(11,'16\" x 10\" x 8\"',8,16,10),(12,'16\" x 10\" x 12\"',12,16,10),(13,'16\" x 12\" x 12\"',12,16,12),(14,'18\" x 14\" x 8\"',8,18,14),(15,'20\" x 12\" x 12\"',12,20,12),(16,'20\" x 16\" x 12\"',12,20,16),(17,'21.5\" x 13.25\" x 9.125\"',9.125,21.5,13.25),(18,'26\" x 20\" x 12\"',12,26,20);
/*!40000 ALTER TABLE `api_dimension` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_lastupdate`
--

DROP TABLE IF EXISTS `api_lastupdate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_lastupdate` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_updated` datetime(6) NOT NULL,
  `last_active` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_lastupdate`
--

LOCK TABLES `api_lastupdate` WRITE;
/*!40000 ALTER TABLE `api_lastupdate` DISABLE KEYS */;
INSERT INTO `api_lastupdate` VALUES (1,'2024-01-26 21:26:00.144825','2024-01-26 21:39:20.512312');
/*!40000 ALTER TABLE `api_lastupdate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_order`
--

DROP TABLE IF EXISTS `api_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created` datetime(6) NOT NULL,
  `updated` datetime(6) NOT NULL,
  `order_number` varchar(100) NOT NULL,
  `ship_date` date DEFAULT NULL,
  `customer_name` varchar(100) NOT NULL,
  `ready` tinyint(1) NOT NULL,
  `shipped` tinyint(1) NOT NULL,
  `backorder_number` int NOT NULL,
  `packages_array` json DEFAULT NULL,
  `notes_array` json DEFAULT NULL,
  `delay_date` date DEFAULT NULL,
  `quote` tinyint(1) NOT NULL,
  `delay_tbd` tinyint(1) DEFAULT NULL,
  `item_array_hash` varchar(32) DEFAULT NULL,
  `confirmed` tinyint(1) NOT NULL,
  `item_array` json NOT NULL DEFAULT (_utf8mb3'[]'),
  PRIMARY KEY (`id`),
  KEY `api_order_shipped_6a104841` (`shipped`),
  KEY `api_order_item_type_dict_hash_0aa77f91` (`item_array_hash`),
  KEY `api_order_order_number_10840d1e` (`order_number`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_order`
--

LOCK TABLES `api_order` WRITE;
/*!40000 ALTER TABLE `api_order` DISABLE KEYS */;
INSERT INTO `api_order` VALUES (67,'2024-01-23 19:34:24.139037','2024-01-23 20:07:39.348081','30128','2023-12-15','C & K Enterprize LLC',0,0,0,'[]','[{\"id\": 1706040458852, \"noteText\": \"waiting for new software\"}]',NULL,0,0,'c31fc9c905b95f1e7539ed315da4b7b0',0,'[{\"name\": \"GTC505m\", \"subname\": \"GTC505m\", \"ship_qty\": 1, \"description\": \"Engine Ignition Analyzer + Spark Plug Wire Sensor Clip and Cable\", \"backorder_qty\": 0, \"requested_qty\": 1, \"previously_invoiced_qty\": 0}]'),(68,'2024-01-23 19:34:24.148921','2024-01-23 19:34:24.148950','30160','2023-11-08','Matco',0,0,0,'[]','[]',NULL,0,0,'b12be0ad0ab509a8d345e7126daf28a0',0,'[{\"name\": \"Return\", \"subname\": \"Return\", \"ship_qty\": 1, \"description\": \"CM 600 AC/DC Clamp Meter\", \"backorder_qty\": 0, \"requested_qty\": 1, \"previously_invoiced_qty\": 0}]'),(69,'2024-01-23 19:34:24.161944','2024-01-23 19:34:24.161974','30170','2023-11-27','Igor Primisky',0,0,0,'[]','[]',NULL,0,0,'e0cb5a9e9e481f21132e16e4e22c27e0',0,'[{\"name\": \"TA303\", \"subname\": \"TA303\", \"ship_qty\": 10, \"description\": \"Universal Diesel & Gasoline Tachometer Kit\", \"backorder_qty\": 0, \"requested_qty\": 10, \"previously_invoiced_qty\": 10}, {\"name\": \"FF310\", \"subname\": \"FF310\", \"ship_qty\": 0, \"description\": \"FaultFinder™ Open and Short Circuit Finder and Tracer\\n\", \"backorder_qty\": 10, \"requested_qty\": 10, \"previously_invoiced_qty\": 0}, {\"name\": \"GTC505\", \"subname\": \"GTC505\", \"ship_qty\": 0, \"description\": \"Engine Ignition Analyzer\", \"backorder_qty\": 5, \"requested_qty\": 5, \"previously_invoiced_qty\": 0}]'),(70,'2024-01-23 19:34:24.171878','2024-01-23 19:34:24.171905','30231','2023-12-13','Aurora Supplies',0,0,0,'[]','[]',NULL,0,0,'306b7312c9be724084cd2ffb580fff12',0,'[{\"name\": \"GTC505\", \"subname\": \"GTC505\", \"ship_qty\": 80, \"description\": \"Engine Ignition Analyzer\", \"backorder_qty\": 0, \"requested_qty\": 80, \"previously_invoiced_qty\": 0}, {\"name\": \"PE350HR-RD\", \"subname\": \"PE350HR-RD\", \"ship_qty\": 0, \"description\": \"Holster for PE350 enclosure - Red\", \"backorder_qty\": 0, \"requested_qty\": 15, \"previously_invoiced_qty\": 0}]'),(71,'2024-01-23 19:34:24.185623','2024-01-23 19:34:24.185647','30244','2023-12-14','WAS',0,0,0,'[]','[]',NULL,0,0,'90617ea4b385c109380a2f6d49f991c3',0,'[{\"name\": \"TA303\", \"subname\": \"TA303J\", \"ship_qty\": 0, \"description\": \"WAS-Branded Universal Diesel & Gasoline Tachometer Kit - Ship 150 in January and 150 in March\", \"backorder_qty\": 0, \"requested_qty\": 300, \"previously_invoiced_qty\": 0}, {\"name\": \"GTC505\", \"subname\": \"GTC505J\", \"ship_qty\": 0, \"description\": \"WAS Japan-Branded Engine Ignition Analyzer\", \"backorder_qty\": 0, \"requested_qty\": 50, \"previously_invoiced_qty\": 0}, {\"name\": \"FF310\", \"subname\": \"FF310J\", \"ship_qty\": 0, \"description\": \"WAS Electrical Fault Finder\", \"backorder_qty\": 0, \"requested_qty\": 50, \"previously_invoiced_qty\": 0}, {\"name\": \"CM100\", \"subname\": \"CM100\", \"ship_qty\": 0, \"description\": \"100A AC/DC Clamp Meter\", \"backorder_qty\": 0, \"requested_qty\": 10, \"previously_invoiced_qty\": 0}, {\"name\": \"CT8002\", \"subname\": \"CT8002\", \"ship_qty\": 0, \"description\": \"Cordless Circuit Tester - Chrome\", \"backorder_qty\": 0, \"requested_qty\": 100, \"previously_invoiced_qty\": 0}]'),(72,'2024-01-23 19:34:24.194538','2024-01-23 19:34:24.194563','30252','2024-01-02','M/s LG Sports Private Limited',0,0,0,'[]','[]',NULL,0,0,'a2a9f46eafc1ee7a338617fc307076c1',0,'[{\"name\": \"TA500\", \"subname\": \"TA500\", \"ship_qty\": 0, \"description\": \"Smartach+COP Multisystem Ignition Analyzer\", \"backorder_qty\": 0, \"requested_qty\": 1, \"previously_invoiced_qty\": 0}]'),(73,'2024-01-23 19:34:24.202491','2024-01-23 19:34:24.202517','30253','2024-01-02','Amco Auto Parts',0,0,0,'[]','[]',NULL,0,0,'d1f4036f8dc2ef3f7190b17d00a5f372',0,'[{\"name\": \"GTC505\", \"subname\": \"GTC505\", \"ship_qty\": 75, \"description\": \"Engine Ignition Analyzer\", \"backorder_qty\": 0, \"requested_qty\": 75, \"previously_invoiced_qty\": 0}, {\"name\": \"CM100\", \"subname\": \"CM100\", \"ship_qty\": 75, \"description\": \"100A AC/DC Clamp Meter\", \"backorder_qty\": 0, \"requested_qty\": 75, \"previously_invoiced_qty\": 0}, {\"name\": \"FF310\", \"subname\": \"FF310\", \"ship_qty\": 75, \"description\": \"FaultFinder™ Open and Short Circuit Finder and Tracer\\n\", \"backorder_qty\": 0, \"requested_qty\": 75, \"previously_invoiced_qty\": 0}, {\"name\": \"TA100\", \"subname\": \"TA100\", \"ship_qty\": 75, \"description\": \"TA100 SmarTach+ Wireless Ignition Analyzer and Tachometer\", \"backorder_qty\": 0, \"requested_qty\": 75, \"previously_invoiced_qty\": 0}]'),(74,'2024-01-23 19:34:24.216006','2024-01-30 03:21:37.954169','30257','2024-02-05','Matco',0,0,0,'[]','[]',NULL,0,0,'9f7786530a7c28efa6bb40db476e3ae7',1,'[{\"name\": \"FF310\", \"subname\": \"FF310-MAT\", \"ship_qty\": 12, \"description\": \"Matco-Branded Short/Open Circuit Tester\", \"backorder_qty\": 0, \"requested_qty\": 12, \"previously_invoiced_qty\": 0}]'),(75,'2024-01-23 19:34:24.223926','2024-01-24 20:40:56.924783','30258','2024-01-25','Matco',0,0,0,'[]','[]',NULL,0,0,'993b8630427097b6bae6654e53d01b08',0,'[{\"name\": \"FF310\", \"subname\": \"FF310-MAT\", \"ship_qty\": 84, \"description\": \"Matco-Branded Short/Open Circuit Tester\", \"backorder_qty\": 0, \"requested_qty\": 84, \"previously_invoiced_qty\": 0}]'),(76,'2024-01-23 19:34:24.232741','2024-01-23 19:34:24.232767','30259','2024-02-05','Matco',0,0,0,'[]','[]',NULL,0,0,'546c603c566a3c679a3dc212022bf7be',0,'[{\"name\": \"FF310\", \"subname\": \"FF310-MAT\", \"ship_qty\": 60, \"description\": \"Matco-Branded Short/Open Circuit Tester\", \"backorder_qty\": 0, \"requested_qty\": 60, \"previously_invoiced_qty\": 0}]'),(77,'2024-01-23 19:34:24.241684','2024-01-23 19:34:24.241711','30289','2024-01-12','Busco',0,0,0,'[]','[]',NULL,0,0,'9cd1e0eab08ea10658c92643b942af22',0,'[{\"name\": \"FF310\", \"subname\": \"FF310\", \"ship_qty\": 2, \"description\": \"FaultFinder™ Open and Short Circuit Finder and Tracer\\n\", \"backorder_qty\": 0, \"requested_qty\": 2, \"previously_invoiced_qty\": 2}, {\"name\": \"GTC505\", \"subname\": \"GTC505\", \"ship_qty\": 0, \"description\": \"Engine Ignition Analyzer\", \"backorder_qty\": 10, \"requested_qty\": 10, \"previously_invoiced_qty\": 0}, {\"name\": \"GTC605\", \"subname\": \"GTC605\", \"ship_qty\": 4, \"description\": \"Fuel Injection Analyzer\", \"backorder_qty\": 0, \"requested_qty\": 4, \"previously_invoiced_qty\": 4}]'),(78,'2024-01-23 19:34:24.251048','2024-01-26 21:26:00.062296','30296','2024-01-29','Darryn Britton',0,0,0,'[]','[]',NULL,0,0,'c31fc9c905b95f1e7539ed315da4b7b0',0,'[{\"name\": \"GTC505m\", \"subname\": \"GTC505m\", \"ship_qty\": 1, \"description\": \"Engine Ignition Analyzer + Spark Plug Wire Sensor Clip and Cable\", \"backorder_qty\": 0, \"requested_qty\": 1, \"previously_invoiced_qty\": 0}]'),(79,'2024-01-23 19:34:24.261869','2024-01-26 21:26:00.076517','30299','2024-01-29','G2S TOBEQ',0,0,0,'[]','[]',NULL,0,0,'50afc5ada979b6aff2a98c4245678c74',0,'[{\"name\": \"GTC505m\", \"subname\": \"GTC505m\", \"ship_qty\": 6, \"description\": \"Engine Ignition Analyzer + Spark Plug Wire Sensor Clip and Cable\", \"backorder_qty\": 0, \"requested_qty\": 6, \"previously_invoiced_qty\": 0}]'),(80,'2024-01-23 19:34:24.272397','2024-01-23 19:34:24.272423','30300','2024-01-19','Igor Primisky',0,0,0,'[]','[]',NULL,0,0,'740505fb93375c199fdf9c7423f12b0c',0,'[{\"name\": \"FF310\", \"subname\": \"FF310\", \"ship_qty\": 10, \"description\": \"FaultFinder™ Open and Short Circuit Finder and Tracer\\n\", \"backorder_qty\": 0, \"requested_qty\": 10, \"previously_invoiced_qty\": 0}]'),(81,'2024-01-23 19:34:24.279547','2024-01-24 21:31:16.774275','30309','2024-02-05','Gold Engineering',0,0,0,'[]','[]',NULL,0,0,'25975c486a06468841c7050e5c7a5fa4',0,'[{\"name\": \"TA100\", \"subname\": \"TA100\", \"ship_qty\": 28, \"description\": \"TA100 SmarTach+ Wireless Ignition Analyzer and Tachometer\", \"backorder_qty\": 0, \"requested_qty\": 28, \"previously_invoiced_qty\": 0}, {\"name\": \"TA303\", \"subname\": \"TA303\", \"ship_qty\": 18, \"description\": \"Universal Diesel & Gasoline Tachometer Kit\", \"backorder_qty\": 0, \"requested_qty\": 18, \"previously_invoiced_qty\": 0}]'),(82,'2024-01-23 19:34:24.286995','2024-01-23 19:34:24.287023','30310','2024-01-25','UAP',0,0,0,'[]','[]',NULL,0,0,'13e9113094bc6dcd4264de85df942b8c',0,'[{\"name\": \"TA110\", \"subname\": \"95133\", \"ship_qty\": 24, \"description\": \"UAP Laser Tachometer\", \"backorder_qty\": 0, \"requested_qty\": 24, \"previously_invoiced_qty\": 0}]'),(83,'2024-01-23 19:34:24.305393','2024-01-25 19:17:20.430017','30311','2024-01-22','Henry Hancock',0,0,0,'[]','[]',NULL,0,0,'3ea6a8c7c0dd84ab1843986a77445599',0,'[{\"name\": \"CT17F04A\", \"subname\": \"CT17F04A\", \"ship_qty\": 0, \"description\": \"0.4A/250V Fuse for CT8017\", \"backorder_qty\": 0, \"requested_qty\": 5, \"previously_invoiced_qty\": 0}, {\"name\": \"CT8012TP\", \"subname\": \"CT8012TP\", \"ship_qty\": 0, \"description\": \"CT8012/22 Probe Tip\", \"backorder_qty\": 0, \"requested_qty\": 5, \"previously_invoiced_qty\": 0}, {\"name\": \"Discount\", \"subname\": \"Discount\", \"ship_qty\": 0, \"description\": null, \"backorder_qty\": 0, \"requested_qty\": 0, \"previously_invoiced_qty\": 0}]'),(84,'2024-01-23 19:34:24.324181','2024-01-26 21:26:00.090760','30312','2024-01-29','Anton Willis',0,0,0,'[]','[]',NULL,0,0,'c31fc9c905b95f1e7539ed315da4b7b0',0,'[{\"name\": \"GTC505m\", \"subname\": \"GTC505m\", \"ship_qty\": 1, \"description\": \"Engine Ignition Analyzer + Spark Plug Wire Sensor Clip and Cable\", \"backorder_qty\": 0, \"requested_qty\": 1, \"previously_invoiced_qty\": 0}]'),(85,'2024-01-23 19:34:24.332012','2024-01-25 19:16:12.156320','30317','2024-01-25','Matco',0,0,0,'[]','[]',NULL,0,0,'b12be0ad0ab509a8d345e7126daf28a0',0,'[{\"name\": \"Return\", \"subname\": \"Return\", \"ship_qty\": 1, \"description\": \" FF310  FaultFinder™ Open and Short Circuit Finder and Tracer\", \"backorder_qty\": 0, \"requested_qty\": 1, \"previously_invoiced_qty\": 0}]'),(86,'2024-01-23 19:34:24.340597','2024-01-24 20:40:56.980572','30318','2024-01-26','Matco',0,0,0,'[]','[]',NULL,0,0,'b12be0ad0ab509a8d345e7126daf28a0',0,'[{\"name\": \"Return\", \"subname\": \"Return\", \"ship_qty\": 1, \"description\": \"LT 102 Laser Guided in\", \"backorder_qty\": 0, \"requested_qty\": 1, \"previously_invoiced_qty\": 0}]'),(87,'2024-01-24 20:40:56.994813','2024-01-26 21:26:00.105126','30320','2024-01-30','Titan Security',0,0,0,'[]','[]',NULL,0,0,'29575535773ae1049ae3539ae8772520',0,'[{\"name\": \"GTC060LP\", \"subname\": \"GTC060LP\", \"ship_qty\": 200, \"description\": \"Low-Profile Mini Size Fuse Socket Connector (Bulk)\", \"backorder_qty\": 0, \"requested_qty\": 200, \"previously_invoiced_qty\": 0}, {\"name\": \"GTC060MN\", \"subname\": \"GTC060MN\", \"ship_qty\": 200, \"description\": \"Mini-ATO Size Fuse Socket Connector (Bulk)\", \"backorder_qty\": 0, \"requested_qty\": 200, \"previously_invoiced_qty\": 0}]'),(88,'2024-01-25 19:16:12.175809','2024-01-25 19:35:12.606211','30322','2024-01-25','Jesse Moore',0,0,0,'[]','[]',NULL,0,0,'cbf03e50dded021159e0b4b184487edc',0,'[{\"name\": \"GTC011\", \"subname\": \"GTC011\", \"ship_qty\": 1, \"description\": \"Spark Plug Wire Sensor (compatible with GTC505)\", \"backorder_qty\": 0, \"requested_qty\": 1, \"previously_invoiced_qty\": 0}, {\"name\": \"GTC014\", \"subname\": \"GTC014\", \"ship_qty\": 1, \"description\": \"Clip-On Spark Plug Sensor with 2m Cable in Clam-shell Packaging\", \"backorder_qty\": 0, \"requested_qty\": 1, \"previously_invoiced_qty\": 0}]'),(89,'2024-01-25 19:16:12.185677','2024-01-26 21:26:00.129718','30323','2024-01-25','Baumgartner',0,0,0,'[]','[]',NULL,0,0,'a55b4f8316a366451f50c93ef9bd19a4',0,'[{\"name\": \"FF310\", \"subname\": \"FF310\", \"ship_qty\": 5, \"description\": \"FaultFinder™ Open and Short Circuit Finder and Tracer\\n\", \"backorder_qty\": 0, \"requested_qty\": 5, \"previously_invoiced_qty\": 0}, {\"name\": \"RT6\", \"subname\": \"RT6\", \"ship_qty\": 20, \"description\": \"Reflective Tape for Optical Tachometers - 6 x 8\\\" Strips\", \"backorder_qty\": 0, \"requested_qty\": 20, \"previously_invoiced_qty\": 0}, {\"name\": \"TA110\", \"subname\": \"TA110-E/F\", \"ship_qty\": 15, \"description\": \"Optical Tachometer/Counter (English/French)\", \"backorder_qty\": 0, \"requested_qty\": 15, \"previously_invoiced_qty\": 0}, {\"name\": \"TA500\", \"subname\": \"TA500\", \"ship_qty\": 10, \"description\": \"Smartach+COP Multisystem Ignition Analyzer\", \"backorder_qty\": 0, \"requested_qty\": 10, \"previously_invoiced_qty\": 0}]');
/*!40000 ALTER TABLE `api_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_product`
--

DROP TABLE IF EXISTS `api_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `item_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_product_item_name_e286ec4f_uniq` (`item_name`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_product`
--

LOCK TABLES `api_product` WRITE;
/*!40000 ALTER TABLE `api_product` DISABLE KEYS */;
INSERT INTO `api_product` VALUES (1,'CM100 (100A AC/DC Clamp Meter)'),(2,'CM1000 (1000A AC/DC Clamp Meter)'),(3,'CM600 (600A AC/DC Clamp Meter)'),(4,'CT6100 (Fuse Socket Connector Set)'),(5,'CT8002 (Cordless Circuit Tester - Chrome)'),(6,'CT8007 (Cordless Circuit Tester - Plastic)'),(7,'CT8012 (Ergonomic DMM Multimeter)'),(8,'CT8015 (DMM Manual Range)'),(9,'CT8017 (Auto-Ranging Digital Multimeter)'),(10,'CT8022 (Ergonomic Auto Range DMM)'),(11,'CT8027 (Professional Automotive Digital Multimeter)'),(12,'FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)'),(13,'GTC010 (Flexible probe with BNC and DC connector and O-Ring)'),(14,'GTC011 (Spark Plug Wire Sensor (compatible with GTC505))'),(16,'GTC012 (Coil-On-Plug Sensor (compatible with GTC505-3.02))'),(15,'GTC012 (Coil-On-Plug Sensor (compatible with GTC505))'),(17,'GTC013 (Clip-On SPW Sensor (compatible with GTC505))'),(18,'GTC014 (Clip-On Spark Plug Sensor with 2m Cable in Clamshell Packaging)'),(19,'GTC014-PB (Clip-On Spark Plug Sensor with 2m Cable in Ziplock Bag)'),(20,'GTC015 (Current, Voltage and Mechanical sensor for GTC605)'),(21,'GTC016 (Inductive Primary Ignition/Fuel Injector Sensor w/BNC Connector)'),(22,'GTC021 (2m cable with BNC and DC connectors and O-Ring)'),(23,'GTC060AT (ATO/ATC Size Fuse Socket Connector (Bulk))'),(24,'GTC060AT-3PACK (3 x ATO/ATC-Size Fuse Socket Connectors)'),(25,'GTC060LP (Low-Profile Mini Size Fuse Socket Connector (Bulk))'),(26,'GTC060LP-3PACK (3 x Low-Profile Mini Fuse Socket Connectors)'),(27,'GTC060MN (Mini-ATO Size Fuse Socket Connector (Bulk))'),(28,'GTC060MN-3PACK (3 x Mini-Size Fuse Socket Connectors)'),(29,'GTC060MX (MAXI Size Fuse Socket Connector (Bulk))'),(30,'GTC060MX-3PACK (3 x Maxi-Size Fuse Socket Connectors)'),(31,'GTC060U2 (Micro-2 Size Fuse Socket Connector (Bulk))'),(32,'GTC060U2-3PACK (3 x Micro-2 Size Fuse Socket Connectors)'),(33,'GTC060U3 (Micro-3 Size Fuse Socket Connector (Bulk))'),(34,'GTC060U3-3PACK (3 x Micro-3 Size Fuse Socket Connectors)'),(35,'GTC062 (Fuse Socket Connector Set)'),(36,'GTC063 (Fuse Socket Connector Set)'),(37,'GTC107C (Smartach+ Digital transducer - CAN and Pulse Output))'),(38,'GTC505 (Engine Ignition Analyzer)'),(39,'GTC505m (Engine Ignition Analyzer + Spark Plug Wire Sensor Clip and Cable)'),(40,'GTC605 (Fuel Injection Analyzer)'),(41,'LTX10 (Infrared Thermometer with Laser Sight)'),(42,'LTX12 (Infrared Thermometer -20 to 1200 F with ThermoSounder)'),(43,'RT6 (Reflective Tape for Optical Tachometers - 6 x 8\" Strips)'),(44,'ST05 (Oxygen Sensor Tester/Simulator)'),(45,'TA100 (TA100 SmarTach+ Wireless Ignition Analyzer and Tachometer)'),(46,'TA110 (Optical Tachometer)'),(47,'TA300 (SmarTach D: Diesel Engine Tachometer Kit)'),(48,'TA303 (Universal Diesel & Gasoline Tachometer Kit)'),(49,'TA500 (Smartach+COP Multisystem Ignition Analyzer)');
/*!40000 ALTER TABLE `api_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add order',7,'add_order'),(26,'Can change order',7,'change_order'),(27,'Can delete order',7,'delete_order'),(28,'Can view order',7,'view_order'),(29,'Can add order report',8,'add_orderreport'),(30,'Can change order report',8,'change_orderreport'),(31,'Can delete order report',8,'delete_orderreport'),(32,'Can view order report',8,'view_orderreport'),(33,'Can add dimension',9,'add_dimension'),(34,'Can change dimension',9,'change_dimension'),(35,'Can delete dimension',9,'delete_dimension'),(36,'Can view dimension',9,'view_dimension'),(37,'Can add product',10,'add_product'),(38,'Can change product',10,'change_product'),(39,'Can delete product',10,'delete_product'),(40,'Can view product',10,'view_product'),(41,'Can add last update',11,'add_lastupdate'),(42,'Can change last update',11,'change_lastupdate'),(43,'Can delete last update',11,'delete_lastupdate'),(44,'Can view last update',11,'view_lastupdate');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$720000$ELcQj4cCwolnbA3YVlUbk5$qiU65PpWzjqRAaD7S60zPgVzdA0+L/0fPUw6mHSKmF4=','2024-01-17 21:12:18.770986',1,'db_user','','','db_user@super.com',1,1,'2024-01-12 03:32:56.185855');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2024-01-12 03:33:42.610054','1','2024-01-14 19:11:04-08:00',2,'[{\"changed\": {\"fields\": [\"Last updated\"]}}]',11,1),(2,'2024-01-12 03:34:12.864023','1','2024-01-15 19:11:04-08:00',2,'[{\"changed\": {\"fields\": [\"Last updated\"]}}]',11,1),(3,'2024-01-12 03:34:32.260035','1','2024-01-16 19:11:04-08:00',2,'[{\"changed\": {\"fields\": [\"Last updated\"]}}]',11,1),(4,'2024-01-12 03:35:00.352565','1','2024-01-17 19:11:04-08:00',2,'[{\"changed\": {\"fields\": [\"Last updated\"]}}]',11,1),(5,'2024-01-12 03:35:20.513322','1','2024-01-18 19:11:04-08:00',2,'[{\"changed\": {\"fields\": [\"Last updated\"]}}]',11,1),(6,'2024-01-12 03:35:33.272708','1','2024-01-19 19:11:04-08:00',2,'[{\"changed\": {\"fields\": [\"Last updated\"]}}]',11,1),(7,'2024-01-12 03:35:50.837310','1','2024-01-20 19:11:04-08:00',2,'[{\"changed\": {\"fields\": [\"Last updated\"]}}]',11,1),(8,'2024-01-12 06:14:37.817912','2','30160',2,'[{\"changed\": {\"fields\": [\"Ship date\", \"Item array\", \"Shipped\"]}}]',7,1),(9,'2024-01-12 06:14:57.773969','3','30170',2,'[{\"changed\": {\"fields\": [\"Item array\", \"Shipped\"]}}]',7,1),(10,'2024-01-12 06:15:15.771308','3','30170',2,'[{\"changed\": {\"fields\": [\"Item array hash\"]}}]',7,1),(11,'2024-01-12 06:15:29.433292','3','30170',3,'',7,1),(12,'2024-01-15 01:33:32.940242','14','30289',3,'',7,1),(13,'2024-01-15 01:33:32.949301','13','30288',3,'',7,1),(14,'2024-01-15 01:33:32.957874','12','30280',3,'',7,1),(15,'2024-01-15 01:33:32.966560','11','30259',3,'',7,1),(16,'2024-01-15 01:33:32.976190','10','30258',3,'',7,1),(17,'2024-01-15 01:33:32.983863','9','30257',3,'',7,1),(18,'2024-01-15 01:33:32.993176','8','30256',3,'',7,1),(19,'2024-01-15 01:33:33.001630','7','30253',3,'',7,1),(20,'2024-01-15 01:33:33.010353','6','30252',3,'',7,1),(21,'2024-01-15 01:33:33.015706','5','30244',3,'',7,1),(22,'2024-01-15 01:33:33.022718','4','30231',3,'',7,1),(23,'2024-01-15 01:33:33.030675','3','30170',3,'',7,1),(24,'2024-01-15 01:33:33.037957','2','30160',3,'',7,1),(25,'2024-01-15 01:33:33.046396','1','30128',3,'',7,1),(26,'2024-01-15 23:59:58.065031','28','30289',3,'',7,1),(27,'2024-01-15 23:59:58.077408','27','30288',3,'',7,1),(28,'2024-01-15 23:59:58.096597','26','30280',3,'',7,1),(29,'2024-01-15 23:59:58.110650','25','30259',3,'',7,1),(30,'2024-01-15 23:59:58.122707','24','30258',3,'',7,1),(31,'2024-01-15 23:59:58.134348','23','30257',3,'',7,1),(32,'2024-01-15 23:59:58.142818','22','30256',3,'',7,1),(33,'2024-01-15 23:59:58.151178','21','30253',3,'',7,1),(34,'2024-01-15 23:59:58.164776','20','30252',3,'',7,1),(35,'2024-01-15 23:59:58.172900','19','30244',3,'',7,1),(36,'2024-01-15 23:59:58.182425','18','30231',3,'',7,1),(37,'2024-01-15 23:59:58.190529','17','30170',3,'',7,1),(38,'2024-01-15 23:59:58.199109','16','30160',3,'',7,1),(39,'2024-01-15 23:59:58.205578','15','30128',3,'',7,1),(40,'2024-01-20 06:35:18.534452','46','khjk',3,'',7,1),(41,'2024-01-20 06:35:18.544648','45','30300',3,'',7,1),(42,'2024-01-20 06:35:18.559975','44','30299',3,'',7,1),(43,'2024-01-20 06:35:18.569819','43','30296',3,'',7,1),(44,'2024-01-20 06:35:18.581571','42','30289',3,'',7,1),(45,'2024-01-20 06:35:18.591093','41','30288',3,'',7,1),(46,'2024-01-20 06:35:18.601044','40','30280',3,'',7,1),(47,'2024-01-20 06:35:18.612881','39','30259',3,'',7,1),(48,'2024-01-20 06:35:18.639244','38','30258',3,'',7,1),(49,'2024-01-20 06:35:18.654689','37','30257',3,'',7,1),(50,'2024-01-20 06:35:18.664327','36','30256',3,'',7,1),(51,'2024-01-20 06:35:18.674455','35','30253',3,'',7,1),(52,'2024-01-20 06:35:18.684749','34','30252',3,'',7,1),(53,'2024-01-20 06:35:18.697087','33','30244',3,'',7,1),(54,'2024-01-20 06:35:18.709529','32','30231',3,'',7,1),(55,'2024-01-20 06:35:18.719191','31','30170',3,'',7,1),(56,'2024-01-20 06:35:18.729425','30','30160',3,'',7,1),(57,'2024-01-20 06:35:18.747961','29','30128',3,'',7,1),(58,'2024-01-23 19:29:46.705763','66','Test',3,'',7,1),(59,'2024-01-23 19:29:46.718331','62','30300',3,'',7,1),(60,'2024-01-23 19:29:46.729202','61','30299',3,'',7,1),(61,'2024-01-23 19:29:46.737285','60','30296',3,'',7,1),(62,'2024-01-23 19:29:46.750328','59','30289',3,'',7,1),(63,'2024-01-23 19:29:46.758346','58','30280',3,'',7,1),(64,'2024-01-23 19:29:46.776388','56','30258',3,'',7,1),(65,'2024-01-23 19:29:46.801789','55','30257',3,'',7,1),(66,'2024-01-23 19:29:46.814358','54','30253',3,'',7,1),(67,'2024-01-23 19:29:46.824911','53','30252',3,'',7,1),(68,'2024-01-23 19:29:46.833357','52','30244',3,'',7,1),(69,'2024-01-23 19:29:46.842130','51','30231',3,'',7,1),(70,'2024-01-23 19:29:46.854613','50','30170',3,'',7,1),(71,'2024-01-23 19:29:46.862837','49','30160',3,'',7,1),(72,'2024-01-23 19:29:46.871520','48','30128',3,'',7,1),(73,'2024-01-23 19:29:46.879008','47','Test',3,'',7,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(9,'api','dimension'),(11,'api','lastupdate'),(7,'api','order'),(8,'api','orderreport'),(10,'api','product'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2024-01-06 22:20:21.076643'),(2,'auth','0001_initial','2024-01-06 22:20:23.372321'),(3,'admin','0001_initial','2024-01-06 22:20:23.735936'),(4,'admin','0002_logentry_remove_auto_add','2024-01-06 22:20:23.751498'),(5,'admin','0003_logentry_add_action_flag_choices','2024-01-06 22:20:23.762569'),(6,'api','0001_initial','2024-01-06 22:20:23.821058'),(7,'api','0002_order','2024-01-06 22:20:23.891617'),(8,'api','0003_alter_order_archived_alter_order_confirmed','2024-01-06 22:20:24.191019'),(9,'api','0004_remove_order_dimensions_order_packages_and_more','2024-01-06 22:20:24.637534'),(10,'api','0005_alter_order_ship_date','2024-01-06 22:20:24.774632'),(11,'api','0006_order_backorder_order_backorder_number','2024-01-06 22:20:24.965156'),(12,'api','0007_delete_note','2024-01-06 22:20:25.026381'),(13,'api','0008_rename_packages_order_packages_dict','2024-01-06 22:20:25.081910'),(14,'api','0009_order_notes','2024-01-06 22:20:25.166345'),(15,'api','0010_remove_order_notes_order_notes_dict','2024-01-06 22:20:25.406335'),(16,'api','0011_remove_order_weight','2024-01-06 22:20:25.497651'),(17,'api','0012_rename_confirmed_order_ready_and_more','2024-01-06 22:20:25.653519'),(18,'api','0013_remove_order_packages_dict_order_packages_array','2024-01-06 22:20:25.823940'),(19,'api','0014_remove_order_notes_dict_order_notes_array','2024-01-06 22:20:25.996434'),(20,'api','0015_order_delay','2024-01-06 22:20:26.078269'),(21,'api','0016_remove_order_delay_order_delay_date','2024-01-06 22:20:26.187441'),(22,'api','0017_alter_order_notes_array_alter_order_packages_array','2024-01-06 22:20:26.429886'),(23,'api','0018_alter_order_notes_array','2024-01-06 22:20:26.455052'),(24,'api','0019_alter_order_packages_array','2024-01-06 22:20:26.482911'),(25,'api','0020_closedorders_openorders','2024-01-06 22:20:26.498908'),(26,'api','0021_delete_closedorders_delete_openorders','2024-01-06 22:20:26.509942'),(27,'api','0022_alter_order_shipped','2024-01-06 22:20:26.582843'),(28,'api','0023_order_minimized_status','2024-01-06 22:20:26.678703'),(29,'api','0024_orderreport','2024-01-06 22:20:26.752445'),(30,'api','0025_remove_orderreport_created_date','2024-01-06 22:20:26.800673'),(31,'api','0026_alter_order_backorder_number','2024-01-06 22:20:26.955258'),(32,'api','0027_order_quote','2024-01-06 22:20:27.048461'),(33,'api','0028_alter_order_minimized_status','2024-01-06 22:20:27.061559'),(34,'api','0029_dimension','2024-01-06 22:20:27.158393'),(35,'api','0030_remove_dimension_index_position_dimension_height_and_more','2024-01-06 22:20:27.677778'),(36,'api','0031_alter_dimension_height_alter_dimension_length_and_more','2024-01-06 22:20:28.150790'),(37,'api','0032_alter_dimension_height_alter_dimension_length_and_more','2024-01-06 22:20:28.164046'),(38,'api','0033_order_delay_tbd','2024-01-06 22:20:28.230089'),(39,'api','0034_alter_order_ship_date','2024-01-06 22:20:28.345918'),(40,'api','0035_alter_order_delay_date','2024-01-06 22:20:28.357967'),(41,'api','0036_alter_order_delay_tbd','2024-01-06 22:20:28.475250'),(42,'api','0037_alter_dimension_height_alter_dimension_length_and_more','2024-01-06 22:20:29.052307'),(43,'api','0038_order_item_type_dict_hash_alter_order_order_number','2024-01-06 22:20:29.210719'),(44,'api','0039_product','2024-01-06 22:20:29.272151'),(45,'api','0040_alter_product_options','2024-01-06 22:20:29.280381'),(46,'api','0041_alter_product_item_name','2024-01-06 22:20:29.337036'),(47,'api','0042_alter_dimension_options_and_more','2024-01-06 22:20:29.385701'),(48,'api','0043_order_confirmed','2024-01-06 22:20:29.488272'),(49,'api','0044_remove_order_minimized_status','2024-01-06 22:20:29.550009'),(50,'contenttypes','0002_remove_content_type_name','2024-01-06 22:20:29.740208'),(51,'auth','0002_alter_permission_name_max_length','2024-01-06 22:20:29.894165'),(52,'auth','0003_alter_user_email_max_length','2024-01-06 22:20:29.951107'),(53,'auth','0004_alter_user_username_opts','2024-01-06 22:20:29.964924'),(54,'auth','0005_alter_user_last_login_null','2024-01-06 22:20:30.084702'),(55,'auth','0006_require_contenttypes_0002','2024-01-06 22:20:30.093983'),(56,'auth','0007_alter_validators_add_error_messages','2024-01-06 22:20:30.106696'),(57,'auth','0008_alter_user_username_max_length','2024-01-06 22:20:30.313680'),(58,'auth','0009_alter_user_last_name_max_length','2024-01-06 22:20:30.516098'),(59,'auth','0010_alter_group_name_max_length','2024-01-06 22:20:30.549891'),(60,'auth','0011_update_proxy_permissions','2024-01-06 22:20:30.568868'),(61,'auth','0012_alter_user_first_name_max_length','2024-01-06 22:20:30.720831'),(62,'sessions','0001_initial','2024-01-06 22:20:30.900215'),(63,'api','0045_delete_orderreport','2024-01-09 01:01:39.987338'),(64,'api','0046_rename_item_type_dict_hash_order_item_array_hash_and_more','2024-01-10 07:35:18.244852'),(65,'api','0047_lastupdate','2024-01-11 00:36:44.177294'),(66,'api','0048_alter_lastupdate_last_updated','2024-01-11 01:33:09.579002'),(67,'api','0049_alter_lastupdate_last_updated','2024-01-11 01:41:56.972842'),(68,'api','0050_alter_lastupdate_last_updated','2024-01-11 21:44:07.207283'),(69,'api','0051_alter_order_delay_date','2024-01-12 06:14:31.590736'),(70,'api','0052_remove_order_backorder','2024-01-12 23:16:45.314474'),(71,'api','0053_lastupdate_last_active','2024-01-18 06:18:26.568908'),(72,'api','0054_alter_order_order_number','2024-01-24 19:13:16.260315');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('4z2kydn58y4jqu0thaixuasm4jx44olw','.eJxVjEEOwiAQRe_C2hCggNSl-56BDMyMVA0kpV0Z765NutDtf-_9l4iwrSVunZY4o7gILU6_W4L8oLoDvEO9NZlbXZc5yV2RB-1yakjP6-H-HRTo5VsHdhnOrEYL6FmHlCiTQfIOg7HWovaAwTMkGJjRshvJKFRsScNglHh_ABgNOR0:1rO8IS:F0SXKBEH-kBEdgwxPK7Bwh5dMorIanWMzL56BK3JAhc','2024-01-26 03:33:28.337481'),('q88unv7gpajh4o2s3rlh9wu1uhse2w08','.eJxVjEEOwiAQRe_C2hCggNSl-56BDMyMVA0kpV0Z765NutDtf-_9l4iwrSVunZY4o7gILU6_W4L8oLoDvEO9NZlbXZc5yV2RB-1yakjP6-H-HRTo5VsHdhnOrEYL6FmHlCiTQfIOg7HWovaAwTMkGJjRshvJKFRsScNglHh_ABgNOR0:1rQDCs:h0fMdgeyJ5L7bBcJ1lhOOj3302WFGXCn2eGB1ZtXu50','2024-01-31 21:12:18.780035');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-30 14:15:03
