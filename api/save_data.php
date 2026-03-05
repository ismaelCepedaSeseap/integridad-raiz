<?php
// ====================================================================
// INICIO: GENERADOR DE DOCUMENTACIÓN PDF
// Se activa con ?generar_pdf=1 en la URL
// ====================================================================
if (isset($_GET['generar_pdf']) && $_GET['generar_pdf'] == '1') {
    
    // NOTA: Para que este script funcione, descarga TCPDF desde https://tcpdf.org/
    // y coloca los archivos de la librería dentro de la carpeta /lib/tcpdf/
    require_once(__DIR__ . '/../lib/tcpdf/tcpdf.php');

    // Extender la clase TCPDF para crear encabezados y pies de página personalizados
    class PDF_Branded extends TCPDF {
        public function Header() {
            $image_file = __DIR__ . '/../assets/images/logo.png';
            $image_x = 15;
            $image_y = 10;
            $image_w = 40;

            // Get original image dimensions to calculate height dynamically
            list($img_w_px, $img_h_px) = @getimagesize($image_file);
            $image_h = 10; // Default height in case getimagesize fails
            if ($img_w_px > 0) {
                $image_h = ($img_h_px / $img_w_px) * $image_w;
            }

            // Draw the image
            $this->Image($image_file, $image_x, $image_y, $image_w, $image_h, 'PNG', '', 'T', false, 300, '', false, false, 0, false, false, false);

            // Set Y position for the title, 5 points below the image bottom
            $title_y = $image_y + $image_h + 5;
            
            $this->SetY($title_y);

            // Draw the title, centered
            $this->SetFont('helvetica', 'B', 14);
            $this->SetTextColor(21, 128, 61);
            $this->Cell(0, 15, 'Guía de Marca y Contenido', 0, false, 'C', 0, '', 0, false, 'M', 'M');

            // Draw the separator line below the title cell
            $line_y = $title_y + 15 + 2; // Title Y + Cell Height + padding
            $this->SetLineStyle(array('width' => 0.5, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(240, 253, 244)));
            $this->Line(15, $line_y, $this->getPageWidth() - 15, $line_y);
        }

        public function getHeaderMargin() {
            $image_file = __DIR__ . '/../assets/images/logo.png';
            $image_y = 10;
            $image_w = 40;
            
            list($img_w_px, $img_h_px) = @getimagesize($image_file);
            $image_h = 10; // Default
            if ($img_w_px > 0) {
                $image_h = ($img_h_px / $img_w_px) * $image_w;
            }

            $title_y = $image_y + $image_h + 5;
            $line_y = $title_y + 15 + 2;
            
            // Return the final Y position of the line plus some extra padding
            return $line_y + 5; 
        }

        public function Footer() {
            $this->SetY(-15);
            $this->SetFont('helvetica', 'I', 8);
            $this->SetTextColor(100, 116, 139);
            $this->Cell(0, 10, 'Integridad desde la Raíz - Página '.$this->getAliasNumPage().'/'.$this->getAliasNbPages(), 0, false, 'C', 0, '', 0, false, 'T', 'M');
        }

        // Función robusta para dibujar filas de tabla con altura dinámica
        function DrawTableRow($data, $widths, $aligns, $is_header = false) {
            // Calculate the maximum height of the row
            $row_height = 0;
            for ($i = 0; $i < count($data); $i++) {
                // The 4 is for cell padding (left and right)
                $cell_height = $this->getStringHeight($widths[$i] - 4, $data[$i]);
                if ($cell_height > $row_height) {
                    $row_height = $cell_height;
                }
            }
            $row_height += 4; // Add some padding to the row height

            // Check for page break
            $this->CheckPageBreak($row_height);

            // Get starting position
            $start_y = $this->GetY();
            $start_x = $this->GetX();
            $current_x = $start_x;

            // Set styles for header or body
            if ($is_header) {
                $this->SetFont('helvetica', 'B', 9);
                $this->SetTextColor(22, 101, 52);
                $this->SetFillColor(240, 253, 244);
            } else {
                $this->SetFont('helvetica', '', 8);
                $this->SetTextColor(51, 65, 85);
                $this->SetFillColor(255, 255, 255);
            }

            // Draw cells
            for ($i = 0; $i < count($data); $i++) {
                $this->SetXY($current_x, $start_y);
                $this->MultiCell($widths[$i], $row_height, $data[$i], 1, $aligns[$i], true, 1, '', '', true, 0, false, true, $row_height, 'M');
                $current_x += $widths[$i];
            }

            $this->SetY($start_y + $row_height);
        }
    }

    $pdf = new PDF_Branded(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

    // Metadata
    $pdf->SetCreator('SEA Puebla');
    $pdf->SetAuthor('Integridad desde la Raíz');
    $pdf->SetTitle('Guía de Marca y Contenido');

    // Headers/Footers
    $pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE, PDF_HEADER_STRING);
    $pdf->setHeaderFont(Array('helvetica', '', 10));
    $pdf->setFooterFont(Array('helvetica', '', 8));
    $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

    // Margins
    $pdf->SetMargins(15, $pdf->getHeaderMargin(), 15);
    $pdf->SetHeaderMargin(10);
    $pdf->SetFooterMargin(15);

    // Page breaks
    $pdf->SetAutoPageBreak(TRUE, 20);

    // Font subsets
    $pdf->setFontSubsetting(true);

    // --- PORTADA ---
    $pdf->AddPage();
    $pdf->Ln(20);
    $pdf->SetFont('helvetica', 'B', 28);
    $pdf->SetTextColor(21, 128, 61);
    $pdf->Cell(0, 20, 'Sistema de Gestión', 0, 1, 'C');
    $pdf->SetFont('helvetica', '', 16);
    $pdf->SetTextColor(100, 116, 139);
    $pdf->Cell(0, 10, 'Manual de Operación de Datos', 0, 1, 'C');
    
    $pdf->Ln(40);
    $image_hero = __DIR__ . '/../assets/images/web_integridad-raiz.png';
    if (file_exists($image_hero)) {
        $pdf->Image($image_hero, 20, $pdf->GetY(), 170, 0, 'PNG', '', 'T', false, 300, 'C');
    }

    // --- TABLA DE CONTENIDOS / INTRO ---
    $pdf->AddPage();
    $pdf->SetFont('helvetica', 'B', 20);
    $pdf->SetTextColor(22, 101, 52);
    $pdf->Cell(0, 12, 'Introducción', 0, 1, 'L');
    $pdf->Ln(5);
    $pdf->SetFont('helvetica', '', 11);
    $pdf->SetTextColor(51, 65, 85);
    $pdf->MultiCell(0, 10, "Este sistema permite actualizar dinámicamente el contenido del portal 'Integridad desde la Raíz' sin necesidad de modificar el código fuente. Los datos se almacenan en archivos JavaScript estructurados que son consumidos por el front-end.", 0, 'L');
    
    // --- ESTRUCTURA DE DATOS ---
    $pdf->Ln(10);
    $pdf->SetFont('helvetica', 'B', 16);
    $pdf->SetTextColor(22, 101, 52);
    $pdf->Cell(0, 12, 'Estructura de Archivos de Datos', 0, 1, 'L');
    $pdf->Ln(5);

    $header = array('Tipo de Contenido', 'Archivo Destino', 'Variable JS');
    $data_rows = array(
        array('Slider Principal', 'assets/js/data/slider-data.js', 'sliderData'),
        array('Estados y Redes', 'assets/js/data/states-data.js', 'statesData'),
        array('Cine de Integridad', 'assets/js/data/cine-data.js', 'cineData'),
        array('Videos de Cine (Pág)', 'assets/js/data/cine-page-data.js', 'videosPageData'),
        array('Eventos y Rally', 'assets/js/data/events-data.js', 'EVENTS')
    );

    $widths = array(50, 80, 50);
    $aligns = array('L', 'L', 'L');
    $pdf->DrawTableRow($header, $widths, $aligns, true);
    foreach($data_rows as $row) {
        $pdf->DrawTableRow($row, $widths, $aligns);
    }

    // --- DIAGRAMA DE BASE DE DATOS ---
    $pdf->AddPage();
    $pdf->SetFont('helvetica', 'B', 20);
    $pdf->SetTextColor(22, 101, 52);
    $pdf->Cell(0, 12, 'Diagrama de Base de Datos', 0, 1, 'L');
    $pdf->Ln(10);
    $image_db = __DIR__ . '/../assets/images/diagrama_db.png';
    if (file_exists($image_db)) {
        $pdf->Image($image_db, 15, $pdf->GetY(), 180, 0, 'PNG', '', 'T', false, 300, 'C');
    } else {
        $pdf->SetFont('helvetica', '', 10);
        $pdf->SetTextColor(255, 0, 0);
        $pdf->Write(5, "Error: No se encontró el archivo 'diagrama_db.png' en la carpeta 'assets/images'.");
    }

    // --- MAPA DEL SITIO ---
    $pdf->AddPage();
    $pdf->SetFont('helvetica', 'B', 20);
    $pdf->SetTextColor(22, 101, 52);
    $pdf->Cell(0, 12, 'Mapa del Sitio', 0, 1, 'L');
    $pdf->Ln(10);
    $image_mapa = __DIR__ . '/../assets/images/mapa_sitio.png';
    if (file_exists($image_mapa)) {
        $pdf->Image($image_mapa, 15, $pdf->GetY(), 180, 0, 'PNG', '', 'T', false, 300, 'C');
    } else {
        $pdf->SetFont('helvetica', '', 10);
        $pdf->SetTextColor(255, 0, 0);
        $pdf->Write(5, "Error: No se encontró el archivo 'mapa_sitio.png' en la carpeta 'assets/images'.");
    }

    // --- GENERAR PDF ---
    $pdf->Output('Guia_de_Marca_y_Contenido.pdf', 'I');
    exit; // Detener el script para no ejecutar la lógica de guardado
}
// ====================================================================
// FIN: GENERADOR DE DOCUMENTACIÓN PDF
// ====================================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['type']) || !isset($input['data'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing type or data']);
    exit;
}

