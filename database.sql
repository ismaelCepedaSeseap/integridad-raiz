-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         12.1.2-MariaDB - MariaDB Server
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Volcando estructura para tabla seapuebl_integridadRaiz_desarrollo.estados
CREATE TABLE IF NOT EXISTS `estados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `url_logo` varchar(255) DEFAULT NULL,
  `url_sitio` varchar(255) DEFAULT NULL,
  `activo` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla seapuebl_integridadRaiz_desarrollo.estados: ~32 rows (aproximadamente)
REPLACE INTO `estados` (`id`, `nombre`, `url_logo`, `url_sitio`, `activo`) VALUES
	(1, 'Aguascalientes', NULL, NULL, b'0'),
	(2, 'Baja California', NULL, NULL, b'0'),
	(3, 'Baja California Sur', NULL, NULL, b'0'),
	(4, 'Campeche', NULL, NULL, b'0'),
	(5, 'Chiapas', NULL, NULL, b'0'),
	(6, 'Chihuahua', NULL, NULL, b'0'),
	(7, 'Coahuila', NULL, NULL, b'0'),
	(8, 'Colima', NULL, NULL, b'0'),
	(9, 'Ciudad de México', NULL, NULL, b'0'),
	(10, 'Durango', NULL, NULL, b'0'),
	(11, 'Guanajuato', NULL, NULL, b'0'),
	(12, 'Guerrero', NULL, NULL, b'0'),
	(13, 'Hidalgo', 'assets/images/logo_hidalgo.png', 'https://sistemaanticorrupcion.hidalgo.gob.mx/', b'1'),
	(14, 'Jalisco', NULL, NULL, b'0'),
	(15, 'México', NULL, NULL, b'0'),
	(16, 'Michoacán', NULL, NULL, b'0'),
	(17, 'Morelos', NULL, NULL, b'0'),
	(18, 'Nayarit', NULL, NULL, b'0'),
	(19, 'Nuevo León', NULL, NULL, b'0'),
	(20, 'Oaxaca', NULL, NULL, b'0'),
	(21, 'Puebla', 'assets/images/SeseapPuebla.png', 'https://seseap.puebla.gob.mx/', b'1'),
	(22, 'Querétaro', NULL, NULL, b'0'),
	(23, 'Quintana Roo', NULL, NULL, b'0'),
	(24, 'San Luis Potosí', NULL, NULL, b'0'),
	(25, 'Sinaloa', NULL, NULL, b'0'),
	(26, 'Sonora', NULL, NULL, b'0'),
	(27, 'Tabasco', NULL, NULL, b'0'),
	(28, 'Tamaulipas', NULL, NULL, b'0'),
	(29, 'Tlaxcala', 'assets/images/logo_tlaxcala.png', 'https://saetlax.org/', b'1'),
	(30, 'Veracruz', 'assets/images/logos/6202c6d2c78b68f48b1111e46285e760.png', 'https://seseav.veracruz.gob.mx/?fbclid=IwY2xjawQKry5leHRuA2FlbQIxMABicmlkETIzMGFEd202UFQwZHd0M1FWc3', b'1'),
	(31, 'Yucatán', NULL, NULL, b'0'),
	(32, 'Zacatecas', NULL, NULL, b'0');

-- Volcando estructura para tabla seapuebl_integridadRaiz_desarrollo.redes_sociales
CREATE TABLE IF NOT EXISTS `redes_sociales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `clave` varchar(50) NOT NULL,
  `icono` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla seapuebl_integridadRaiz_desarrollo.redes_sociales: ~6 rows (aproximadamente)
REPLACE INTO `redes_sociales` (`id`, `nombre`, `clave`, `icono`) VALUES
	(1, 'Facebook', 'facebook', 'fa-facebook'),
	(2, 'Twitter', 'twitter', 'fa-twitter'),
	(3, 'Instagram', 'instagram', 'fa-instagram'),
	(4, 'TikTok', 'tiktok', 'fa-tiktok'),
	(5, 'YouTube', 'youtube', 'fa-youtube'),
	(6, 'Spotify', 'spotify', 'fa-spotify');

