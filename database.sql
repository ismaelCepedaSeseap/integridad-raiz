-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-02-2026 a las 23:17:31
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `integridadraiz`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados`
--

CREATE TABLE `estados` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `activo` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados`
--

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `muro`
--

CREATE TABLE `muro` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `compromiso` varchar(500) DEFAULT NULL,
  `fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `muro`
--

INSERT INTO `muro` (`id`, `nombre`, `estado`, `compromiso`, `fecha`) VALUES
(1, 'Rosa Fernández', 'Durango', 'Me comprometo a no tirar chicles en la banqueta de mi colonia', '2026-02-16'),
(2, 'Rodrigo Carranza Juárez', 'Baja California Sur', 'Me comprometo a echarle ganas a la escuela', '2026-02-16'),
(4, 'Ismael Cepeda', 'Chihuahua', 'Ayudar a mamá a lavar los trastes', '2026-02-16'),
(5, 'Daniel Martínez', 'Baja California', 'Estudiar más para mis exámenes de la universidad', '2026-02-16'),
(6, 'Samantha Flores', 'Chiapas', 'Conservar en mejor estado los bosques de mi comunidad', '2026-02-16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `activo` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`, `descripcion`, `activo`) VALUES
(1, 'Super administrador', 'Puede realizar cualquier acción', b'1'),
(2, 'Administrador', 'Administrador parcial por estado', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `slides`
--

CREATE TABLE `slides` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `subtitulo` varchar(128) DEFAULT NULL,
  `descripcion` varchar(512) DEFAULT NULL,
  `cta_text` varchar(64) DEFAULT NULL,
  `cta_url` varchar(512) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `diseno` tinyint(4) NOT NULL,
  `activo` tinyint(4) DEFAULT 1,
  `orden` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `slides`
--

INSERT INTO `slides` (`id`, `titulo`, `subtitulo`, `descripcion`, `cta_text`, `cta_url`, `imagen`, `diseno`, `activo`, `orden`) VALUES
(1, 'Sembrando honestidad, cosechamos integridad.', 'SEA Puebla presenta', 'Cada acción cuenta para construir un país más justo y transparente.', 'Explorar el Árbol', '#actividades', 'images/logo.png', 1, 1, 1),
(2, 'Tu voz es la fuerza del cambio.', 'Compromiso Ciudadano', 'Participa activamente en la vigilancia de los recursos públicos.', 'Conoce más', '#', 'images/logo.png', 2, 1, 2),
(3, 'Transparencia que inspira', NULL, 'Sumamos voluntades para fortalecer la integridad pública.', 'Ver galería', '#galeria', 'images/rally/f_01.jpg', 3, 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `primerApellido` varchar(100) NOT NULL,
  `segundoApellido` varchar(100) DEFAULT NULL,
  `estado` int(11) NOT NULL,
  `rol` int(11) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `pass` varchar(1000) NOT NULL,
  `activo` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `primerApellido`, `segundoApellido`, `estado`, `rol`, `correo`, `pass`, `activo`) VALUES
(1, 'Rodrigo', 'Carranza', 'Juárez', 21, 1, 'roy.wmun@gmail.com', '$2y$10$JF.6BsgjZsoAhUmEttLwy./N70gQ/qBDOtfsfXV4I84TaC2TIIpHa', b'1');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `muro`
--
ALTER TABLE `muro`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `slides`
--
ALTER TABLE `slides`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rol` (`rol`),
  ADD KEY `fk_usuario_estado` (`estado`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `estados`
--
ALTER TABLE `estados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `muro`
--
ALTER TABLE `muro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `slides`
--
ALTER TABLE `slides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuario_estado` FOREIGN KEY (`estado`) REFERENCES `estados` (`id`),
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
