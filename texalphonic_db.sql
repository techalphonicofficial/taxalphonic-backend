-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 13, 2026 at 02:44 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `texalphonic_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` int(10) UNSIGNED NOT NULL,
  `sub_category_id` int(10) UNSIGNED NOT NULL,
  `author_id` int(10) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `short_description` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `views` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `status` varchar(30) NOT NULL DEFAULT 'draft',
  `published_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `article_contents`
--

CREATE TABLE `article_contents` (
  `id` int(10) UNSIGNED NOT NULL,
  `article_id` int(10) UNSIGNED NOT NULL,
  `content` longtext NOT NULL,
  `table_of_contents` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`table_of_contents`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `article_tags`
--

CREATE TABLE `article_tags` (
  `article_id` int(10) UNSIGNED NOT NULL,
  `tag_id` int(10) UNSIGNED NOT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `authors`
--

CREATE TABLE `authors` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(190) NOT NULL,
  `profile_image` varchar(500) DEFAULT NULL,
  `designation` varchar(150) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `image` varchar(500) NOT NULL,
  `link` varchar(500) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `status` varchar(30) NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(10) UNSIGNED NOT NULL,
  `blog_category_id` int(10) UNSIGNED NOT NULL,
  `author_id` int(10) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `views` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `status` varchar(30) NOT NULL DEFAULT 'draft',
  `published_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog_categories`
--

CREATE TABLE `blog_categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog_tags`
--

CREATE TABLE `blog_tags` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blog_tag_mapping`
--