-- Volcando estructura para tabla seapuebl_integridadRaiz_desarrollo.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `activo` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla seapuebl_integridadRaiz_desarrollo.roles: ~2 rows (aproximadamente)
REPLACE INTO `roles` (`id`, `nombre`, `descripcion`, `activo`) VALUES
	(1, 'Super administrador', 'Puede realizar cualquier acción', b'1'),
	(2, 'Administrador', 'Administrador parcial por estado', b'1');

-- Volcando estructura para tabla seapuebl_integridadRaiz_desarrollo.sliders
CREATE TABLE IF NOT EXISTS `sliders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('complex','simple') NOT NULL DEFAULT 'complex',
  `background` varchar(255) DEFAULT NULL,
  `backgroundImage` varchar(255) DEFAULT NULL,
  `badge` varchar(255) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `orden` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla seapuebl_integridadRaiz_desarrollo.sliders: ~3 rows (aproximadamente)
REPLACE INTO `sliders` (`id`, `type`, `background`, `backgroundImage`, `badge`, `title`, `description`, `image`, `activo`, `orden`, `created_at`) VALUES
	(1, 'complex', 'linear-gradient(to bottom, #a5d8ff 0%, #f0f9ff 40%, #ffffff 100%)', '', 'SESEA PUEBLA presenta', 'Sembrando <span class="text-green-600">honestidad</span>, cosechamos <span class="text-green-600">integridad.</span>', 'Cada acción cuenta para construir un país más justo y transparente.', 'assets/images/logo.png', 1, 0, '2026-02-25 17:18:53'),
	(2, 'simple', NULL, 'assets/images/uploads/base_piramides.jpeg', NULL, NULL, NULL, NULL, 1, 1, '2026-02-25 17:18:53'),
	(3, 'simple', '', 'assets/images/banner2.png', '', '', '', '', 1, 2, '2026-02-25 17:18:53'),
	(5, 'simple', '', 'assets/images/uploads/sliders/bg_1772049711_watermarked-4b7483de-907f-4a26-b29b-0f5af325528a.jpg', '', '', '', '', 1, 3, '2026-02-25 20:01:51');

-- Volcando estructura para tabla seapuebl_integridadRaiz_desarrollo.slides
CREATE TABLE IF NOT EXISTS `slides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `subtitulo` varchar(128) DEFAULT NULL,
  `descripcion` varchar(512) DEFAULT NULL,
  `cta_text` varchar(64) DEFAULT NULL,
  `cta_url` varchar(512) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `diseno` tinyint(4) NOT NULL,
  `activo` tinyint(4) DEFAULT 1,
  `orden` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla seapuebl_integridadRaiz_desarrollo.slides: ~3 rows (aproximadamente)
REPLACE INTO `slides` (`id`, `titulo`, `subtitulo`, `descripcion`, `cta_text`, `cta_url`, `imagen`, `diseno`, `activo`, `orden`) VALUES
	(1, 'Sembrando honestidad, cosechamos integridad.', 'SEA Puebla presenta', 'Cada acción cuenta para construir un país más justo y transparente.', 'Explorar el Árbol', '#actividades', 'images/logo.png', 1, 1, 1),
	(2, 'Tu voz es la fuerza del cambio.', 'Compromiso Ciudadano', 'Participa activamente en la vigilancia de los recursos públicos.', 'Conoce más', '#', 'images/logo.png', 2, 1, 2),
	(3, 'Transparencia que inspira', NULL, 'Sumamos voluntades para fortalecer la integridad pública.', 'Ver galería', '#galeria', 'images/rally/f_01.jpg', 1, 1, 3);

-- Volcando estructura para tabla seapuebl_integridadRaiz_desarrollo.muro
CREATE TABLE IF NOT EXISTS `muro` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `compromiso` varchar(500) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla seapuebl_integridadRaiz_desarrollo.muro: ~5 rows (aproximadamente)
REPLACE INTO `muro` (`id`, `nombre`, `estado`, `compromiso`, `fecha`) VALUES
	(1, 'Rosa Fernández', 'Durango', 'Me comprometo a no tirar chicles en la banqueta de mi colonia', '2026-02-16'),
	(2, 'Rodrigo Carranza Juárez', 'Baja California Sur', 'Me comprometo a echarle ganas a la escuela', '2026-02-16'),
	(4, 'Ismael Cepeda', 'Chihuahua', 'Ayudar a mamá a lavar los trastes', '2026-02-16'),
	(5, 'Daniel Martínez', 'Baja California', 'Estudiar más para mis exámenes de la universidad', '2026-02-16'),
	(6, 'Samantha Flores', 'Chiapas', 'Conservar en mejor estado los bosques de mi comunidad', '2026-02-16');

