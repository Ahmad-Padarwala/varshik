-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2023 at 05:48 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `valuda`
--

-- --------------------------------------------------------

--
-- Table structure for table `clan`
--

CREATE TABLE `clan` (
  `id` int(11) NOT NULL,
  `clan_name` varchar(50) NOT NULL,
  `parent_clan` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clan`
--

INSERT INTO `clan` (`id`, `clan_name`, `parent_clan`) VALUES
(1, 'PADARWALA', 0),
(2, 'valuda', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `expense_category`
--

CREATE TABLE `expense_category` (
  `id` int(11) NOT NULL,
  `e_category` varchar(20) NOT NULL,
  `e_subcategory` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expense_master`
--

CREATE TABLE `expense_master` (
  `id` int(11) NOT NULL,
  `e_title` varchar(50) NOT NULL,
  `e_disc` varchar(50) NOT NULL,
  `e_date` date NOT NULL,
  `e_expense_by` varchar(50) NOT NULL,
  `e_check_cash` varchar(50) NOT NULL,
  `e_received` double NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `income_category`
--

CREATE TABLE `income_category` (
  `id` int(11) NOT NULL,
  `i_category` varchar(50) NOT NULL,
  `i_subcategory` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `income_master`
--

CREATE TABLE `income_master` (
  `id` int(11) NOT NULL,
  `i_title` varchar(50) NOT NULL,
  `i_disc` varchar(50) NOT NULL,
  `i_date` date NOT NULL,
  `i_collected_by` varchar(50) NOT NULL,
  `i_payments` varchar(50) NOT NULL,
  `i_received` double NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE `member` (
  `id` double NOT NULL,
  `roll_no` int(11) NOT NULL,
  `f_name` varchar(50) NOT NULL,
  `m_name` varchar(50) NOT NULL,
  `l_name` varchar(50) NOT NULL,
  `g_f_name` varchar(50) DEFAULT NULL,
  `g_m_name` varchar(50) DEFAULT NULL,
  `g_l_name` varchar(50) DEFAULT NULL,
  `join_date` date NOT NULL,
  `pre_entry` double NOT NULL,
  `clanid` int(11) NOT NULL,
  `m_number` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`id`, `roll_no`, `f_name`, `m_name`, `l_name`, `g_f_name`, `g_m_name`, `g_l_name`, `join_date`, `pre_entry`, `clanid`, `m_number`) VALUES
(5, 0, 'ahmad', 'amin', 'padarwala', '', '', '', '2021-11-22', 2000, 1, 10),
(6, 0, 'aakib', 'abdulnhai', 'valuda', '', '', '', '2021-11-22', 2000, 2, 1524362142);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` double NOT NULL,
  `member_id` double NOT NULL,
  `roll_no` double NOT NULL,
  `pay_amount` double NOT NULL,
  `collected_by` varchar(50) NOT NULL,
  `book_no` double NOT NULL,
  `voucher_no` double NOT NULL,
  `payment_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`id`, `member_id`, `roll_no`, `pay_amount`, `collected_by`, `book_no`, `voucher_no`, `payment_date`) VALUES
(6, 6, 6, 2000, 'ahmnad amin', 120, 25, '2023-11-22'),
(7, 6, 6, 2000, 'ahmad', 1120, 20, '2024-02-21'),
(8, 5, 5, 2000, 'aakib', 120, 120, '2022-11-16'),
(9, 5, 5, 2000, 'cdscd', 1, 25, '2022-11-22');

-- --------------------------------------------------------

--
-- Table structure for table `yearly_income`
--

CREATE TABLE `yearly_income` (
  `id` int(11) NOT NULL,
  `amount` double NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `yearly_income`
--

INSERT INTO `yearly_income` (`id`, `amount`, `start_date`, `end_date`) VALUES
(14, 2000, '2022-01-01', '2023-01-01'),
(15, 2400, '2023-01-01', '2024-01-01'),
(16, 2800, '2024-01-01', '2025-01-01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clan`
--
ALTER TABLE `clan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expense_category`
--
ALTER TABLE `expense_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expense_master`
--
ALTER TABLE `expense_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expense_category` (`category_id`);

--
-- Indexes for table `income_category`
--
ALTER TABLE `income_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `income_master`
--
ALTER TABLE `income_master`
  ADD PRIMARY KEY (`id`),
  ADD KEY `income_fk` (`category_id`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_ibfk_1` (`clanid`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `roll_no` (`roll_no`);

--
-- Indexes for table `yearly_income`
--
ALTER TABLE `yearly_income`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clan`
--
ALTER TABLE `clan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `expense_category`
--
ALTER TABLE `expense_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `expense_master`
--
ALTER TABLE `expense_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `income_category`
--
ALTER TABLE `income_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `income_master`
--
ALTER TABLE `income_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `id` double NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `id` double NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `yearly_income`
--
ALTER TABLE `yearly_income`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `expense_master`
--
ALTER TABLE `expense_master`
  ADD CONSTRAINT `expense_category` FOREIGN KEY (`category_id`) REFERENCES `expense_category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `income_master`
--
ALTER TABLE `income_master`
  ADD CONSTRAINT `income_fk` FOREIGN KEY (`category_id`) REFERENCES `income_category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `member`
--
ALTER TABLE `member`
  ADD CONSTRAINT `member_ibfk_1` FOREIGN KEY (`clanid`) REFERENCES `clan` (`id`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