CREATE TABLE `blog_tag_mapping` (
  `blog_id` int(10) UNSIGNED NOT NULL,
  `blog_tag_id` int(10) UNSIGNED NOT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `icon` varchar(500) DEFAULT NULL,
  `color` varchar(30) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `status` varchar(30) NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` int(10) UNSIGNED NOT NULL,
  `state_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `slug` varchar(140) NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_forms`
--

CREATE TABLE `contact_forms` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(190) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'new',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contents`
--

CREATE TABLE `contents` (
  `id` int(11) NOT NULL,
  `title` varchar(180) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `body` longtext DEFAULT NULL,
  `type` enum('post','page') NOT NULL DEFAULT 'post',
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `category` varchar(100) DEFAULT NULL,
  `author` varchar(120) NOT NULL DEFAULT 'Admin',
  `publishedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dynamic_sections`
--

CREATE TABLE `dynamic_sections` (
  `id` int(10) UNSIGNED NOT NULL,
  `type` varchar(40) NOT NULL COMMENT 'Parent content type: main_category, service, sub_services, or page',
  `parent_id` int(10) UNSIGNED NOT NULL COMMENT 'ID from the table selected by type',
  `extra_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Reusable dynamic section content and settings' CHECK (json_valid(`extra_json`)),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ;

--
-- Dumping data for table `dynamic_sections`
--

INSERT INTO `dynamic_sections` (`id`, `type`, `parent_id`, `extra_json`, `created_at`, `updated_at`) VALUES
(1, 'main_category', 1, '{\"section\":\"experience_stat\",\"eyebrow\":\"Why choose us\",\"title\":\"20+ years of experience\",\"description\":\"Trusted expertise for businesses that need reliable tax, compliance, and advisory support.\",\"stats\":[{\"label\":\"Years of experience\",\"value\":20,\"suffix\":\"+\"}]}', '2026-08-04 06:49:58', '2026-08-04 06:49:58'),
(2, 'main_category', 1, '{\"section\":\"hero\",\"title\":\"New hero section\",\"description\":\"Add the main headline and supporting text for this category.\",\"cta\":{\"label\":\"Get started\",\"url\":\"#\"}}', '2026-08-04 06:55:06', '2026-08-04 06:55:06'),
(3, 'main_category', 1, '{\"section\":\"feature_grid\",\"title\":\"Key features\",\"description\":\"Highlight important services, benefits, or category strengths.\",\"items\":[{\"title\":\"Feature one\",\"description\":\"Short feature detail.\"},{\"title\":\"Feature two\",\"description\":\"Short feature detail.\"}]}', '2026-08-04 06:55:22', '2026-08-04 06:55:22'),
(4, 'main_category', 1, '{\"section\":\"rich_article\",\"title\":\"Article section\",\"description\":\"Write the summary for this content block.\",\"content\":\"Add long-form content here.\"}', '2026-08-04 06:55:28', '2026-08-04 06:55:28'),
(5, 'main_category', 1, '{\"section\":\"faq\",\"title\":\"Frequently asked questions\",\"items\":[{\"question\":\"Add your question?\",\"answer\":\"Add the answer here.\"}]}', '2026-08-04 06:55:31', '2026-08-04 06:55:31'),
(6, 'main_category', 1, '{\"section\":\"custom_block\",\"title\":\"Custom block\",\"description\":\"Edit this JSON for any custom frontend section.\",\"data\":{\"enabled\":true}}', '2026-08-04 06:55:32', '2026-08-04 06:55:32'),
(8, 'main_category', 3, '{\"section\":\"hero\",\"title\":\"New hero section\",\"description\":\"Add the main headline and supporting text for this category.\",\"cta\":{\"label\":\"Get started\",\"url\":\"#\"}}', '2026-08-04 07:50:06', '2026-08-04 07:50:06');

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` int(10) UNSIGNED NOT NULL,
  `question` varchar(500) NOT NULL,
  `answer` longtext NOT NULL,
  `category` varchar(120) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `status` varchar(30) NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `footer_layouts`
--

CREATE TABLE `footer_layouts` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `layout` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Footer logo, main section, and bottom section configuration' CHECK (json_valid(`layout`)),
  `custom_css` longtext DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'draft',
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `footer_layouts`
--

INSERT INTO `footer_layouts` (`id`, `name`, `slug`, `layout`, `custom_css`, `status`, `is_default`, `created_by`, `createdAt`, `updatedAt`) VALUES
(2, 'footer', 'footer', '{\"version\":2,\"logo\":{\"url\":\"/uploads/media/96a6b304-c4a0-40cf-a22c-0068bb211a7d.jpg\",\"alt\":\"photo-1548574505-5e239809ee19\",\"href\":\"/\"},\"top\":[{\"type\":\"category\",\"id\":1,\"name\":\"textpedia\",\"slug\":\"textpedia\",\"children\":[{\"type\":\"service\",\"id\":5,\"name\":\"⚖️ Corporate Law\",\"slug\":\"corporate-law\",\"children\":[]},{\"type\":\"service\",\"id\":2,\"name\":\"⚖️ Direct Tax\",\"slug\":\"direct-tax\",\"children\":[]}]}],\"main\":[]}', NULL, 'published', 1, NULL, '2026-07-22 05:50:28', '2026-07-22 05:50:28');

-- --------------------------------------------------------

--
-- Table structure for table `header_layouts`
--

CREATE TABLE `header_layouts` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `layout` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Simple logo, top row, and main row configuration' CHECK (json_valid(`layout`)),
  `custom_css` longtext DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'draft',
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `header_layouts`
--

INSERT INTO `header_layouts` (`id`, `name`, `slug`, `layout`, `custom_css`, `status`, `is_default`, `created_by`, `createdAt`, `updatedAt`) VALUES
(1, 'main header', 'main-header', '{\"version\":2,\"logo\":{\"url\":\"/uploads/media/96a6b304-c4a0-40cf-a22c-0068bb211a7d.jpg\",\"alt\":\"photo-1548574505-5e239809ee19\",\"href\":\"/home\"},\"top\":[{\"type\":\"category\",\"id\":1,\"name\":\"textpedia\",\"slug\":\"textpedia\",\"children\":[{\"type\":\"service\",\"id\":2,\"name\":\"⚖️ Direct Tax\",\"slug\":\"direct-tax\",\"children\":[{\"type\":\"sub_service\",\"id\":4,\"name\":\"Assessments & Appeals\",\"slug\":\"assessments-appeals\",\"children\":[]},{\"type\":\"sub_service\",\"id\":3,\"name\":\"CBDT\",\"slug\":\"cbdt\",\"children\":[]},{\"type\":\"sub_service\",\"id\":2,\"name\":\"Income Tax\",\"slug\":\"income-tax\",\"children\":[]},{\"type\":\"sub_service\",\"id\":6,\"name\":\"Calculators & Utilities\",\"slug\":\"calculators-utilities\",\"children\":[]},{\"type\":\"sub_service\",\"id\":5,\"name\":\"PAN & Aadhaar\",\"slug\":\"pan-aadhaar\",\"children\":[]}]},{\"type\":\"service\",\"id\":5,\"name\":\"⚖️ Corporate Law\",\"slug\":\"corporate-law\",\"children\":[]},{\"type\":\"service\",\"id\":3,\"name\":\"⚖️ GST\",\"slug\":\"gst\",\"children\":[{\"type\":\"sub_service\",\"id\":11,\"name\":\"E-Way Bill\",\"slug\":\"e-way-bill\",\"children\":[]},{\"type\":\"sub_service\",\"id\":7,\"name\":\"GST Basics\",\"slug\":\"gst-basics\",\"children\":[]},{\"type\":\"sub_service\",\"id\":8,\"name\":\"GST Registration\",\"slug\":\"gst-registration\",\"children\":[]}]}]},{\"type\":\"category\",\"id\":2,\"name\":\"🏛️ GeM Services\",\"slug\":\"gem-services\",\"children\":[{\"type\":\"service\",\"id\":20,\"name\":\"📁 Bidding & Tenders\",\"slug\":\"bidding-tenders\",\"children\":[]},{\"type\":\"service\",\"id\":24,\"name\":\"📁 Buyer Services (Government)\",\"slug\":\"buyer-services-government\",\"children\":[]},{\"type\":\"service\",\"id\":18,\"name\":\"📁 Catalogue & Listing\",\"slug\":\"catalogue-listing\",\"children\":[]},{\"type\":\"service\",\"id\":23,\"name\":\"📁 Compliance & Support\",\"slug\":\"compliance-support\",\"children\":[]},{\"type\":\"service\",\"id\":22,\"name\":\"📁 MSME & Startup Benefits\",\"slug\":\"msme-startup-benefits\",\"children\":[]},{\"type\":\"service\",\"id\":21,\"name\":\"📁 Order & Fulfilment\",\"slug\":\"order-fulfilment\",\"children\":[]},{\"type\":\"service\",\"id\":17,\"name\":\"📁 Seller / Service Provider Registration\",\"slug\":\"seller-service-provider-registration\",\"children\":[]},{\"type\":\"service\",\"id\":19,\"name\":\"📁 Vendor Assessment & OEM\",\"slug\":\"vendor-assessment-oem\",\"children\":[]}]},{\"type\":\"custom\",\"id\":\"custom-1784634683395\",\"name\":\"about\",\"url\":\"/about\",\"children\":[{\"type\":\"custom\",\"id\":\"custom-1784635645895\",\"name\":\"⚡ Quick Update\",\"url\":\"/quick-update\",\"children\":[]}]}],\"main\":[{\"type\":\"service\",\"id\":5,\"name\":\"⚖️ Corporate Law\",\"slug\":\"corporate-law\",\"children\":[]},{\"type\":\"service\",\"id\":2,\"name\":\"⚖️ Direct Tax\",\"slug\":\"direct-tax\",\"children\":[{\"type\":\"sub_service\",\"id\":4,\"name\":\"Assessments & Appeals\",\"slug\":\"assessments-appeals\",\"children\":[]},{\"type\":\"sub_service\",\"id\":6,\"name\":\"Calculators & Utilities\",\"slug\":\"calculators-utilities\",\"children\":[]},{\"type\":\"sub_service\",\"id\":3,\"name\":\"CBDT\",\"slug\":\"cbdt\",\"children\":[]},{\"type\":\"sub_service\",\"id\":2,\"name\":\"Income Tax\",\"slug\":\"income-tax\",\"children\":[]}]},{\"type\":\"service\",\"id\":3,\"name\":\"⚖️ GST\",\"slug\":\"gst\",\"children\":[{\"type\":\"sub_service\",\"id\":11,\"name\":\"E-Way Bill\",\"slug\":\"e-way-bill\",\"children\":[]},{\"type\":\"sub_service\",\"id\":7,\"name\":\"GST Basics\",\"slug\":\"gst-basics\",\"children\":[]},{\"type\":\"sub_service\",\"id\":8,\"name\":\"GST Registration\",\"slug\":\"gst-registration\",\"children\":[]},{\"type\":\"sub_service\",\"id\":9,\"name\":\"GST Returns\",\"slug\":\"gst-returns\",\"children\":[]},{\"type\":\"sub_service\",\"id\":10,\"name\":\"Input Tax Credit\",\"slug\":\"input-tax-credit\",\"children\":[]},{\"type\":\"sub_service\",\"id\":12,\"name\":\"Reverse Charge\",\"slug\":\"reverse-charge\",\"children\":[]}]},{\"type\":\"service\",\"id\":12,\"name\":\"🏭 Excise\",\"slug\":\"excise\",\"children\":[]},{\"type\":\"service\",\"id\":7,\"name\":\"💱 FEMA\",\"slug\":\"fema\",\"children\":[]},{\"type\":\"service\",\"id\":10,\"name\":\"💰 Finance\",\"slug\":\"finance\",\"children\":[]},{\"type\":\"service\",\"id\":15,\"name\":\"🌐 International Taxation\",\"slug\":\"international-taxation\",\"children\":[]},{\"type\":\"service\",\"id\":6,\"name\":\"🏦 RBI\",\"slug\":\"rbi\",\"children\":[]},{\"type\":\"service\",\"id\":13,\"name\":\"📑 SEBI\",\"slug\":\"sebi\",\"children\":[]},{\"type\":\"custom\",\"id\":\"custom-1784634710787\",\"name\":\"about\",\"url\":\"/about\",\"children\":[]}]}', NULL, 'published', 0, NULL, '2026-07-21 07:14:34', '2026-08-04 05:47:41');

-- --------------------------------------------------------

--
-- Table structure for table `main_categories`
--

CREATE TABLE `main_categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `image` varchar(500) DEFAULT NULL COMMENT 'Path or URL selected from the media gallery',
  `image_alt` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `seo_keywords` text DEFAULT NULL,
  `canonical_url` varchar(500) DEFAULT NULL,
  `seo_tags` longtext DEFAULT NULL COMMENT 'Raw title, meta, canonical, Open Graph, and JSON-LD tags',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `main_categories`
--

INSERT INTO `main_categories` (`id`, `name`, `slug`, `image`, `image_alt`, `seo_title`, `seo_description`, `seo_keywords`, `canonical_url`, `seo_tags`, `createdAt`, `updatedAt`) VALUES
(1, 'textpedia', 'textpedia', '/uploads/media/96a6b304-c4a0-40cf-a22c-0068bb211a7d.jpg', 'photo-1548574505-5e239809ee19', NULL, NULL, NULL, NULL, '<!-- Meta Tags -->\n<title>Best Digital Marketing Agency sssin Noida | ABC Solutions</title>\n\n<meta name=\"description\" content=\"ABC Solutions is a leading digital marketing agency in Noida offering SEO, PPC, Sociaddl Media Marketing, Website Development, and Branding services to help businesses grow online.\">\n\n<meta name=\"keywords\" content=\"Digital Marketing Agency, SEO Company Noida, PPC Services, Social Media Marketing, Websddite Development, Branding Agency\">\n\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n\n<link rel=\"canonical\" href=\"https://www.abcsolutions.com/digital-marketing\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Best Digital Marketing Agency in Noida | ABC Solutions\">\n<meta property=\"og:description\" content=\"Grow your business with expert SEO, PPC, Social Media Marketing, and Website Development services.\">\n<meta property=\"og:url\" content=\"https://www.abcsolutions.com/digital-marketing\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Digital Marketing Services\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"ABC Solutions\"\n  },\n  \"url\": \"https://www.abcsolutions.com/digital-marketing\",\n  \"description\": \"Professional digital marketing services including SEO, PPC, Social Media Marketing, and Website Development.\"\n}\n</script>', '2026-07-20 12:40:33', '2026-07-20 12:40:33'),
(2, '🏛️ GeM Services', 'gem-services', '/uploads/media/2f7c61ce-0c0b-459c-af5d-b70b45363416.png', 'this is my alt text', NULL, NULL, NULL, NULL, '<!-- Meta Tags -->\n<title>Best Digital Marketing Agency in Noida | ABC Solutions</title>\n\n<meta name=\"description\" content=\"ABC Solutions is a leading digital marketing agency in Noida offering SEO, PPC, Social Media Marketing, Website Development, and Branding services to help businesses grow online.\">\n\n<meta name=\"keywords\" content=\"Digital Marketing Agency, SEO Company Noida, PPC Services, Social Media Marketing, Website Development, Branding Agency\">\n\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n\n<link rel=\"canonical\" href=\"https://www.abcsolutions.com/digital-marketing\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Best Digital Marketing Agency in Noida | ABC Solutions\">\n<meta property=\"og:description\" content=\"Grow your business with expert SEO, PPC, Social Media Marketing, and Website Development services.\">\n<meta property=\"og:url\" content=\"https://www.abcsolutions.com/digital-marketing\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Digital Marketing Services\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"ABC Solutions\"\n  },\n  \"url\": \"https://www.abcsolutions.com/digital-marketing\",\n  \"description\": \"Professional digital marketing services including SEO, PPC, Social Media Marketing, and Website Development.\"\n}\n</script>', '2026-07-20 12:45:25', '2026-07-20 12:45:25'),
(3, 'Startup', 'startup', NULL, NULL, 'Startup services in India', 'Register your business structure online with qualified CAs, CSs and legal experts.', 'startup services, company registration, business registration india', NULL, NULL, '2026-08-04 07:05:13', '2026-08-04 07:05:13');

-- --------------------------------------------------------

--
-- Table structure for table `main_category_services`
--

CREATE TABLE `main_category_services` (
  `main_category_id` int(10) UNSIGNED NOT NULL,
  `service_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `main_category_services`
--

INSERT INTO `main_category_services` (`main_category_id`, `service_id`) VALUES
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(2, 17),
(2, 18),
(2, 19),
(2, 20),
(2, 21),
(2, 22),
(2, 23),
(2, 24);

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` int(10) UNSIGNED NOT NULL,
  `uploaded_by` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `path` varchar(500) NOT NULL,
  `mime_type` varchar(120) NOT NULL,
  `file_type` varchar(30) NOT NULL DEFAULT 'image',
  `size` bigint(20) UNSIGNED DEFAULT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `uploaded_by`, `name`, `file_name`, `path`, `mime_type`, `file_type`, `size`, `alt_text`, `createdAt`, `updatedAt`) VALUES
(1, NULL, 'DNSChecker_Map_1784537011761', '2f7c61ce-0c0b-459c-af5d-b70b45363416.png', '/uploads/media/2f7c61ce-0c0b-459c-af5d-b70b45363416.png', 'image/png', 'image', 126532, 'this is my alt text', '2026-07-20 12:26:55', '2026-07-20 12:30:34'),
(2, NULL, 'photo-1548574505-5e239809ee19', '96a6b304-c4a0-40cf-a22c-0068bb211a7d.jpg', '/uploads/media/96a6b304-c4a0-40cf-a22c-0068bb211a7d.jpg', 'image/jpeg', 'image', 525110, 'photo-1548574505-5e239809ee19', '2026-07-20 12:27:01', '2026-07-20 12:27:01');

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `slug` varchar(140) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `menu_id` int(10) UNSIGNED NOT NULL,
  `parent_id` int(10) UNSIGNED DEFAULT NULL,
  `label` varchar(150) NOT NULL,
  `url` varchar(500) DEFAULT NULL,
  `icon` varchar(500) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `status` varchar(30) NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `newsletter_subscribers`
--

CREATE TABLE `newsletter_subscribers` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(190) NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'subscribed',
  `subscribed_at` datetime NOT NULL,
  `unsubscribed_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` int(10) UNSIGNED NOT NULL,
  `parent_id` int(10) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `page_type` varchar(50) NOT NULL DEFAULT 'page',
  `icon` varchar(500) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'draft',
  `display_order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `page_details`
--

CREATE TABLE `page_details` (
  `id` int(10) UNSIGNED NOT NULL,
  `page_id` int(10) UNSIGNED NOT NULL,
  `json_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Structured JSON data blocks and components for the page' CHECK (json_valid(`json_data`)),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `module` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `redirects`
--

CREATE TABLE `redirects` (
  `id` int(10) UNSIGNED NOT NULL,
  `from_path` varchar(500) NOT NULL,
  `to_path` varchar(500) NOT NULL,
  `status_code` smallint(5) UNSIGNED NOT NULL DEFAULT 301,
  `status` varchar(30) NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `service_id` int(10) UNSIGNED DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(190) DEFAULT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` int(10) UNSIGNED NOT NULL,
  `permission_id` int(10) UNSIGNED NOT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `search_keywords`
--

CREATE TABLE `search_keywords` (
  `id` int(10) UNSIGNED NOT NULL,
  `article_id` int(10) UNSIGNED NOT NULL,
  `keyword` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seo_meta`
--

CREATE TABLE `seo_meta` (
  `id` int(10) UNSIGNED NOT NULL,
  `entity_type` varchar(50) NOT NULL,
  `entity_id` int(10) UNSIGNED NOT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `canonical_url` varchar(500) DEFAULT NULL,
  `robots` varchar(100) DEFAULT NULL,
  `schema_markup` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`schema_markup`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20260701000000-create-main-categories.js'),
('20260701001000-create-media.js'),
('20260701002000-add-seo-tags-to-main-categories.js'),
('20260701003000-create-header-layouts.js'),
('20260701004000-create-services-and-category-pivot.js'),
('20260701005000-create-sub-services-and-service-pivot.js'),
('20260701006000-add-seo-tags-to-sub-services.js'),
('20260711115228-create-users-table.js'),
('20260714120000-create-cms-tables.js'),
('20260715120000-create-platform-modules.js'),
('20260721000000-create-footer-layouts.js'),
('20260727180000-create-page-details-and-update-pages.js'),
('20260804120000-create-dynamic-sections.js');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `seo_tags` longtext DEFAULT NULL COMMENT 'Raw title, meta, canonical, Open Graph, and JSON-LD tags',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `slug`, `seo_tags`, `createdAt`, `updatedAt`) VALUES
(2, '⚖️ Direct Tax', 'direct-tax', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:06:56', '2026-07-20 13:06:56'),
(3, '⚖️ GST', 'gst', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:07:09', '2026-07-20 13:07:09'),
(4, '⚖️Company Law', 'company-law', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:07:22', '2026-07-20 13:07:22'),
(5, '⚖️ Corporate Law', 'corporate-law', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:07:34', '2026-07-20 13:07:34'),
(6, '🏦 RBI', 'rbi', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:07:43', '2026-07-20 13:07:43'),
(7, '💱 FEMA', 'fema', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:07:53', '2026-07-20 13:07:53'),
(8, '🛃 Customs', 'customs', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:08:02', '2026-07-20 13:08:02'),
(9, '🚢 DGFT', 'dgft', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:08:12', '2026-07-20 13:08:12'),
(10, '💰 Finance', 'finance', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:08:22', '2026-07-20 13:08:22'),
(11, '📈 Budget', 'budget', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:08:31', '2026-07-20 13:08:31'),
(12, '🏭 Excise', 'excise', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:08:42', '2026-07-20 13:08:42'),
(13, '📑 SEBI', 'sebi', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:08:56', '2026-07-20 13:08:56'),
(14, '📚 Accounts & Audit', 'accounts-audit', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:09:05', '2026-07-20 13:09:05'),
(15, '🌐 International Taxation', 'international-taxation', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:09:12', '2026-07-20 13:09:12'),
(16, '💼 Business Laws', 'business-laws', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:09:21', '2026-07-20 13:09:21'),
(17, '📁 Seller / Service Provider Registration', 'seller-service-provider-registration', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:10:04', '2026-07-20 13:10:04'),
(18, '📁 Catalogue & Listing', 'catalogue-listing', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:10:14', '2026-07-20 13:10:14'),
(19, '📁 Vendor Assessment & OEM', 'vendor-assessment-oem', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:10:22', '2026-07-20 13:10:22'),
(20, '📁 Bidding & Tenders', 'bidding-tenders', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:10:31', '2026-07-20 13:10:31'),
(21, '📁 Order & Fulfilment', 'order-fulfilment', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:10:39', '2026-07-20 13:10:39'),
(22, '📁 MSME & Startup Benefits', 'msme-startup-benefits', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:10:49', '2026-07-20 13:10:49'),
(23, '📁 Compliance & Support', 'compliance-support', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:10:58', '2026-07-20 13:10:58'),
(24, '📁 Buyer Services (Government)', 'buyer-services-government', '<!-- Meta Tags -->\n<title>Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your service description here.\">\n<meta name=\"keywords\" content=\"Service keyword, business keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/service-slug\",\n  \"description\": \"Add your service description here.\"\n}\n</script>', '2026-07-20 13:11:05', '2026-07-20 13:11:05');

-- --------------------------------------------------------

--
-- Table structure for table `service_categories`
--

CREATE TABLE `service_categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `icon` varchar(500) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `status` varchar(30) NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_documents`
--

CREATE TABLE `service_documents` (
  `id` int(10) UNSIGNED NOT NULL,
  `service_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_faqs`
--

CREATE TABLE `service_faqs` (
  `id` int(10) UNSIGNED NOT NULL,
  `service_id` int(10) UNSIGNED NOT NULL,
  `question` varchar(500) NOT NULL,
  `answer` longtext NOT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_features`
--

CREATE TABLE `service_features` (
  `id` int(10) UNSIGNED NOT NULL,
  `service_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_locations`
--

CREATE TABLE `service_locations` (
  `id` int(10) UNSIGNED NOT NULL,
  `service_id` int(10) UNSIGNED NOT NULL,
  `city_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_processes`
--

CREATE TABLE `service_processes` (
  `id` int(10) UNSIGNED NOT NULL,
  `service_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_sub_services`
--

CREATE TABLE `service_sub_services` (
  `service_id` int(10) UNSIGNED NOT NULL,
  `sub_service_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_sub_services`
--

INSERT INTO `service_sub_services` (`service_id`, `sub_service_id`) VALUES
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(2, 6),
(3, 7),
(3, 8),
(3, 9),
(3, 10),
(3, 11),
(3, 12);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `key` varchar(100) NOT NULL,
  `value` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `states`
--

CREATE TABLE `states` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `code` varchar(10) DEFAULT NULL,
  `slug` varchar(140) NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sub_categories`
--

CREATE TABLE `sub_categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED NOT NULL,
  `parent_id` int(10) UNSIGNED DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `status` varchar(30) NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sub_services`
--

CREATE TABLE `sub_services` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `featured_image` varchar(500) DEFAULT NULL COMMENT 'Path or URL selected from the media gallery',
  `image_alt` varchar(255) DEFAULT NULL,
  `seo_tags` longtext DEFAULT NULL COMMENT 'Raw title, meta, canonical, Open Graph, and JSON-LD tags',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sub_services`
--

INSERT INTO `sub_services` (`id`, `name`, `slug`, `featured_image`, `image_alt`, `seo_tags`, `createdAt`, `updatedAt`) VALUES
(2, 'Income Tax', 'income-tax', '/uploads/media/96a6b304-c4a0-40cf-a22c-0068bb211a7d.jpg', 'photo-1548574505-5e239809ee19', NULL, '2026-07-20 13:30:39', '2026-07-20 13:30:39'),
(3, 'CBDT', 'cbdt', '/uploads/media/2f7c61ce-0c0b-459c-af5d-b70b45363416.png', 'this is my alt text', '<!-- Meta Tags -->\n<title>Sub Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your sub service description here.\">\n<meta name=\"keywords\" content=\"Sub service keyword, service keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/sub-service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Sub Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your sub service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/sub-service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Sub Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/sub-service-slug\",\n  \"description\": \"Add your sub service description here.\"\n}\n</script>', '2026-07-20 13:31:18', '2026-07-20 13:31:18'),
(4, 'Assessments & Appeals', 'assessments-appeals', '/uploads/media/96a6b304-c4a0-40cf-a22c-0068bb211a7d.jpg', 'photo-1548574505-5e239809ee19', '<!-- Meta Tags -->\n<title>Sub Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your sub service description here.\">\n<meta name=\"keywords\" content=\"Sub service keyword, service keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/sub-service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Sub Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your sub service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/sub-service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Sub Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/sub-service-slug\",\n  \"description\": \"Add your sub service description here.\"\n}\n</script>', '2026-07-20 13:31:36', '2026-07-20 13:31:36'),
(5, 'PAN & Aadhaar', 'pan-aadhaar', '/uploads/media/2f7c61ce-0c0b-459c-af5d-b70b45363416.png', 'this is my alt text', '<!-- Meta Tags -->\n<title>Sub Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your sub service description here.\">\n<meta name=\"keywords\" content=\"Sub service keyword, service keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/sub-service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Sub Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your sub service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/sub-service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Sub Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/sub-service-slug\",\n  \"description\": \"Add your sub service description here.\"\n}\n</script>', '2026-07-20 13:31:53', '2026-07-20 13:31:53'),
(6, 'Calculators & Utilities', 'calculators-utilities', '/uploads/media/2f7c61ce-0c0b-459c-af5d-b70b45363416.png', 'this is my alt text', '<!-- Meta Tags -->\n<title>Sub Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your sub service description here.\">\n<meta name=\"keywords\" content=\"Sub service keyword, service keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/sub-service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Sub Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your sub service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/sub-service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Sub Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/sub-service-slug\",\n  \"description\": \"Add your sub service description here.\"\n}\n</script>', '2026-07-20 13:32:03', '2026-07-21 11:58:13'),
(7, 'GST Basics', 'gst-basics', '/uploads/media/2f7c61ce-0c0b-459c-af5d-b70b45363416.png', 'this is my alt text', '<!-- Meta Tags -->\n<title>Sub Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your sub service description here.\">\n<meta name=\"keywords\" content=\"Sub service keyword, service keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/sub-service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Sub Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your sub service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/sub-service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Sub Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/sub-service-slug\",\n  \"description\": \"Add your sub service description here.\"\n}\n</script>', '2026-07-20 13:32:20', '2026-07-20 13:32:20'),
(8, 'GST Registration', 'gst-registration', '/uploads/media/96a6b304-c4a0-40cf-a22c-0068bb211a7d.jpg', 'photo-1548574505-5e239809ee19', '<!-- Meta Tags -->\n<title>Sub Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your sub service description here.\">\n<meta name=\"keywords\" content=\"Sub service keyword, service keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/sub-service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Sub Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your sub service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/sub-service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Sub Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/sub-service-slug\",\n  \"description\": \"Add your sub service description here.\"\n}\n</script>', '2026-07-20 13:32:50', '2026-07-20 13:32:50'),
(9, 'GST Returns', 'gst-returns', '/uploads/media/2f7c61ce-0c0b-459c-af5d-b70b45363416.png', 'this is my alt text', '<!-- Meta Tags -->\n<title>Sub Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your sub service description here.\">\n<meta name=\"keywords\" content=\"Sub service keyword, service keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/sub-service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Sub Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your sub service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/sub-service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Sub Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/sub-service-slug\",\n  \"description\": \"Add your sub service description here.\"\n}\n</script>', '2026-07-20 13:33:07', '2026-07-20 13:33:07'),
(10, 'Input Tax Credit', 'input-tax-credit', '/uploads/media/2f7c61ce-0c0b-459c-af5d-b70b45363416.png', 'this is my alt text', '<!-- Meta Tags -->\n<title>Sub Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your sub service description here.\">\n<meta name=\"keywords\" content=\"Sub service keyword, service keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/sub-service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Sub Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your sub service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/sub-service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Sub Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/sub-service-slug\",\n  \"description\": \"Add your sub service description here.\"\n}\n</script>', '2026-07-20 13:33:20', '2026-07-20 13:33:20'),
(11, 'E-Way Bill', 'e-way-bill', '/uploads/media/2f7c61ce-0c0b-459c-af5d-b70b45363416.png', 'this is my alt text', '<!-- Meta Tags -->\n<title>Sub Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your sub service description here.\">\n<meta name=\"keywords\" content=\"Sub service keyword, service keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/sub-service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Sub Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your sub service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/sub-service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Sub Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/sub-service-slug\",\n  \"description\": \"Add your sub service description here.\"\n}\n</script>', '2026-07-20 13:33:36', '2026-07-20 13:33:36'),
(12, 'Reverse Charge', 'reverse-charge', '/uploads/media/2f7c61ce-0c0b-459c-af5d-b70b45363416.png', 'this is my alt text', '<!-- Meta Tags -->\n<title>Sub Service Name | Company Name</title>\n<meta name=\"description\" content=\"Add your sub service description here.\">\n<meta name=\"keywords\" content=\"Sub service keyword, service keyword\">\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\">\n<link rel=\"canonical\" href=\"https://example.com/sub-service-slug\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"Sub Service Name | Company Name\">\n<meta property=\"og:description\" content=\"Add your sub service description here.\">\n<meta property=\"og:url\" content=\"https://example.com/sub-service-slug\">\n<meta property=\"og:type\" content=\"website\">\n\n<!-- Schema -->\n<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Service\",\n  \"name\": \"Sub Service Name\",\n  \"provider\": {\n    \"@type\": \"Organization\",\n    \"name\": \"Company Name\"\n  },\n  \"url\": \"https://example.com/sub-service-slug\",\n  \"description\": \"Add your sub service description here.\"\n}\n</script>', '2026-07-20 13:34:13', '2026-07-20 13:34:13');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `designation` varchar(150) DEFAULT NULL,
  `company` varchar(150) DEFAULT NULL,
  `profile_image` varchar(500) DEFAULT NULL,
  `content` text NOT NULL,
  `rating` tinyint(3) UNSIGNED DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trending_articles`
--

CREATE TABLE `trending_articles` (
  `id` int(10) UNSIGNED NOT NULL,
  `article_id` int(10) UNSIGNED NOT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `starts_at` datetime DEFAULT NULL,
  `ends_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `role_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `sub_category_id` (`sub_category_id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `article_contents`
--
ALTER TABLE `article_contents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `article_id` (`article_id`);

--
-- Indexes for table `article_tags`
--
ALTER TABLE `article_tags`
  ADD PRIMARY KEY (`article_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `authors`
--
ALTER TABLE `authors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `blog_category_id` (`blog_category_id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `blog_categories`
--
ALTER TABLE `blog_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `blog_tags`
--
ALTER TABLE `blog_tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `blog_tag_mapping`
--
ALTER TABLE `blog_tag_mapping`
  ADD PRIMARY KEY (`blog_id`,`blog_tag_id`),
  ADD KEY `blog_tag_id` (`blog_tag_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cities_state_id_slug` (`state_id`,`slug`);

--
-- Indexes for table `contact_forms`
--
ALTER TABLE `contact_forms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contents`
--
ALTER TABLE `contents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `dynamic_sections`
--
ALTER TABLE `dynamic_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dynamic_sections_type_parent_id` (`type`,`parent_id`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `footer_layouts`
--
ALTER TABLE `footer_layouts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `footer_layouts_status` (`status`),
  ADD KEY `footer_layouts_is_default` (`is_default`);

--
-- Indexes for table `header_layouts`
--
ALTER TABLE `header_layouts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `header_layouts_status` (`status`),
  ADD KEY `header_layouts_is_default` (`is_default`);

--
-- Indexes for table `main_categories`
--
ALTER TABLE `main_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `main_categories_name` (`name`);

--
-- Indexes for table `main_category_services`
--
ALTER TABLE `main_category_services`
  ADD PRIMARY KEY (`main_category_id`,`service_id`),
  ADD KEY `main_category_services_service_id` (`service_id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `file_name` (`file_name`),
  ADD UNIQUE KEY `path` (`path`),
  ADD KEY `media_file_type` (`file_type`),
  ADD KEY `media_created_at` (`createdAt`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menu_id` (`menu_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `page_details`
--
ALTER TABLE `page_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `page_details_page_id` (`page_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `redirects`
--
ALTER TABLE `redirects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `from_path` (`from_path`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `search_keywords`
--
ALTER TABLE `search_keywords`
  ADD PRIMARY KEY (`id`),
  ADD KEY `article_id` (`article_id`),
  ADD KEY `search_keywords_keyword` (`keyword`);

--
-- Indexes for table `seo_meta`
--
ALTER TABLE `seo_meta`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `seo_meta_entity_type_entity_id` (`entity_type`,`entity_id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `services_name` (`name`);

--
-- Indexes for table `service_categories`
--
ALTER TABLE `service_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `service_documents`
--
ALTER TABLE `service_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `service_faqs`
--
ALTER TABLE `service_faqs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `service_features`
--
ALTER TABLE `service_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `service_locations`
--
ALTER TABLE `service_locations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `service_locations_service_id_city_id` (`service_id`,`city_id`),
  ADD KEY `city_id` (`city_id`);

--
-- Indexes for table `service_processes`
--
ALTER TABLE `service_processes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `service_sub_services`
--
ALTER TABLE `service_sub_services`
  ADD PRIMARY KEY (`service_id`,`sub_service_id`),
  ADD KEY `service_sub_services_sub_service_id` (`sub_service_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key` (`key`);

--
-- Indexes for table `states`
--
ALTER TABLE `states`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sub_categories_category_id_slug` (`category_id`,`slug`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `sub_services`
--
ALTER TABLE `sub_services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `sub_services_name` (`name`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trending_articles`
--
ALTER TABLE `trending_articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `article_id` (`article_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `users_role_id_foreign_idx` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `article_contents`
--
ALTER TABLE `article_contents`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `authors`
--
ALTER TABLE `authors`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blog_categories`
--
ALTER TABLE `blog_categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blog_tags`
--
ALTER TABLE `blog_tags`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_forms`
--
ALTER TABLE `contact_forms`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contents`
--
ALTER TABLE `contents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dynamic_sections`
--
ALTER TABLE `dynamic_sections`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `footer_layouts`
--
ALTER TABLE `footer_layouts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `header_layouts`
--
ALTER TABLE `header_layouts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `main_categories`
--
ALTER TABLE `main_categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `page_details`
--
ALTER TABLE `page_details`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `redirects`
--
ALTER TABLE `redirects`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `search_keywords`
--
ALTER TABLE `search_keywords`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `seo_meta`
--
ALTER TABLE `seo_meta`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `service_categories`
--
ALTER TABLE `service_categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_documents`
--
ALTER TABLE `service_documents`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_faqs`
--
ALTER TABLE `service_faqs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_features`
--
ALTER TABLE `service_features`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_locations`
--
ALTER TABLE `service_locations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_processes`
--
ALTER TABLE `service_processes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `states`
--
ALTER TABLE `states`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sub_categories`
--
ALTER TABLE `sub_categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sub_services`
--
ALTER TABLE `sub_services`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trending_articles`
--
ALTER TABLE `trending_articles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `articles_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `article_contents`
--
ALTER TABLE `article_contents`
  ADD CONSTRAINT `article_contents_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `article_tags`
--
ALTER TABLE `article_tags`
  ADD CONSTRAINT `article_tags_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `article_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`blog_category_id`) REFERENCES `blog_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blogs_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `blog_tag_mapping`
--
ALTER TABLE `blog_tag_mapping`
  ADD CONSTRAINT `blog_tag_mapping_ibfk_1` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `blog_tag_mapping_ibfk_2` FOREIGN KEY (`blog_tag_id`) REFERENCES `blog_tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cities`
--
ALTER TABLE `cities`
  ADD CONSTRAINT `cities_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `main_category_services`
--
ALTER TABLE `main_category_services`
  ADD CONSTRAINT `main_category_services_ibfk_1` FOREIGN KEY (`main_category_id`) REFERENCES `main_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `main_category_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `menu_items_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pages`
--
ALTER TABLE `pages`
  ADD CONSTRAINT `pages_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `pages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `page_details`
--
ALTER TABLE `page_details`
  ADD CONSTRAINT `page_details_ibfk_1` FOREIGN KEY (`page_id`) REFERENCES `pages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `search_keywords`
--
ALTER TABLE `search_keywords`
  ADD CONSTRAINT `search_keywords_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `service_documents`
--
ALTER TABLE `service_documents`
  ADD CONSTRAINT `service_documents_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `service_faqs`
--
ALTER TABLE `service_faqs`
  ADD CONSTRAINT `service_faqs_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `service_features`
--
ALTER TABLE `service_features`
  ADD CONSTRAINT `service_features_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `service_locations`
--
ALTER TABLE `service_locations`
  ADD CONSTRAINT `service_locations_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `service_locations_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `service_processes`
--
ALTER TABLE `service_processes`
  ADD CONSTRAINT `service_processes_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `service_sub_services`
--
ALTER TABLE `service_sub_services`
  ADD CONSTRAINT `service_sub_services_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `service_sub_services_ibfk_2` FOREIGN KEY (`sub_service_id`) REFERENCES `sub_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD CONSTRAINT `sub_categories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sub_categories_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `sub_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `trending_articles`
--
ALTER TABLE `trending_articles`
  ADD CONSTRAINT `trending_articles_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_role_id_foreign_idx` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