-- Volcando estructura para tabla seapuebl_integridadRaiz_desarrollo.estado_redes_sociales
CREATE TABLE IF NOT EXISTS `estado_redes_sociales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `estado_id` int(11) NOT NULL,
  `red_social_id` int(11) NOT NULL,
  `url` varchar(500) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ers_estado` (`estado_id`),
  KEY `fk_ers_red` (`red_social_id`),
  CONSTRAINT `fk_ers_estado` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`id`),
  CONSTRAINT `fk_ers_red` FOREIGN KEY (`red_social_id`) REFERENCES `redes_sociales` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla seapuebl_integridadRaiz_desarrollo.estado_redes_sociales: ~12 rows (aproximadamente)
REPLACE INTO `estado_redes_sociales` (`id`, `estado_id`, `red_social_id`, `url`) VALUES
	(1, 21, 1, 'https://www.facebook.com/SEAPUEBLA1?mibextid=ZbWKwL'),
	(2, 21, 2, 'https://x.com/seapuebla/'),
	(3, 21, 3, 'https://www.instagram.com/sea_puebla/'),
	(4, 21, 4, 'https://www.tiktok.com/@seapueblaoficial'),
	(5, 21, 5, 'https://www.youtube.com/@seapuebla4817'),
	(6, 21, 6, 'https://open.spotify.com/show/3ZxAug5umuyVaSaHyIvtMa'),
	(7, 13, 1, 'https://www.facebook.com/people/Secretar%C3%ADa-T%C3%A9cnica-del-Sistema-Estatal-Anticorrupci%C3%B3n-de-Hidalgo/100069229988952/?rdid=67CJr7dNFRz4ZqOP&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DioWw8dQA%2F'),
	(8, 29, 1, 'https://www.facebook.com/SAETLAX/'),
	(9, 29, 5, 'https://www.youtube.com/@sesaet9073'),
	(33, 30, 1, 'https://www.facebook.com/SESEAVEROficial'),
	(34, 30, 2, 'https://x.com/SESEAVOficial'),
	(35, 30, 3, 'https://www.instagram.com/se.seaver?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==');

-- Volcando estructura para tabla seapuebl_integridadRaiz_desarrollo.guardianes
CREATE TABLE IF NOT EXISTS `guardianes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `estado_id` int(11) NOT NULL,
  `slogan` varchar(255) DEFAULT NULL,
  `video_src` varchar(255) DEFAULT NULL,
  `poster_src` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `fk_guardian_estado` (`estado_id`),
  CONSTRAINT `fk_guardian_estado` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla seapuebl_integridadRaiz_desarrollo.guardianes: ~5 rows (aproximadamente)
REPLACE INTO `guardianes` (`id`, `estado_id`, `slogan`, `video_src`, `poster_src`, `activo`) VALUES
	(1, 21, '"Principios que transforman"', 'assets/images/Puebla.mp4', 'assets/images/Puebla.jpeg', 1),
	(2, 13, '"La honestidad nos une"', 'assets/images/Hidalgo.mp4', 'assets/images/Hidalgo.jpeg', 1),
	(3, 29, '"TRANSPARENCIA QUE DA CONFIANZA"', 'assets/images/Tlaxcala.mp4', 'assets/images/Tlaxcala.jpeg', 1),
	(4, 30, '"Voz valiente, justicia presente."', 'assets/images/Veracruz.mp4', 'assets/images/Veracruz.png', 1),
	(5, 21, '"Principios que transforman"', 'assets/images/uploads/vid_699e321774652.mp4', 'assets/images/uploads/img_699e321774fa5.png', 0);

-- Volcando estructura para tabla seapuebl_integridadRaiz_desarrollo.slider_buttons
CREATE TABLE IF NOT EXISTS `slider_buttons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slider_id` int(11) NOT NULL,
  `text` varchar(100) NOT NULL,
  `url` varchar(255) NOT NULL,
  `icon` varchar(50) DEFAULT 'play-circle',
  `style` enum('primary','glass','outline','white') DEFAULT 'primary',
  `videoSrc` varchar(255) DEFAULT NULL,
  `position_top` varchar(50) DEFAULT NULL,
  `position_left` varchar(50) DEFAULT NULL,
  `position_right` varchar(50) DEFAULT NULL,
  `position_bottom` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `slider_id` (`slider_id`),
  CONSTRAINT `1` FOREIGN KEY (`slider_id`) REFERENCES `sliders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla seapuebl_integridadRaiz_desarrollo.slider_buttons: ~4 rows (aproximadamente)
