-- Base de datos unificada "Integridad desde la Raíz"
-- Combina el sistema de usuarios nuevo con la estructura del sitio existente

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `integridadraiz` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `integridadraiz`;

-- --------------------------------------------------------
-- 1. TABLA ESTADOS (Unificada)
-- Combina la lista completa de 32 estados con los campos de slug/logo del sitio
-- --------------------------------------------------------
DROP TABLE IF EXISTS `estados`;
CREATE TABLE `estados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `slug` varchar(100) DEFAULT NULL,
  `url_logo` varchar(255) DEFAULT NULL,
  `url_sitio` varchar(255) DEFAULT NULL,
  `activo` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insertar los 32 estados (Base del nuevo sistema)
INSERT INTO `estados` (`id`, `nombre`, `activo`) VALUES 
(1, 'Aguascalientes', b'1'), 
(2, 'Baja California', b'0'), 
(3, 'Baja California Sur', b'0'), 
(4, 'Campeche', b'0'), 
(5, 'Chiapas', b'0'), 
(6, 'Chihuahua', b'0'), 
(7, 'Coahuila', b'0'), 
(8, 'Colima', b'0'), 
(9, 'Ciudad de México', b'0'), 
(10, 'Durango', b'0'), 
(11, 'Guanajuato', b'0'), 
(12, 'Guerrero', b'0'), 
(13, 'Hidalgo', b'1'), 
(14, 'Jalisco', b'0'), 
(15, 'México', b'0'), 
(16, 'Michoacán', b'0'), 
(17, 'Morelos', b'0'), 
(18, 'Nayarit', b'0'), 
(19, 'Nuevo León', b'0'), 
(20, 'Oaxaca', b'0'), 
(21, 'Puebla', b'1'), 
(22, 'Querétaro', b'0'), 
(23, 'Quintana Roo', b'0'), 
(24, 'San Luis Potosí', b'0'), 
(25, 'Sinaloa', b'0'), 
(26, 'Sonora', b'0'), 
(27, 'Tabasco', b'0'), 
(28, 'Tamaulipas', b'0'), 
(29, 'Tlaxcala', b'1'), 
(30, 'Veracruz', b'0'), 
(31, 'Yucatán', b'0'), 
(32, 'Zacatecas', b'0');

-- Actualizar los estados activos con la información del sitio web (Slugs y Logos)
-- Puebla (ID 21)
UPDATE `estados` SET `slug`='puebla', `url_logo`='images/estados/puebla.png', `url_sitio`='https://www.seapuebla.org.mx/' WHERE `id`=21;
-- Hidalgo (ID 13)
UPDATE `estados` SET `slug`='hidalgo', `url_logo`='images/estados/hidalgo.png', `url_sitio`='https://www.seahidalgo.org.mx/' WHERE `id`=13;
-- Tlaxcala (ID 29)
UPDATE `estados` SET `slug`='tlaxcala', `url_logo`='images/estados/tlaxcala.png' WHERE `id`=29;
-- Veracruz (ID 30)
UPDATE `estados` SET `slug`='veracruz', `url_logo`='images/estados/veracruz.png' WHERE `id`=30;
-- Oaxaca (ID 20)
UPDATE `estados` SET `slug`='oaxaca', `url_logo`='images/estados/oaxaca.png' WHERE `id`=20;
-- Ciudad de México (ID 9)
UPDATE `estados` SET `slug`='cdmx', `url_logo`='images/estados/cdmx.png' WHERE `id`=9;

-- --------------------------------------------------------
-- 2. ROLES Y USUARIOS (Sistema Nuevo)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` ( 
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `nombre` varchar(100) NOT NULL, 
  `descripcion` varchar(500) DEFAULT NULL, 
  `activo` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; 

INSERT INTO `roles` (`id`, `nombre`, `descripcion`, `activo`) VALUES 
(1, 'Super administrador', 'Puede realizar cualquier acción', b'1'), 
(2, 'Administrador', 'Administrador parcial por estado', b'1'); 

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` ( 
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; 

INSERT INTO `usuarios` (`id`, `nombre`, `primerApellido`, `segundoApellido`, `estado`, `rol`, `correo`, `pass`, `activo`) VALUES 
(1, 'Rodrigo', 'Carranza', 'Juárez', 21, 1, 'roy.wmun@gmail.com', '$2y$10$JF.6BsgjZsoAhUmEttLwy./N70gQ/qBDOtfsfXV4I84TaC2TIIpHa', b'1'); 

-- --------------------------------------------------------
-- 3. MURO (Sistema Nuevo)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `muro`;
CREATE TABLE `muro` ( 
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `nombre` varchar(10) DEFAULT NULL, 
  `estado` varchar(50) DEFAULT NULL, 
  `compromiso` varchar(500) DEFAULT NULL, 
  `fecha` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; 

-- --------------------------------------------------------
-- 4. TABLAS DEL SITIO WEB (Restauradas)
-- --------------------------------------------------------

-- Redes Sociales
DROP TABLE IF EXISTS `redes_sociales`;
CREATE TABLE `redes_sociales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `estado_id` int(11) NOT NULL,
  `plataforma` varchar(50) NOT NULL COMMENT 'facebook, instagram, youtube, etc.',
  `url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `estado_id` (`estado_id`),
  CONSTRAINT `fk_redes_sociales_estado` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Sliders
DROP TABLE IF EXISTS `sliders`;
CREATE TABLE `sliders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` enum('simple','complejo') NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text,
  `url_imagen` varchar(255) DEFAULT NULL,
  `gradiente_fondo` varchar(255) DEFAULT NULL,
  `orden` int(11) DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `activo` (`activo`),
  KEY `orden` (`orden`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `sliders` (`id`, `tipo`, `titulo`, `descripcion`, `url_imagen`, `gradiente_fondo`, `orden`, `activo`) VALUES
(1, 'complejo', 'Integridad desde la Raíz', 'Conoce las historias, valores y acciones que fortalecen la honestidad.', 'images/slider/hero.jpg', 'from-green-700 via-emerald-600 to-lime-500', 1, 1);

-- Slider Botones
DROP TABLE IF EXISTS `slider_botones`;
CREATE TABLE `slider_botones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slider_id` int(11) NOT NULL,
  `texto` varchar(50) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `icono` varchar(50) DEFAULT NULL,
  `estilo` varchar(20) DEFAULT NULL,
  `video_src` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `slider_id` (`slider_id`),
  CONSTRAINT `fk_slider_botones_slider` FOREIGN KEY (`slider_id`) REFERENCES `sliders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Eventos
DROP TABLE IF EXISTS `eventos`;
CREATE TABLE `eventos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `visible_inicio` tinyint(1) DEFAULT 0,
  `badge_inicio` varchar(50) DEFAULT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text,
  `fecha` date DEFAULT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `estado_id` int(11) NOT NULL,
  `imagen_principal` varchar(255) DEFAULT NULL,
  `url_video` varchar(255) DEFAULT NULL,
  `texto_impacto` varchar(255) DEFAULT NULL,
  `texto_pilares_count` varchar(255) DEFAULT NULL,
  `decoracion_top_left` varchar(50) DEFAULT NULL,
  `decoracion_bottom_right` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `estado_id` (`estado_id`),
  CONSTRAINT `fk_eventos_estado` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Galeria Eventos
DROP TABLE IF EXISTS `galeria_eventos`;
CREATE TABLE `galeria_eventos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `evento_id` int(11) NOT NULL,
  `url_imagen` varchar(255) NOT NULL,
  `tipo` enum('foto','banner') DEFAULT 'foto',
  PRIMARY KEY (`id`),
  KEY `evento_id` (`evento_id`),
  CONSTRAINT `fk_galeria_evento` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Momentos Eventos
DROP TABLE IF EXISTS `momentos_eventos`;
CREATE TABLE `momentos_eventos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `evento_id` int(11) NOT NULL,
  `url_imagen` varchar(255) NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `anio_texto` varchar(50) DEFAULT NULL,
  `margin_top` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `evento_id` (`evento_id`),
  CONSTRAINT `fk_momentos_evento` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Videos Cine
DROP TABLE IF EXISTS `videos_cine`;
CREATE TABLE `videos_cine` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `estado_id` int(11) NOT NULL,
  `tipo_fuente` enum('youtube','local') NOT NULL,
  `youtube_id` varchar(50) DEFAULT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text,
  `hashtag` varchar(100) DEFAULT NULL,
  `url_video` varchar(255) DEFAULT NULL,
  `url_poster` varchar(255) DEFAULT NULL,
  `cta_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `estado_id` (`estado_id`),
  CONSTRAINT `fk_videos_cine_estado` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Materiales
DROP TABLE IF EXISTS `materiales`;
CREATE TABLE `materiales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text,
  `tipo_archivo` varchar(50) DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `tamano_archivo` varchar(50) DEFAULT NULL,
  `estado_id` int(11) NOT NULL,
  `url_descarga` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `estado_id` (`estado_id`),
  CONSTRAINT `fk_materiales_estado` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
