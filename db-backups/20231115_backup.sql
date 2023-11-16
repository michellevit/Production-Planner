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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_dimension`
--

LOCK TABLES `api_dimension` WRITE;
/*!40000 ALTER TABLE `api_dimension` DISABLE KEYS */;
INSERT INTO `api_dimension` VALUES (1,'10\" x 8\" x 3\"',3,10,8),(2,'13\" x 10\" x 3\"',3,13,10),(3,'9\" x 7\" x 1\"',1,9,7),(4,'10\" x 8\" x 4\"',4,10,8);
/*!40000 ALTER TABLE `api_dimension` ENABLE KEYS */;
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
  `item_type_dict` json NOT NULL,
  `item_subtype_dict` json NOT NULL,
  `ready` tinyint(1) NOT NULL,
  `shipped` tinyint(1) NOT NULL,
  `backorder` tinyint(1) NOT NULL,
  `backorder_number` int NOT NULL,
  `packages_array` json DEFAULT NULL,
  `notes_array` json DEFAULT NULL,
  `delay_date` date DEFAULT NULL,
  `minimized_status` tinyint(1) NOT NULL,
  `quote` tinyint(1) NOT NULL,
  `delay_tbd` tinyint(1) DEFAULT NULL,
  `item_type_dict_hash` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `api_order_shipped_6a104841` (`shipped`),
  KEY `api_order_item_type_dict_hash_0aa77f91` (`item_type_dict_hash`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_order`
--