REPLACE INTO `slider_buttons` (`id`, `slider_id`, `text`, `url`, `icon`, `style`, `videoSrc`, `position_top`, `position_left`, `position_right`, `position_bottom`) VALUES
	(2, 2, 'Ver Video', '#', 'play-circle', 'glass', 'assets/images/Integridad Publico.mp4', NULL, NULL, NULL, NULL),
	(5, 3, 'Muro de Compromisos11', '#muro', 'pencil-line', 'primary', 'null', NULL, NULL, NULL, NULL),
	(39, 1, 'Explorar el Árbol', '#actividades', 'heart', 'primary', '', '', '', '', ''),
	(52, 5, 'Descargar', 'www.algo.com', 'play-circle', 'outline', '', '436px', '807px', '', '');

-- Volcando estructura para tabla seapuebl_integridadRaiz_desarrollo.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `primerApellido` varchar(100) NOT NULL,
  `segundoApellido` varchar(100) DEFAULT NULL,
  `estado` int(11) NOT NULL,
  `rol` int(11) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `pass` varchar(1000) NOT NULL,
  `activo` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `rol` (`rol`),
  KEY `fk_usuario_estado` (`estado`),
  CONSTRAINT `fk_usuario_estado` FOREIGN KEY (`estado`) REFERENCES `estados` (`id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla seapuebl_integridadRaiz_desarrollo.usuarios: ~2 rows (aproximadamente)
REPLACE INTO `usuarios` (`id`, `nombre`, `primerApellido`, `segundoApellido`, `estado`, `rol`, `correo`, `pass`, `activo`) VALUES
	(1, 'Rodrigo', 'Carranza', 'Juárez', 21, 1, 'roy.wmun@gmail.com', '$2y$10$JF.6BsgjZsoAhUmEttLwy./N70gQ/qBDOtfsfXV4I84TaC2TIIpHa', b'1'),
	(2, 'Ismael', 'Cepeda', '', 21, 1, 'icepeda@gmail.com', '$2y$10$EgXpB0acNM5PJgLlpccPNut6bSqT1bdff60CgJEYrNhvIO4kg5pXS', b'1');

-- Volcando estructura para tabla seapuebl_integridadRaiz_desarrollo.tree_tips
CREATE TABLE IF NOT EXISTS `tree_tips` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `topic` varchar(120) NOT NULL,
  `tip_text` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla seapuebl_integridadRaiz_desarrollo.tree_tips: ~50 rows (aproximadamente)
REPLACE INTO `tree_tips` (`id`, `topic`, `tip_text`, `is_active`, `display_order`) VALUES
	(1, 'Honestidad', 'Di siempre la verdad, incluso cuando sea difícil.', 1, 1),
	(2, 'Respeto', 'Trata a los demás como te gustaría ser tratado.', 1, 2),
	(3, 'Justicia', 'Asegúrate de que todos reciban lo que les corresponde por igual.', 1, 3),
	(4, 'Responsabilidad', 'Cumple con tus deberes sin que nadie te lo recuerde.', 1, 4),
	(5, 'Lealtad', 'Apoya a tus amigos y valores en todo momento.', 1, 5),
	(6, 'Sinceridad', 'Expresa tus sentimientos con claridad y honestidad.', 1, 6),
	(7, 'Ética', 'Haz lo correcto aunque nadie te esté mirando.', 1, 7),
	(8, 'Empatía', 'Ponte en el lugar de los demás antes de juzgar.', 1, 8),
	(9, 'Transparencia', 'Sé claro en tus acciones y decisiones públicas.', 1, 9),
	(10, 'Compromiso', 'Mantén tu palabra una vez que la has dado.', 1, 10),
	(11, 'Solidaridad', 'Ayuda a quienes lo necesitan sin esperar nada a cambio.', 1, 11),
	(12, 'Humildad', 'Reconoce tus errores y aprende de ellos.', 1, 12),
	(13, 'Gratitud', 'Agradece las buenas acciones de los demás.', 1, 13),
	(14, 'Tolerancia', 'Respeta las opiniones diferentes a la tuya.', 1, 14),
	(15, 'Perseverancia', 'No te rindas ante los obstáculos en el camino correcto.', 1, 15),
	(16, 'Paciencia', 'Acepta que las cosas llevan su tiempo.', 1, 16),
	(17, 'Valentía', 'Defiende lo que es justo, aunque sea impopular.', 1, 17),
	(18, 'Cooperación', 'Trabaja en equipo para lograr un bien común.', 1, 18),
	(19, 'Generosidad', 'Comparte lo que tienes con alegría.', 1, 19),
	(20, 'Integridad', 'Sé coherente entre lo que dices y lo que haces.', 1, 20),
	(21, 'Autodisciplina', 'Controla tus impulsos para actuar correctamente.', 1, 21),
	(22, 'Confianza', 'Actúa de forma que los demás puedan creer en ti.', 1, 22),
	(23, 'Prudencia', 'Piensa antes de actuar para evitar daños.', 1, 23),
	(24, 'Igualdad', 'Valora a todas las personas por su humanidad.', 1, 24),
	(25, 'Fraternidad', 'Trata a tus semejantes como hermanos.', 1, 25),
	(26, 'Dignidad', 'Respeta tu propio valor y el de los demás.', 1, 26),
	(27, 'Cortesía', 'Usa siempre las palabras mágicas: por favor y gracias.', 1, 27),
	(28, 'Honradez', 'No tomes lo que no te pertenece.', 1, 28),
	(29, 'Rectitud', 'Sigue las normas de convivencia con agrado.', 1, 29),
	(30, 'Servicio', 'Busca oportunidades para ser útil a tu comunidad.', 1, 30),
	(31, 'Ciudadanía', 'Cuida los espacios públicos como si fueran tu casa.', 1, 31),
	(32, 'Ecología', 'Protege la naturaleza y sus recursos.', 1, 32),
	(33, 'Puntualidad', 'Respeta el tiempo de los demás llegando a tiempo.', 1, 33),
	(34, 'Optimismo', 'Busca el lado positivo de cada situación.', 1, 34),
	(35, 'Amistad', 'Cultiva lazos basados en la verdad y el cariño.', 1, 35),
	(36, 'Compañerismo', 'Apoya a tus colegas en las tareas diarias.', 1, 36),
	(37, 'Liderazgo', 'Guía a otros con el ejemplo positivo.', 1, 37),
	(38, 'Sabiduría', 'Aprende algo nuevo cada día para ser mejor.', 1, 38),
	(39, 'Paz', 'Resuelve los conflictos mediante el diálogo.', 1, 39),
	(40, 'Bondad', 'Haz el bien sin mirar a quién.', 1, 40),
	(41, 'Moderación', 'Evita los excesos en tus palabras y acciones.', 1, 41),
	(42, 'Orden', 'Mantén tu entorno organizado para pensar mejor.', 1, 42),
	(43, 'Esfuerzo', 'Da lo mejor de ti en cada tarea que realices.', 1, 43),
	(44, 'Flexibilidad', 'Adáptate a los cambios con buena actitud.', 1, 44),
	(45, 'Creatividad', 'Usa tu imaginación para resolver problemas.', 1, 45),
	(46, 'Curiosidad', 'Nunca dejes de preguntar el porqué de las cosas.', 1, 46),
	(47, 'Compasión', 'Siente el dolor ajeno y busca aliviarlo.', 1, 47),
	(48, 'Audacia', 'Atrévete a innovar por el camino del bien.', 1, 48),
	(49, 'Sacrificio', 'Renuncia a algo propio por un beneficio mayor.', 1, 49),
	(50, 'Alegría', 'Contagia tu felicidad al actuar con integridad.', 1, 50);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
