/** migrate **/

CREATE TABLE `users` (
     `id` bigint unsigned NOT NULL AUTO_INCREMENT,
     `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
     `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
     `email_verified_at` timestamp NULL DEFAULT NULL,
     `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
     `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
     `created_at` timestamp NOT NULL DEFAULT NOW(),
     `updated_at` timestamp NOT NULL DEFAULT NOW(),
     PRIMARY KEY (`id`),


     KEY `users_email_index` (`email`),
)  ENGINE=InnoDB AUTO_INCREMENT=375 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/** role-back **/

DROP TABLE IF EXISTS `users`;