-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 16, 2025 at 09:24 AM
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
('1657370', 58, 1040.00, 'paid', '2025-03-15 08:21:08', '2025-03-15 08:40:51', NULL, 23, '2025-03-15 16:27:20'),
('2361909', 58, 999.00, 'paid', '2025-03-14 12:54:39', '2025-03-15 02:19:49', NULL, 23, '2025-03-15 10:19:31'),
('2767784', 58, 224.00, 'pending', '2025-03-15 03:29:35', '2025-03-15 03:29:35', NULL, NULL, NULL),
('6881139', 58, 98000.00, 'paid', '2025-03-15 08:42:53', '2025-03-15 08:43:27', NULL, 23, '2025-03-15 16:43:08'),
('8224349', 58, 520.00, 'pending', '2025-03-15 07:46:08', '2025-03-15 07:46:08', NULL, NULL, NULL),
('9265881', 58, 32.00, 'paid', '2025-03-15 03:13:14', '2025-03-15 03:31:24', NULL, 60, '2025-03-15 11:21:52');

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
(101, '6881139', 26, 490, 200.00, 4);

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
(10, 'ffdfdff', 'hello world zxc', 333.00, 9, 'Beverages', 'https://i.ibb.co/Kck1MWYL/4f38c21520ba.jpg', '2025-03-14 12:13:24', '2025-03-15 13:32:55'),
(19, 'Lans sa Lorence', 'sa', 32.00, 29, 'Condiments & Sauces', 'https://i.ibb.co/xKr7PR7H/5ad3d88f58f7.png', '2025-03-14 11:02:14', '2025-03-15 13:43:16'),
(22, 'alfonso', 'asdads', 22.00, 11, 'Beverages', 'https://i.ibb.co/JWpGrGCZ/3d7369fc63fc.jpg', '2025-03-15 03:44:48', '2025-03-15 13:41:16'),
(23, 'alfonso', 'dasdsa', 100.00, 500, 'Beverages', 'https://i.ibb.co/VWsng8Jw/3caa5a7fcce3.jpg', '2025-03-15 03:55:49', '2025-03-15 03:55:49'),
(24, 'try test', 'try', 40.00, 40, 'Beverages', 'https://i.ibb.co/nNw52CdX/3a3b95a83d4b.jpg', '2025-03-15 04:07:22', '2025-03-15 04:07:22'),
(25, 'zxczxczxc', 'zxc', 40.00, 10, 'Dairy & Eggs', 'https://i.ibb.co/4nXCrF40/62f05f8bab90.jpg', '2025-03-15 04:09:20', '2025-03-15 13:40:55'),
(26, 'zxczxczxc try try', 'zxc try', 40.00, 10, 'Beverages', 'https://i.ibb.co/qLMbZG0M/0fd633750047.jpg', '2025-03-15 07:31:06', '2025-03-15 13:40:58');

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
(4, 26, '1.75 Liter', 200.00, 11, 'https://i.ibb.co/XZ2WL7mw/aaf8421af121.jpg');

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
(58, 'L4nszxc_09', 'Lans Lorence', 'Navarro', 'Hernandez', 'male', 'single', '09127649805', 'Ibaba West, Calapan City, Oriental Mindoro', '2004-07-09', 'lanslorence@gmail.com', '$2a$10$z4qsUgfnimoeNljOb83iy.ZyoesJyUPl6qLsxAo1YN03af72K.g0.', '2025-02-16 06:14:39', NULL, NULL, 1, 'user', NULL, NULL, 'https://i.ibb.co/j9Vw6DBJ/93808054dac3.jpg'),
(59, 'norman123', 'Lansdsadsa', 'sadasd', 'Losdadsarence', 'female', 'single', '09127649805', 'Zone 3321', '2025-02-16', 'l4nsh3rn4nd3z@gmail.com', '$2a$10$AO6fKFsPsvFCfhHg9X9GxOMFmeeWkcCzFNArxLDNL/6RQXkrev6o6', '2025-02-16 13:53:55', NULL, NULL, 1, 'user', NULL, NULL, NULL),
(60, 'saddsaddasdsa', 'sda', 'fdgd', 'fdgf', 'male', 'married', '3232432', 'dsadsa', '2025-02-26', 'sa@gmail.com', '$2a$10$rtbD7y7bDxqiyrlvtmoYROheqdfqRbI2RSIFQX/DKkj.lly8B474.', '2025-02-25 18:02:55', NULL, NULL, 1, 'staff', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

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
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `products_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `product_choices`
--
ALTER TABLE `product_choices`
  MODIFY `choice_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- Constraints for dumped tables
--

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