LOCK TABLES `api_order` WRITE;
/*!40000 ALTER TABLE `api_order` DISABLE KEYS */;
INSERT INTO `api_order` VALUES (1,'2023-11-15 22:41:25.679107','2023-11-15 22:41:25.732148','39962','2023-08-15','WAX','{\"GTC505 (Engine Ignition Analyzer)\": 100, \"BNC-BAC (2 m BNC to Battery Alligator Clips Cable)\": 30}','{\"BNC-BAC (2 m BNC to Battery Alligator Clips Cable)\": 30, \"GTCTA505J (Crackle-Branded Engine Ignition Analyzer)\": 100}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'04358c3ad7ab1f1235e79b2af44b005b'),(2,'2023-11-15 22:41:25.683386','2023-11-15 22:41:25.683416','39959','2023-08-09','Snap-Crackle-CA','{\"CM1000 (1000A AC/DC Clamp Meter)\": 1}','{\"CM1000 (1000A AC/DC Clamp Meter)\": 1}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'7d350c95a54f7535d96f302eaca3b741'),(3,'2023-11-15 22:41:25.685465','2023-11-15 22:41:25.685499','39950','2023-08-09','Snap-Crackle-CA','{\"CM600 (600A AC/DC Clamp Meter)\": 2}','{\"CM600 (600A AC/DC Clamp Meter)\": 2}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'cce85efc7f94a156174341ff3043f84c'),(4,'2023-11-15 22:41:25.687511','2023-11-15 22:41:25.691630','39952','2023-08-09','Snap-Pop-US','{\"CM600 (600A AC/DC Clamp Meter)\": 6, \"CT6100 (Fuse Socket Connector Set)\": 7}','{\"CM600 (600A AC/DC Clamp Meter)\": 6, \"CT6100 (Fuse Socket Connector Set)\": 7}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'01c0f80fbc05817157b47a74372d1db6'),(5,'2023-11-15 22:41:25.694831','2023-11-15 22:41:25.779707','39947','2023-08-10','Carco','{\"GTC505 (Engine Ignition Analyzer)\": 5, \"CT8002 (Cordless Circuit Tester - Chrome)\": 1, \"TA303 (Universal Diesel & Gasoline Tachometer Kit)\": 1, \"TA500 (Smartach+COP Multisystem Ignition Analyzer)\": 2, \"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 3}','{\"GTC505 (Engine Ignition Analyzer)\": 5, \"CT8002 (Cordless Circuit Tester - Chrome)\": 1, \"TA303 (Universal Diesel & Gasoline Tachometer Kit)\": 1, \"TA500 (Smartach+COP Multisystem Ignition Analyzer)\": 2, \"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 3}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'1b254b9e6407a569b7ec0f860e16f815'),(6,'2023-11-15 22:41:25.696770','2023-11-15 22:41:25.711610','39948','2023-08-10','S2G','{\"CT8002 (Cordless Circuit Tester - Chrome)\": 22, \"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 1}','{\"CT8002 (Cordless Circuit Tester - Chrome)\": 22, \"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 1}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'c507664056cbc4f7305e170fb994e2d7'),(7,'2023-11-15 22:41:25.699012','2023-11-15 22:41:25.699042','39949','2023-08-10','MT','{\"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 15}','{\"FF310-MC (MC-Branded Short/Open Fault Finder 42V)\": 15}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'e734b9c27e5f80a00fd5f38de525ec72'),(8,'2023-11-15 22:41:25.700743','2023-11-15 22:41:25.700777','39937','2023-08-10','MCO','{\"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 12}','{\"FF310-MCO (MCO-Branded Short/Open Circuit Tester)\": 12}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'4e9a628de1d439608d13fe3f6166aad9'),(9,'2023-11-15 22:41:25.702297','2023-11-15 22:41:25.765692','39944','2023-08-09','Snap-Crackle-CA','{\"TA110 (Optical Tachometer)\": 2, \"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 4}','{\"TA110-E/F (Optical Tachometer/Counter (English/French))\": 2, \"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 4}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'57b71999a7b4388412ab805f286ecf81'),(10,'2023-11-15 22:41:25.703939','2023-11-15 22:41:25.703968','39946','2023-08-10','AW','{\"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 6}','{\"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 6}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'5c69c7bff2d7c9911c6d91f9d031976f'),(11,'2023-11-15 22:41:25.714755','2023-11-15 22:41:25.714841','39951','2023-08-09','Snap-Pop-US','{\"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 6}','{\"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 6}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'5c69c7bff2d7c9911c6d91f9d031976f'),(12,'2023-11-15 22:41:25.717085','2023-11-15 22:41:25.717126','39956','2023-08-10','DMN','{\"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 5}','{\"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 5}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'9e283831f178ab9c80efe404ade4563d'),(13,'2023-11-15 22:41:25.718946','2023-11-15 22:41:25.718983','39957','2023-08-08','WH','{\"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 1}','{\"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 1}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'072f83718a762beaa9991b112cd12e32'),(14,'2023-11-15 22:41:25.720813','2023-11-15 22:41:25.720842','39960','2023-08-09','Snap-Pop-US','{\"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 9}','{\"FF310 (FaultFinder™ Open and Short Circuit Finder and Tracer)\": 9}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'242f0d6ac2b1765b89e650e8ca75367d'),(15,'2023-11-15 22:41:25.722865','2023-11-15 22:41:25.722898','39953','2023-08-08','SBB','{\"GTC012 (Coil-On-Plug Sensor (compatible with GTC505))\": 1}','{\"GTC012 (Coil-On-Plug Sensor (compatible with GTC505))\": 1}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'90c4b517d0f49231a3aedea5634f84cc'),(16,'2023-11-15 22:41:25.724832','2023-11-15 22:41:25.724865','39954','2023-08-08','L Peli','{\"GTC014 (Clip-On Spark Plug Sensor with 2m Cable in Clamshell Packaging)\": 1}','{\"GTC014 (Clip-On Spark Plug Sensor with 2m Cable in Clamshell Packaging)\": 1}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'484f276ef534a9cf82f63883bc30fd80'),(17,'2023-11-15 22:41:25.727317','2023-11-15 22:41:25.727350','39955','2023-08-08','E Car','{\"GTC014 (Clip-On Spark Plug Sensor with 2m Cable in Clamshell Packaging)\": 1}','{\"GTC014 (Clip-On Spark Plug Sensor with 2m Cable in Clamshell Packaging)\": 1}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'484f276ef534a9cf82f63883bc30fd80'),(18,'2023-11-15 22:41:25.729309','2023-11-15 22:41:25.735537','39931','2023-07-19','Aline','{\"GTC505 (Engine Ignition Analyzer)\": 10, \"GTC014-PB (Clip-On Spark Plug Sensor with 2m Cable in Ziplock Bag)\": 10}','{\"USA-505 (Crackle-Branded Engine Ignition Analyzer)\": 10, \"GTC014-PB (Clip-On Spark Plug Sensor with 2m Cable in Ziplock Bag)\": 10}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'a3bf4c30ba7b2ee0e2933b51e5d9675f'),(19,'2023-11-15 22:41:25.737737','2023-11-15 22:41:25.737779','39577','2023-02-28','Mkeip','{\"GTC505 (Engine Ignition Analyzer)\": 1}','{\"GTC505 (Engine Ignition Analyzer)\": 1}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'0e8650162f685079b727aa752da85270'),(20,'2023-11-15 22:41:25.739499','2023-11-15 22:41:25.739587','39910','2023-07-12','MET','{\"GTC505 (Engine Ignition Analyzer)\": 10}','{\"GTC505 (Engine Ignition Analyzer)\": 10}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'58b41b466eca645c7537a5cfddf4f759'),(21,'2023-11-15 22:41:25.741417','2023-11-15 22:41:25.741450','39912','2023-07-17','AAP','{\"GTC505 (Engine Ignition Analyzer)\": 75}','{\"GTC505 (Engine Ignition Analyzer)\": 75}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'575817e3d9568c87df510bfba0b48b4b'),(22,'2023-11-15 22:41:25.746889','2023-11-15 22:49:09.736068','39908','2023-08-28','CKE','{\"GTC505m (Engine Ignition Analyzer + Spark Plug Wire Sensor Clip and Cable)\": 1}','{\"GTC505m (Engine Ignition Analyzer + Spark Plug Wire Sensor Clip and Cable)\": 1}',1,0,0,0,'[{\"id\": \"lp0ctr5aulvrff3415m\", \"weight\": 6, \"dimensions\": \"9\\\" x 7\\\" x 1\\\" (Envelope)\"}]','\"\"',NULL,0,0,0,'9695bdd2a16c6fef4b281ea25edf06dd'),(23,'2023-11-15 22:41:25.748747','2023-11-15 22:41:25.759641','39942','2023-08-10','PAU','{\"TA110 (Optical Tachometer)\": 24, \"LTX10 (Infrared Thermometer with Laser Sight)\": 120}','{\"95152 (UAP L.Thermometer)\": 120, \"95133 (UAP Laser Tachometer)\": 24}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'41ff4c2ae80ee2b6874c51591617fc98'),(24,'2023-11-15 22:41:25.750394','2023-11-15 22:41:25.762683','39941','2023-08-08','Msales','{\"TA110 (Optical Tachometer)\": 2, \"LTX10 (Infrared Thermometer with Laser Sight)\": 1}','{\"LTX10-E/F (Infrared Thermometer with Laser Sight)\": 1, \"TA110-E/F (Optical Tachometer/Counter (English/French))\": 2}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'1c7540c2d9d31d3c8da21033e7a211c4'),(25,'2023-11-15 22:41:25.752327','2023-11-15 22:41:25.752357','39943','2023-08-10','PAU','{\"RT6 (Reflective Tape for Optical Tachometers - 6 x 8\\\" Strips)\": 10}','{\"95133R (UAP Reflective Tape - 6 x 200 mm)\": 10}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'e1e7d9075d8bd994bcebfbaee8c0e2f0'),(26,'2023-11-15 22:41:25.754261','2023-11-15 22:41:25.754290','39883','2023-07-03','Gsight','{\"TA100 (TA100 SmarTach+ Wireless Ignition Analyzer and Tachometer)\": 1}','{\"TA100 (TA100 SmarTach+ Wireless Ignition Analyzer and Tachometer)\": 1}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'40490c8e5fd6ca81c251d54a2702820c'),(27,'2023-11-15 22:41:25.756235','2023-11-15 22:41:25.756288','39963','2023-08-08','DRILLC','{\"TA100 (TA100 SmarTach+ Wireless Ignition Analyzer and Tachometer)\": 1}','{\"TA100 (TA100 SmarTach+ Wireless Ignition Analyzer and Tachometer)\": 1}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'40490c8e5fd6ca81c251d54a2702820c'),(28,'2023-11-15 22:41:25.767859','2023-11-15 22:41:25.767892','39945','2023-08-09','Snap-Crackle-CA','{\"TA110 (Optical Tachometer)\": 1}','{\"TA110-E/F (Optical Tachometer/Counter (English/French))\": 1}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'1e4363d5d215129ed43b36877eb12b2a'),(29,'2023-11-15 22:41:25.769605','2023-11-15 22:41:25.769636','39958','2023-08-09','Snap-Crackle-CA','{\"TA110 (Optical Tachometer)\": 1}','{\"TA110-E/F (Optical Tachometer/Counter (English/French))\": 1}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'1e4363d5d215129ed43b36877eb12b2a'),(30,'2023-11-15 22:41:25.776392','2023-11-15 22:41:25.776443','39961','2023-08-08','Notre Dame','{\"TA303 (Universal Diesel & Gasoline Tachometer Kit)\": 2}','{\"TA303 (Universal Diesel & Gasoline Tachometer Kit)\": 2}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'b650bf53c7d83a50cfcbdb09f39906c3'),(31,'2023-11-15 22:41:25.782168','2023-11-15 22:41:25.782214','39732','2023-06-21','MCO','{\"Return\": 1}','{\"Return\": 1}',0,0,0,0,'\"\"','\"\"',NULL,1,0,0,'c07310c5923ae32bc40abff0cf783db9');
/*!40000 ALTER TABLE `api_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_orderreport`
--

DROP TABLE IF EXISTS `api_orderreport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_orderreport` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `submitted_date` datetime(6) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_orderreport`
--

LOCK TABLES `api_orderreport` WRITE;
/*!40000 ALTER TABLE `api_orderreport` DISABLE KEYS */;
INSERT INTO `api_orderreport` VALUES (1,'2023-11-15 22:41:25.785461','20231009 order report.xlsx');
/*!40000 ALTER TABLE `api_orderreport` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add order',7,'add_order'),(26,'Can change order',7,'change_order'),(27,'Can delete order',7,'delete_order'),(28,'Can view order',7,'view_order'),(29,'Can add order report',8,'add_orderreport'),(30,'Can change order report',8,'change_orderreport'),(31,'Can delete order report',8,'delete_orderreport'),(32,'Can view order report',8,'view_orderreport'),(33,'Can add dimension',9,'add_dimension'),(34,'Can change dimension',9,'change_dimension'),(35,'Can delete dimension',9,'delete_dimension'),(36,'Can view dimension',9,'view_dimension'),(37,'Can add product',10,'add_product'),(38,'Can change product',10,'change_product'),(39,'Can delete product',10,'delete_product'),(40,'Can view product',10,'view_product');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(9,'api','dimension'),(7,'api','order'),(8,'api','orderreport'),(10,'api','product'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(6,'sessions','session');
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
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2023-11-15 22:39:31.907019'),(2,'auth','0001_initial','2023-11-15 22:39:33.094601'),(3,'admin','0001_initial','2023-11-15 22:39:33.360782'),(4,'admin','0002_logentry_remove_auto_add','2023-11-15 22:39:33.378327'),(5,'admin','0003_logentry_add_action_flag_choices','2023-11-15 22:39:33.394993'),(6,'api','0001_initial','2023-11-15 22:39:33.446574'),(7,'api','0002_order','2023-11-15 22:39:33.492410'),(8,'api','0003_alter_order_archived_alter_order_confirmed','2023-11-15 22:39:33.663646'),(9,'api','0004_remove_order_dimensions_order_packages_and_more','2023-11-15 22:39:33.985744'),(10,'api','0005_alter_order_ship_date','2023-11-15 22:39:34.086427'),(11,'api','0006_order_backorder_order_backorder_number','2023-11-15 22:39:34.172028'),(12,'api','0007_delete_note','2023-11-15 22:39:34.191498'),(13,'api','0008_rename_packages_order_packages_dict','2023-11-15 22:39:34.222206'),(14,'api','0009_order_notes','2023-11-15 22:39:34.265065'),(15,'api','0010_remove_order_notes_order_notes_dict','2023-11-15 22:39:34.367263'),(16,'api','0011_remove_order_weight','2023-11-15 22:39:34.394283'),(17,'api','0012_rename_confirmed_order_ready_and_more','2023-11-15 22:39:34.456951'),(18,'api','0013_remove_order_packages_dict_order_packages_array','2023-11-15 22:39:34.559248'),(19,'api','0014_remove_order_notes_dict_order_notes_array','2023-11-15 22:39:34.651755'),(20,'api','0015_order_delay','2023-11-15 22:39:34.685951'),(21,'api','0016_remove_order_delay_order_delay_date','2023-11-15 22:39:34.752324'),(22,'api','0017_alter_order_notes_array_alter_order_packages_array','2023-11-15 22:39:34.869383'),(23,'api','0018_alter_order_notes_array','2023-11-15 22:39:34.878912'),(24,'api','0019_alter_order_packages_array','2023-11-15 22:39:34.886650'),(25,'api','0020_closedorders_openorders','2023-11-15 22:39:34.896699'),(26,'api','0021_delete_closedorders_delete_openorders','2023-11-15 22:39:34.906414'),(27,'api','0022_alter_order_shipped','2023-11-15 22:39:34.945060'),(28,'api','0023_order_minimized_status','2023-11-15 22:39:34.997933'),(29,'api','0024_orderreport','2023-11-15 22:39:35.047133'),(30,'api','0025_remove_orderreport_created_date','2023-11-15 22:39:35.081418'),(31,'api','0026_alter_order_backorder_number','2023-11-15 22:39:35.187158'),(32,'api','0027_order_quote','2023-11-15 22:39:35.253222'),(33,'api','0028_alter_order_minimized_status','2023-11-15 22:39:35.265526'),(34,'api','0029_dimension','2023-11-15 22:39:35.308550'),(35,'api','0030_remove_dimension_index_position_dimension_height_and_more','2023-11-15 22:39:35.531711'),(36,'api','0031_alter_dimension_height_alter_dimension_length_and_more','2023-11-15 22:39:35.699271'),(37,'api','0032_alter_dimension_height_alter_dimension_length_and_more','2023-11-15 22:39:35.708437'),(38,'api','0033_order_delay_tbd','2023-11-15 22:39:35.754204'),(39,'api','0034_alter_order_ship_date','2023-11-15 22:39:35.817096'),(40,'api','0035_alter_order_delay_date','2023-11-15 22:39:35.827416'),(41,'api','0036_alter_order_delay_tbd','2023-11-15 22:39:35.882671'),(42,'api','0037_alter_dimension_height_alter_dimension_length_and_more','2023-11-15 22:39:36.049957'),(43,'api','0038_order_item_type_dict_hash_alter_order_order_number','2023-11-15 22:39:36.106099'),(44,'api','0039_product','2023-11-15 22:39:36.139556'),(45,'api','0040_alter_product_options','2023-11-15 22:39:36.147090'),(46,'api','0041_alter_product_item_name','2023-11-15 22:39:36.174438'),(47,'contenttypes','0002_remove_content_type_name','2023-11-15 22:39:36.276189'),(48,'auth','0002_alter_permission_name_max_length','2023-11-15 22:39:36.355154'),(49,'auth','0003_alter_user_email_max_length','2023-11-15 22:39:36.384680'),(50,'auth','0004_alter_user_username_opts','2023-11-15 22:39:36.399617'),(51,'auth','0005_alter_user_last_login_null','2023-11-15 22:39:36.478905'),(52,'auth','0006_require_contenttypes_0002','2023-11-15 22:39:36.484127'),(53,'auth','0007_alter_validators_add_error_messages','2023-11-15 22:39:36.499198'),(54,'auth','0008_alter_user_username_max_length','2023-11-15 22:39:36.607207'),(55,'auth','0009_alter_user_last_name_max_length','2023-11-15 22:39:36.716752'),(56,'auth','0010_alter_group_name_max_length','2023-11-15 22:39:36.753060'),(57,'auth','0011_update_proxy_permissions','2023-11-15 22:39:36.776415'),(58,'auth','0012_alter_user_first_name_max_length','2023-11-15 22:39:36.875535'),(59,'sessions','0001_initial','2023-11-15 22:39:36.928353');
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

-- Dump completed on 2023-11-16  2:21:25
