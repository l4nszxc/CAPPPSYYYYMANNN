-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 18, 2025 at 05:38 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `capstone`
--

-- --------------------------------------------------------

--
-- Table structure for table `available_discounts`
--

CREATE TABLE `available_discounts` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT ((now() + interval 30 day)),
  `used` tinyint(1) DEFAULT '0',
  `order_id` char(7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `available_discounts`
--

INSERT INTO `available_discounts` (`id`, `user_id`, `amount`, `created_at`, `expires_at`, `used`, `order_id`) VALUES
(1, 58, 50.00, '2025-03-16 15:49:44', '2025-04-15 15:49:44', 1, '6637028'),
(2, 58, 50.00, '2025-03-16 16:02:00', '2025-04-15 16:02:00', 1, '8271029'),
(3, 58, 50.00, '2025-03-16 16:06:30', '2025-04-15 16:06:30', 1, '9632654'),
(4, 58, 50.00, '2025-03-16 16:10:00', '2025-04-15 16:10:00', 1, '6815523'),
(5, 58, 50.00, '2025-03-17 13:42:46', '2025-04-16 13:42:46', 1, '3398119'),
(6, 58, 100.00, '2025-03-17 14:57:52', '2025-04-16 14:57:52', 1, '2137493'),
(7, 58, 50.00, '2025-03-17 15:47:27', '2025-04-16 15:47:27', 1, '3104563'),
(8, 58, 100.00, '2025-03-17 17:12:55', '2025-04-16 17:12:55', 1, '0636143'),
(9, 58, 100.00, '2025-03-17 17:16:57', '2025-04-16 17:16:57', 1, '5013826'),
(10, 58, 50.00, '2025-03-17 17:22:57', '2025-04-16 17:22:57', 1, '4417536'),
(11, 58, 50.00, '2025-03-18 01:09:55', '2025-04-17 01:09:55', 1, '0783172'),
(12, 58, 250.00, '2025-03-18 14:37:54', '2025-04-17 14:37:54', 0, NULL),
(13, 58, 250.00, '2025-03-18 14:38:01', '2025-04-17 14:38:01', 0, NULL),
(14, 58, 50.00, '2025-03-18 14:40:43', '2025-04-17 14:40:43', 0, NULL),
(15, 58, 250.00, '2025-03-18 14:44:45', '2025-04-17 14:44:45', 0, NULL),
(16, 58, 100.00, '2025-03-18 14:44:48', '2025-04-17 14:44:48', 0, NULL),
(17, 58, 50.00, '2025-03-18 14:51:28', '2025-04-17 14:51:28', 0, NULL),
(18, 58, 50.00, '2025-03-18 14:52:16', '2025-04-17 14:52:16', 0, NULL),
(19, 58, 50.00, '2025-03-18 14:53:01', '2025-04-17 14:53:01', 0, NULL),
(20, 58, 50.00, '2025-03-18 14:53:32', '2025-04-17 14:53:32', 0, NULL),
(21, 58, 50.00, '2025-03-18 14:54:29', '2025-04-17 14:54:29', 0, NULL),
(22, 58, 100.00, '2025-03-18 14:54:35', '2025-04-17 14:54:35', 0, NULL),
(23, 58, 100.00, '2025-03-18 14:55:22', '2025-04-17 14:55:22', 0, NULL),
(24, 58, 50.00, '2025-03-18 14:56:24', '2025-04-17 14:56:24', 0, NULL),
(25, 58, 100.00, '2025-03-18 14:56:33', '2025-04-17 14:56:33', 0, NULL),
(26, 58, 100.00, '2025-03-18 14:56:42', '2025-04-17 14:56:42', 0, NULL),
(27, 58, 50.00, '2025-03-18 14:57:13', '2025-04-17 14:57:13', 0, NULL),
(28, 58, 50.00, '2025-03-18 14:57:30', '2025-04-17 14:57:30', 0, NULL),
(29, 58, 100.00, '2025-03-18 14:57:52', '2025-04-17 14:57:52', 0, NULL),
(30, 58, 250.00, '2025-03-18 14:57:54', '2025-04-17 14:57:54', 0, NULL),
(31, 58, 100.00, '2025-03-18 14:58:18', '2025-04-17 14:58:18', 0, NULL),
(32, 58, 100.00, '2025-03-18 14:59:53', '2025-04-17 14:59:53', 0, NULL),
(33, 58, 250.00, '2025-03-18 14:59:55', '2025-04-17 14:59:55', 0, NULL),
(34, 58, 100.00, '2025-03-18 15:00:18', '2025-04-17 15:00:18', 0, NULL),
(35, 58, 100.00, '2025-03-18 15:00:26', '2025-04-17 15:00:26', 0, NULL),
(36, 58, 250.00, '2025-03-18 15:00:27', '2025-04-17 15:00:27', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `choice_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`, `created_at`, `choice_id`) VALUES
(179, 59, 22, 1, '2025-03-18 15:56:20', NULL),
(180, 59, 10, 1, '2025-03-18 16:00:01', NULL),
(181, 58, 22, 1, '2025-03-18 16:01:00', NULL),
(182, 58, 10, 1, '2025-03-18 16:01:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` char(7) NOT NULL,
  `user_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','preparing','ready for pickup','paid','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cancel_reason` varchar(255) DEFAULT NULL,
  `accepted_by` int DEFAULT NULL,
  `accepted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `total_amount`, `status`, `created_at`, `updated_at`, `cancel_reason`, `accepted_by`, `accepted_at`) VALUES
('0039532', 58, 22.00, 'ready for pickup', '2025-03-16 16:06:25', '2025-03-17 15:56:34', NULL, 23, '2025-03-17 23:38:50'),
('0557984', 58, 333.00, 'paid', '2025-03-16 15:07:42', '2025-03-16 15:08:07', NULL, 23, '2025-03-16 23:07:53'),
('0573700', 58, 333.00, 'preparing', '2025-03-16 16:02:48', '2025-03-17 18:00:34', NULL, 23, '2025-03-18 02:00:34'),
('0636143', 58, 1565.00, 'paid', '2025-03-17 17:13:01', '2025-03-17 17:14:25', NULL, 23, '2025-03-18 01:13:10'),
('0783172', 58, 283.00, 'paid', '2025-03-18 01:10:12', '2025-03-18 01:15:42', NULL, 23, '2025-03-18 09:11:53'),
('1531376', 58, 22.00, 'cancelled', '2025-03-17 17:45:41', '2025-03-17 17:45:46', 'Changed my mind', NULL, NULL),
('1619432', 58, 22.00, 'cancelled', '2025-03-17 17:55:18', '2025-03-17 17:55:25', 'Ordered by mistake', NULL, NULL),
('1657370', 58, 1040.00, 'paid', '2025-03-15 08:21:08', '2025-03-15 08:40:51', NULL, 23, '2025-03-15 16:27:20'),
('1826467', 58, 34441.00, 'pending', '2025-03-16 15:07:01', '2025-03-16 15:07:01', NULL, NULL, NULL),
('2137493', 58, 100.00, 'preparing', '2025-03-17 14:58:10', '2025-03-17 15:29:13', NULL, 23, '2025-03-17 23:29:13'),
('2320699', 58, 333.00, 'cancelled', '2025-03-18 15:04:32', '2025-03-18 15:04:38', 'Found better price elsewhere', NULL, NULL),
('2361909', 58, 999.00, 'paid', '2025-03-14 12:54:39', '2025-03-15 02:19:49', NULL, 23, '2025-03-15 10:19:31'),
('2630898', 58, 288.00, 'paid', '2025-03-17 17:35:41', '2025-03-17 17:36:20', NULL, 23, '2025-03-18 01:36:01'),
('2767784', 58, 224.00, 'pending', '2025-03-15 03:29:35', '2025-03-15 03:29:35', NULL, NULL, NULL),
('2903588', 58, 22.00, 'paid', '2025-03-16 16:03:29', '2025-03-17 15:56:00', NULL, 23, '2025-03-17 23:41:34'),
('2918954', 58, 22.00, 'paid', '2025-03-17 17:48:09', '2025-03-17 17:49:09', NULL, 23, '2025-03-18 01:48:29'),
('3033079', 58, 333.00, 'ready for pickup', '2025-03-17 17:17:04', '2025-03-17 17:18:37', NULL, 23, '2025-03-18 01:17:12'),
('3104563', 58, 283.00, 'paid', '2025-03-17 15:47:35', '2025-03-17 15:49:05', NULL, 23, '2025-03-17 23:47:41'),
('3398119', 58, 250.00, 'paid', '2025-03-17 13:42:55', '2025-03-17 15:02:33', NULL, 23, '2025-03-17 22:16:13'),
('3903663', 58, 168.00, 'cancelled', '2025-03-17 17:42:21', '2025-03-17 17:44:51', 'Ordered by mistake', NULL, NULL),
('4393510', 58, 32.00, 'cancelled', '2025-03-17 17:42:01', '2025-03-17 17:42:31', 'das', NULL, NULL),
('4417536', 58, 250.00, 'ready for pickup', '2025-03-17 17:24:06', '2025-03-17 17:24:35', NULL, 23, '2025-03-18 01:24:21'),
('4579284', 58, 25048.00, 'paid', '2025-03-17 17:22:02', '2025-03-17 17:22:27', NULL, 23, '2025-03-18 01:22:08'),
('4679942', 58, 400.00, 'cancelled', '2025-03-17 17:23:10', '2025-03-17 17:30:41', 'Changed my mind', NULL, NULL),
('4694938', 58, 333.00, 'pending', '2025-03-16 15:39:56', '2025-03-16 15:39:56', NULL, NULL, NULL),
('4946198', 58, 62642.00, 'paid', '2025-03-17 14:56:58', '2025-03-17 14:57:21', NULL, 23, '2025-03-17 22:57:05'),
('5013826', 58, 300.00, 'paid', '2025-03-17 17:19:29', '2025-03-17 17:20:09', NULL, 23, '2025-03-18 01:19:38'),
('5220016', 58, 110.00, 'paid', '2025-03-16 12:29:58', '2025-03-16 14:15:56', NULL, 23, '2025-03-16 22:15:40'),
('5261668', 58, 22.00, 'preparing', '2025-03-17 17:51:05', '2025-03-17 18:00:07', NULL, 23, '2025-03-18 02:00:07'),
('5586476', 58, 12547.00, 'paid', '2025-03-16 09:30:24', '2025-03-16 09:31:36', NULL, 23, '2025-03-16 17:30:39'),
('6178932', 58, 34441.00, 'paid', '2025-03-16 15:03:42', '2025-03-16 15:04:40', NULL, 23, '2025-03-16 23:04:21'),
('6298386', 58, 365.00, 'pending', '2025-03-16 15:38:15', '2025-03-16 15:38:15', NULL, NULL, NULL),
('6630894', 58, 44.00, 'paid', '2025-03-17 17:55:40', '2025-03-17 17:58:00', NULL, 23, '2025-03-18 01:55:49'),
('6637028', 58, 616.00, 'paid', '2025-03-16 16:20:46', '2025-03-16 16:22:06', NULL, 23, '2025-03-17 00:21:14'),
('6815523', 58, 50.00, 'paid', '2025-03-16 16:10:52', '2025-03-17 15:59:02', NULL, 23, '2025-03-17 23:38:16'),
('6881139', 58, 98000.00, 'paid', '2025-03-15 08:42:53', '2025-03-15 08:43:27', NULL, 23, '2025-03-15 16:43:08'),
('7066272', 58, 100.00, 'paid', '2025-03-17 15:44:57', '2025-03-17 15:46:11', NULL, 23, '2025-03-17 23:45:05'),
('7092556', 58, 333.00, 'pending', '2025-03-18 17:30:39', '2025-03-18 17:30:39', NULL, NULL, NULL),
('7254325', 58, 25158.00, 'pending', '2025-03-16 14:59:09', '2025-03-16 14:59:09', NULL, NULL, NULL),
('7385943', 58, 333.00, 'ready for pickup', '2025-03-16 16:02:57', '2025-03-17 15:56:28', NULL, 23, '2025-03-17 23:42:08'),
('8224349', 58, 520.00, 'pending', '2025-03-15 07:46:08', '2025-03-15 07:46:08', NULL, NULL, NULL),
('8271029', 58, 0.00, 'preparing', '2025-03-17 13:28:07', '2025-03-17 15:35:14', NULL, 23, '2025-03-17 23:35:14'),
('8751845', 58, 666.00, 'pending', '2025-03-16 16:01:46', '2025-03-16 16:01:46', NULL, NULL, NULL),
('8841538', 58, 34441.00, 'paid', '2025-03-16 15:03:49', '2025-03-16 15:04:37', NULL, 23, '2025-03-16 23:04:19'),
('9074208', 58, 22.00, 'cancelled', '2025-03-17 17:44:44', '2025-03-17 17:44:49', 'Found better price elsewhere', NULL, NULL),
('9091668', 58, 500.00, 'cancelled', '2025-03-18 14:24:02', '2025-03-18 14:24:06', 'Changed my mind', NULL, NULL),
('9093713', 58, 333.00, 'pending', '2025-03-16 15:42:04', '2025-03-16 15:42:04', NULL, NULL, NULL),
('9265881', 58, 32.00, 'paid', '2025-03-15 03:13:14', '2025-03-15 03:31:24', NULL, 60, '2025-03-15 11:21:52'),
('9527228', 58, 333.00, 'preparing', '2025-03-16 16:02:09', '2025-03-17 18:00:51', NULL, 23, '2025-03-18 02:00:51'),
('9571068', 58, 100.00, 'cancelled', '2025-03-17 17:30:59', '2025-03-17 17:42:35', 'Ordered by mistake', NULL, NULL),
('9632654', 58, 283.00, 'preparing', '2025-03-16 16:20:03', '2025-03-17 15:35:52', NULL, 23, '2025-03-17 23:35:52'),
('9837181', 58, 100.00, 'preparing', '2025-03-16 16:06:42', '2025-03-17 15:36:11', NULL, 23, '2025-03-17 23:36:11');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` char(7) DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `choice_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `choice_id`) VALUES
(95, '2361909', 10, 3, 333.00, NULL),
(96, '9265881', 19, 1, 32.00, NULL),
(97, '2767784', 19, 7, 32.00, NULL),
(98, '8224349', 26, 13, 40.00, NULL),
(99, '1657370', 25, 1, 40.00, NULL),
(100, '1657370', 26, 5, 200.00, 4),
(101, '6881139', 26, 490, 200.00, 4),
(102, '5586476', 27, 4, 3131.00, 6),
(103, '5586476', 27, 1, 23.00, 5),
(104, '5220016', 22, 5, 22.00, NULL),
(105, '7254325', 22, 5, 22.00, NULL),
(106, '7254325', 27, 8, 3131.00, 6),
(107, '6178932', 27, 11, 3131.00, 6),
(108, '8841538', 27, 11, 3131.00, 6),
(109, '1826467', 27, 11, 3131.00, 6),
(110, '0557984', 10, 1, 333.00, NULL),
(111, '9093713', 10, 1, 333.00, NULL),
(112, '8751845', 10, 2, 333.00, NULL),
(113, '9527228', 10, 1, 333.00, NULL),
(114, '0573700', 10, 1, 333.00, NULL),
(115, '7385943', 10, 1, 333.00, NULL),
(116, '2903588', 22, 1, 22.00, NULL),
(117, '0039532', 22, 1, 22.00, NULL),
(118, '9837181', 23, 1, 100.00, NULL),
(119, '6815523', 23, 1, 100.00, NULL),
(120, '9632654', 10, 1, 333.00, NULL),
(121, '6637028', 10, 2, 333.00, NULL),
(122, '8271029', 22, 1, 22.00, NULL),
(123, '3398119', 23, 3, 100.00, NULL),
(124, '4946198', 22, 1, 22.00, NULL),
(125, '4946198', 27, 20, 3131.00, 6),
(126, '2137493', 23, 2, 100.00, NULL),
(127, '7066272', 23, 1, 100.00, NULL),
(128, '3104563', 10, 1, 333.00, NULL),
(129, '0636143', 10, 5, 333.00, NULL),
(130, '3033079', 10, 1, 333.00, NULL),
(131, '5013826', 26, 2, 200.00, 4),
(132, '4579284', 27, 8, 3131.00, 6),
(133, '4679942', 23, 4, 100.00, NULL),
(134, '4417536', 23, 3, 100.00, NULL),
(135, '9571068', 23, 1, 100.00, NULL),
(136, '2630898', 19, 9, 32.00, NULL),
(137, '4393510', 19, 1, 32.00, NULL),
(138, '3903663', 27, 4, 42.00, 7),
(139, '9074208', 22, 1, 22.00, NULL),
(140, '1531376', 22, 1, 22.00, NULL),
(141, '2918954', 22, 1, 22.00, NULL),
(142, '5261668', 22, 1, 22.00, NULL),
(145, '1619432', 22, 1, 22.00, NULL),
(146, '6630894', 22, 2, 22.00, NULL),
(147, '0783172', 10, 1, 333.00, NULL),
(148, '9091668', 23, 5, 100.00, NULL),
(149, '2320699', 10, 1, 333.00, NULL),
(150, '7092556', 10, 1, 333.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `products_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int NOT NULL,
  `category` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`products_id`, `name`, `description`, `price`, `stock_quantity`, `category`, `image`, `created_at`, `updated_at`) VALUES
(10, 'zxczxczxczxczxcxzcxzczxcxz', 'hello world zxc', 333.00, 7, 'Beverages', 'https://i.ibb.co/Kck1MWYL/4f38c21520ba.jpg', '2025-03-14 12:13:24', '2025-03-18 17:30:39'),
(19, 'Lans sa Lorence', 'sa', 32.00, 30, 'Condiments', 'https://i.ibb.co/xKr7PR7H/5ad3d88f58f7.png', '2025-03-14 11:02:14', '2025-03-17 17:42:31'),
(22, 'alfonso', 'asdads', 22.00, 1, 'Beverages', 'https://i.ibb.co/TDxYJwhr/bf62ee51614b.jpg', '2025-03-15 03:44:48', '2025-03-17 17:55:40'),
(23, 'alfonso', 'dasdsa', 100.00, 505, 'Beverages', 'https://i.ibb.co/VWsng8Jw/3caa5a7fcce3.jpg', '2025-03-15 03:55:49', '2025-03-18 14:24:06'),
(24, 'try test', 'try', 40.00, 40, 'Beverages', 'https://i.ibb.co/nNw52CdX/3a3b95a83d4b.jpg', '2025-03-15 04:07:22', '2025-03-15 04:07:22'),
(25, 'zxczxczxc', 'zxc', 40.00, 10, 'Milk and Chocolate Drink', 'https://i.ibb.co/JFKdHGG6/53df8be31bd3.jpg', '2025-03-15 04:09:20', '2025-03-16 10:09:42'),
(26, 'zxczxczxc try try', 'zxc try', 40.00, 10, 'Beverages', 'https://i.ibb.co/dJtP8hXJ/3024d5daf349.jpg', '2025-03-15 07:31:06', '2025-03-16 10:07:03'),
(27, 'snacks try', 'zxc', 22.00, 24, 'Candies and Snacks', 'https://i.ibb.co/FLhQk98V/e8e560350aa4.jpg', '2025-03-16 09:29:06', '2025-03-17 17:44:51');

-- --------------------------------------------------------

--
-- Table structure for table `product_choices`
--

CREATE TABLE `product_choices` (
  `choice_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_choices`
--

INSERT INTO `product_choices` (`choice_id`, `product_id`, `name`, `price`, `stock`, `image`) VALUES
(1, 26, '375ml', 200.00, 500, 'https://i.ibb.co/S4nmLC2h/fb6a46470bc1.jpg'),
(2, 26, '750ml', 200.00, 500, 'https://i.ibb.co/W4wnXx3c/4d7c3a536e7c.jpg'),
(3, 26, '1 Liter', 200.00, 500, 'https://i.ibb.co/FkfqmfFJ/7cba9faec069.jpg'),
(4, 26, '1.75 Liter', 200.00, 11, 'https://i.ibb.co/XZ2WL7mw/aaf8421af121.jpg'),
(5, 27, 'Mini (15g)', 23.00, 8, 'https://i.ibb.co/9kvrSmgG/1e10af4518c1.jpg'),
(6, 27, 'Regular (30g)', 3131.00, 31, 'https://i.ibb.co/qM8PVC64/fe09aa2dc4e1.jpg'),
(7, 27, 'Sharing (75g)', 42.00, 44, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reward_tiers`
--

CREATE TABLE `reward_tiers` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `points_required` int NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reward_tiers`
--

INSERT INTO `reward_tiers` (`id`, `name`, `points_required`, `discount_amount`, `description`) VALUES
(1, 'Bronze Reward', 100, 50.00, '₱50 off your next purchase'),
(2, 'Silver Reward', 200, 100.00, '₱100 off your next purchase'),
(3, 'Gold Reward', 500, 250.00, '₱250 off your next purchase');

-- --------------------------------------------------------

--
-- Table structure for table `shared_carts`
--

CREATE TABLE `shared_carts` (
  `share_id` varchar(36) NOT NULL,
  `owner_id` int NOT NULL,
  `shared_with` int DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','expired','used') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `shared_carts`
--

INSERT INTO `shared_carts` (`share_id`, `owner_id`, `shared_with`, `expires_at`, `created_at`, `status`) VALUES
('16807ad4-34b0-48c5-98cd-564f61579acb', 58, NULL, '2025-03-19 17:17:28', '2025-03-18 17:17:27', 'active'),
('3599964f-b6c7-4154-9edc-6f2ca84fcf53', 58, NULL, '2025-03-19 15:31:17', '2025-03-18 15:31:17', 'active'),
('64b1c524-9fd6-407f-87d8-16676f86ef07', 58, 59, '2025-03-19 15:59:50', '2025-03-18 15:59:49', 'used'),
('a249f87c-80b8-4049-b29b-4f6bf6eccd02', 58, NULL, '2025-03-19 15:31:59', '2025-03-18 15:31:58', 'active'),
('a4d57f76-bf03-4b5c-9f6c-153571c394a1', 59, 58, '2025-03-19 15:56:23', '2025-03-18 15:56:23', 'used'),
('aef59b41-80ec-48ab-92f3-eb3253d9e706', 58, NULL, '2025-03-19 17:16:39', '2025-03-18 17:16:38', 'active'),
('d357ec54-5b14-4fad-81bb-25ed11686ae7', 58, NULL, '2025-03-19 16:57:58', '2025-03-18 16:57:58', 'active'),
('f8c27d4e-4fde-4a94-96a4-715002805fbc', 58, NULL, '2025-03-19 15:32:20', '2025-03-18 15:32:20', 'active'),
('fd1f43b2-35a9-4a86-bbff-4e03d436725b', 58, NULL, '2025-03-19 15:33:52', '2025-03-18 15:33:52', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `middlename` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `civil_status` enum('single','married','widowed','divorced','separated') NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `address` text,
  `birthdate` date DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `otp` varchar(6) DEFAULT NULL,
  `otp_expires` timestamp NULL DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT '0',
  `role` enum('user','admin','staff') DEFAULT 'user',
  `password_reset_otp` varchar(6) DEFAULT NULL,
  `password_reset_otp_expires` datetime DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `firstname`, `middlename`, `lastname`, `gender`, `civil_status`, `phone_number`, `address`, `birthdate`, `email`, `password`, `created_at`, `otp`, `otp_expires`, `email_verified`, `role`, `password_reset_otp`, `password_reset_otp_expires`, `profile_picture`) VALUES
(20, 'adminsiL4ns', '', NULL, '', 'male', 'single', NULL, NULL, NULL, 'admin@gmail.com', '$2b$10$wRo343tSktWutK.ljme.JOtFQj3fCguB9r0QtYLioG4F0//XbD0WS', '2025-02-14 20:30:57', NULL, NULL, 1, 'admin', NULL, NULL, NULL),
(23, 'Helios', 'Kien Eros', NULL, 'Aas', 'male', 'single', '097874547561', 'ilaya calapan', NULL, 'hernandezlanslorence@gmail.com', '$2a$10$FXivDvr6ZEu4/.BoTHD8tOXi6Ji6V3mv8BvVdrS68cQ3hYcmu3j1O', '2025-02-14 21:37:21', NULL, NULL, 1, 'staff', NULL, NULL, NULL),
(56, 'l4nszxcqwe', 'dsa', 'dsa', 'dsadsa', 'female', 'single', '09127649805', 'Ibaba West, Calapan City, Oriental Mindoro', '2025-02-16', 'dsdsadasdas@gmail.com', '$2a$10$SSpSYo7VpFS4tolhVjEQ2On47sOeNhXD3eplmpR/wEFNkGooExiC6', '2025-02-16 04:31:13', 'lKiGNV', '2025-02-16 04:41:13', 0, 'user', NULL, NULL, NULL),
(57, 'dsad213213', 'adsad', 'sadsa', '3dsads', 'female', 'single', '3442342', 'dsadas', '2025-02-16', 'lans@gmail.com', '$2a$10$Pd2lZMPCnTMBxylXfT47e.OHqz5AekpbITPS9PFmCKcetRQm.2qb6', '2025-02-16 04:32:19', 'blj3Gv', '2025-02-16 04:42:19', 0, 'user', NULL, NULL, NULL),
(58, 'L4nszxc_09', 'Lans Lorence', 'Navarro', 'Hernandez', 'male', 'single', '09127649805', 'Ibaba West, Calapan City, Oriental Mindoro', '2004-07-09', 'lanslorence@gmail.com', '$2a$10$z4qsUgfnimoeNljOb83iy.ZyoesJyUPl6qLsxAo1YN03af72K.g0.', '2025-02-16 06:14:39', NULL, NULL, 1, 'user', 'Px7inM', '2025-03-17 23:50:19', 'https://i.ibb.co/5WWvbjyk/dac9333a4e72.jpg'),
(59, 'norman123', 'Lansdsadsa', 'sadasd', 'Losdadsarence', 'female', 'single', '09127649805', 'Zone 3321', '2025-02-16', 'l4nsh3rn4nd3z@gmail.com', '$2a$10$AO6fKFsPsvFCfhHg9X9GxOMFmeeWkcCzFNArxLDNL/6RQXkrev6o6', '2025-02-16 13:53:55', NULL, NULL, 1, 'user', NULL, NULL, NULL),
(60, 'saddsaddasdsa', 'sda', 'fdgd', 'fdgf', 'male', 'married', '3232432', 'dsadsa', '2025-02-26', 'sa@gmail.com', '$2a$10$rtbD7y7bDxqiyrlvtmoYROheqdfqRbI2RSIFQX/DKkj.lly8B474.', '2025-02-25 18:02:55', NULL, NULL, 1, 'staff', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_rewards`
--

CREATE TABLE `user_rewards` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_id` char(7) DEFAULT NULL,
  `points` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_rewards`
--

INSERT INTO `user_rewards` (`id`, `user_id`, `order_id`, `points`, `description`, `created_at`) VALUES
(1, 58, '5220016', 100000, 'Earned points from order #5220016', '2025-03-16 12:29:58'),
(2, 58, '6178932', 344, 'Earned points from order #6178932', '2025-03-16 15:03:42'),
(3, 58, '8841538', 344, 'Earned points from order #8841538', '2025-03-16 15:03:49'),
(4, 58, '1826467', 344, 'Earned points from order #1826467', '2025-03-16 15:07:01'),
(5, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-16 15:07:14'),
(6, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-16 15:07:16'),
(7, 58, '0557984', 3, 'Earned points from order #0557984', '2025-03-16 15:07:42'),
(8, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-16 15:37:53'),
(9, 58, '6298386', 3, 'Earned points from order #6298386', '2025-03-16 15:38:15'),
(10, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-16 15:39:47'),
(11, 58, '4694938', 3, 'Earned points from order #4694938', '2025-03-16 15:39:56'),
(12, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-16 15:41:43'),
(13, 58, '9093713', 3, 'Earned points from order #9093713', '2025-03-16 15:42:04'),
(14, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-16 15:49:44'),
(15, 58, '8751845', 6, 'Earned points from order #8751845', '2025-03-16 16:01:46'),
(16, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-16 16:02:00'),
(17, 58, '9527228', 3, 'Earned points from order #9527228', '2025-03-16 16:02:09'),
(18, 58, '0573700', 3, 'Earned points from order #0573700', '2025-03-16 16:02:48'),
(19, 58, '7385943', 3, 'Earned points from order #7385943', '2025-03-16 16:02:57'),
(20, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-16 16:06:30'),
(21, 58, '9837181', 1, 'Earned points from order #9837181', '2025-03-16 16:06:42'),
(22, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-16 16:10:00'),
(23, 58, '9632654', 2, 'Earned points from order #9632654', '2025-03-16 16:20:03'),
(24, 58, '6637028', 6, 'Earned points from order #6637028', '2025-03-16 16:20:46'),
(25, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-17 13:42:46'),
(26, 58, '3398119', 2, 'Earned points from order #3398119', '2025-03-17 13:42:55'),
(27, 58, '4946198', 626, 'Earned points from order #4946198', '2025-03-17 14:56:58'),
(28, 58, NULL, -200, 'Redeemed for Silver Reward', '2025-03-17 14:57:52'),
(29, 58, '2137493', 1, 'Earned points from order #2137493', '2025-03-17 14:58:10'),
(30, 58, '7066272', 1, 'Earned points from order #7066272', '2025-03-17 15:44:57'),
(31, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-17 15:47:27'),
(32, 58, '3104563', 2, 'Earned points from order #3104563', '2025-03-17 15:47:35'),
(33, 58, NULL, -200, 'Redeemed for Silver Reward', '2025-03-17 17:12:55'),
(34, 58, '0636143', 15, 'Earned points from order #0636143', '2025-03-17 17:13:01'),
(35, 58, NULL, -200, 'Redeemed for Silver Reward', '2025-03-17 17:16:57'),
(36, 58, '3033079', 3, 'Earned points from order #3033079', '2025-03-17 17:17:04'),
(37, 58, '5013826', 3, 'Earned points from order #5013826', '2025-03-17 17:19:29'),
(38, 58, '4579284', 250, 'Earned points from order #4579284', '2025-03-17 17:22:02'),
(39, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-17 17:22:57'),
(40, 58, '4679942', 4, 'Earned points from order #4679942', '2025-03-17 17:23:10'),
(41, 58, '4417536', 2, 'Earned points from order #4417536', '2025-03-17 17:24:06'),
(42, 58, '9571068', 1, 'Earned points from order #9571068', '2025-03-17 17:30:59'),
(43, 58, '2630898', 2, 'Earned points from order #2630898', '2025-03-17 17:35:41'),
(44, 58, '3903663', 1, 'Earned points from order #3903663', '2025-03-17 17:42:21'),
(45, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-18 01:09:55'),
(46, 58, '0783172', 2, 'Earned points from order #0783172', '2025-03-18 01:10:12'),
(47, 58, '9091668', 5, 'Earned points from order #9091668', '2025-03-18 14:24:02'),
(48, 58, NULL, -500, 'Redeemed for Gold Reward', '2025-03-18 14:37:54'),
(49, 58, NULL, -500, 'Redeemed for Gold Reward', '2025-03-18 14:38:01'),
(50, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-18 14:40:43'),
(51, 58, NULL, -500, 'Redeemed for Gold Reward', '2025-03-18 14:44:45'),
(52, 58, NULL, -200, 'Redeemed for Silver Reward', '2025-03-18 14:44:48'),
(53, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-18 14:51:28'),
(54, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-18 14:52:16'),
(55, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-18 14:53:01'),
(56, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-18 14:53:32'),
(57, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-18 14:54:29'),
(58, 58, NULL, -200, 'Redeemed for Silver Reward', '2025-03-18 14:54:35'),
(59, 58, NULL, -200, 'Redeemed for Silver Reward', '2025-03-18 14:55:22'),
(60, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-18 14:56:24'),
(61, 58, NULL, -200, 'Redeemed for Silver Reward', '2025-03-18 14:56:33'),
(62, 58, NULL, -200, 'Redeemed for Silver Reward', '2025-03-18 14:56:42'),
(63, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-18 14:57:13'),
(64, 58, NULL, -100, 'Redeemed for Bronze Reward', '2025-03-18 14:57:30'),
(65, 58, NULL, -200, 'Redeemed for Silver Reward', '2025-03-18 14:57:52'),
(66, 58, NULL, -500, 'Redeemed for Gold Reward', '2025-03-18 14:57:54'),
(67, 58, NULL, -200, 'Redeemed for Silver Reward', '2025-03-18 14:58:18'),
(68, 58, NULL, -200, 'Redeemed for Silver Reward', '2025-03-18 14:59:53'),
(69, 58, NULL, -500, 'Redeemed for Gold Reward', '2025-03-18 14:59:55'),
(70, 58, NULL, -200, 'Redeemed for Silver Reward', '2025-03-18 15:00:18'),
(71, 58, NULL, -200, 'Redeemed for Silver Reward', '2025-03-18 15:00:26'),
(72, 58, NULL, -500, 'Redeemed for Gold Reward', '2025-03-18 15:00:27'),
(73, 58, '2320699', 3, 'Earned points from order #2320699', '2025-03-18 15:04:32'),
(74, 58, '7092556', 3, 'Earned points from order #7092556', '2025-03-18 17:30:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `available_discounts`
--
ALTER TABLE `available_discounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `choice_id` (`choice_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `accepted_by` (`accepted_by`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`products_id`);

--
-- Indexes for table `product_choices`
--
ALTER TABLE `product_choices`
  ADD PRIMARY KEY (`choice_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `reward_tiers`
--
ALTER TABLE `reward_tiers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shared_carts`
--
ALTER TABLE `shared_carts`
  ADD PRIMARY KEY (`share_id`),
  ADD KEY `owner_id` (`owner_id`),
  ADD KEY `shared_with` (`shared_with`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_rewards`
--
ALTER TABLE `user_rewards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `available_discounts`
--
ALTER TABLE `available_discounts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=183;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `products_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `product_choices`
--
ALTER TABLE `product_choices`
  MODIFY `choice_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `reward_tiers`
--
ALTER TABLE `reward_tiers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `user_rewards`
--
ALTER TABLE `user_rewards`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `available_discounts`
--
ALTER TABLE `available_discounts`
  ADD CONSTRAINT `available_discounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `available_discounts_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`products_id`),
  ADD CONSTRAINT `cart_ibfk_3` FOREIGN KEY (`choice_id`) REFERENCES `product_choices` (`choice_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`accepted_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`products_id`);

--
-- Constraints for table `product_choices`
--
ALTER TABLE `product_choices`
  ADD CONSTRAINT `product_choices_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`products_id`);

--
-- Constraints for table `shared_carts`
--
ALTER TABLE `shared_carts`
  ADD CONSTRAINT `shared_carts_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `shared_carts_ibfk_2` FOREIGN KEY (`shared_with`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_rewards`
--
ALTER TABLE `user_rewards`
  ADD CONSTRAINT `user_rewards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