$type = $input['type'];
$data = $input['data'];

// Depuración: registrar si recibimos datos
// file_put_contents('debug.log', "Type: $type, Data count: " . count($data) . "\n", FILE_APPEND);

$json_data = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$file_path = '';
$variable_name = '';

switch ($type) {
    case 'slider':
        $file_path = __DIR__ . '/../assets/js/data/slider-data.js';
        $variable_name = 'sliderData';
        break;
    case 'states':
        $file_path = __DIR__ . '/../assets/js/data/states-data.js';
        $variable_name = 'statesData';
        break;
    case 'cine':
        $file_path = __DIR__ . '/../assets/js/data/cine-data.js';
        $variable_name = 'cineData';
        break;
    case 'cine_videos':
        $file_path = __DIR__ . '/../assets/js/data/cine-page-data.js';
        $variable_name = 'videosPageData';
        break;
    case 'event':
        $file_path = __DIR__ . '/../assets/js/data/events-data.js';
        $variable_name = 'EVENTS';
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid type: ' . $type]);
        exit;
}

// Prepare content
$content = "";

if ($type === 'states') {
    $content = "// Datos de los estados y sus redes sociales\n";
    $content .= "const statesData = " . $json_data . ";\n\n";
    $content .= "// Mapa de iconos SVG para asegurar consistencia\n";
    $content .= "const socialIcons = {\n";
    $content .= "    facebook: `<path d=\"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z\"/>`,\n";
    $content .= "    twitter_x: `<path d=\"M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768m2.464-2.464l6.768-6.768\"/>`,\n";
    $content .= "    instagram: `<rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"5\" ry=\"5\"/><path d=\"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z\"/><line x1=\"17.5\" y1=\"6.5\" x2=\"17.51\" y2=\"6.5\"/>`,\n";
    $content .= "    tiktok: `<path d=\"M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5\"/>`,\n";
    $content .= "    youtube: `<path d=\"M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z\"/><polygon points=\"9.75 15.02 15.5 12 9.75 8.98 9.75 15.02\"/>`,\n";
    $content .= "    spotify: `<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M8 14s1.5-1 4-1 4 1 4 1\"/><path d=\"M7 11.5s2-1.5 5-1.5 5 1.5 5 1.5\"/><path d=\"M6 9s2.5-2 6-2 6 2 6 2\"/>`,\n";
    $content .= "    default: `<circle cx=\"12\" cy=\"12\" r=\"10\"/>`\n";
    $content .= "};\n";
} elseif ($type === 'cine') {
    $content = "// Datos de la sección Cine de la Integridad\n";
    $content .= "const cineData = " . $json_data . ";\n";
} elseif ($type === 'cine_videos') {
    $content = "// Datos para la página cine.html\n";
    $content .= "// Filtros disponibles (estáticos por ahora, podrían ser dinámicos)\n";
    $content .= "const filtersData = [\n";
    $content .= "    { id: 'todos', label: 'Todos' },\n";
    $content .= "    { id: 'puebla', label: 'Puebla' },\n";
    $content .= "    { id: 'hidalgo', label: 'Hidalgo' },\n";
    $content .= "    { id: 'tlaxcala', label: 'Tlaxcala' }\n";
    $content .= "];\n\n";
    $content .= "// Lista de videos\n";
    $content .= "const videosPageData = " . $json_data . ";\n";
} elseif ($type === 'event') {
    $content = "// Datos de Eventos\n";
    $content .= "const EVENTS = " . $json_data . ";\n";
} elseif ($type === 'slider') {
    $content = "// Configuración de los Slides del Header\n";
    $content .= "const sliderData = " . $json_data . ";\n";
}

if (file_put_contents($file_path, $content)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write file: ' . $file_path]);
}
