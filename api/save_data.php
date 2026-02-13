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
            $image_file = __DIR__ . '/../images/logo.png';
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
            $image_file = __DIR__ . '/../images/logo.png';
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

            // Draw the cells
            for ($i = 0; $i < count($data); $i++) {
                $this->MultiCell(
                    $widths[$i], 
                    $row_height, 
                    $data[$i], 
                    1, // border
                    isset($aligns[$i]) ? $aligns[$i] : 'C', 
                    true, // fill
                    0, // ln -> stay at same line, move to right
                    $current_x, 
                    $start_y, 
                    true, // reseth
                    0, // stretch
                    false, // ishtml
                    true, // autopadding
                    $row_height, // maxh
                    'M' // valign
                );
                $current_x += $widths[$i];
            }

            // Move the cursor to the next line
            $this->Ln($row_height);
        }
    }

    // --- INICIO DEL PROCESO ---
    $pdf = new PDF_Branded(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
    $pdf->SetCreator(PDF_CREATOR);
    $pdf->SetAuthor('Integridad desde la Raíz');
    $pdf->SetTitle('Guía de Marca y Contenido');
    $pdf->SetMargins(PDF_MARGIN_LEFT, $pdf->getHeaderMargin(), PDF_MARGIN_RIGHT);
    $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

    // --- PORTADA ---
    $pdf->AddPage();
    $pdf->SetY(80);
    $pdf->SetFont('helvetica', 'B', 28);
    $pdf->SetTextColor(22, 101, 52);
    $pdf->Cell(0, 20, 'Guía de Marca y Contenido', 0, 1, 'C');
    $pdf->SetFont('helvetica', '', 14);
    $pdf->SetTextColor(100, 116, 139);
    $pdf->Cell(0, 10, 'Especificaciones para la gestión del sitio web', 0, 1, 'C');
    $pdf->Image(__DIR__ . '/../images/web_integridad-raiz.png', 60, 120, 90, '', 'PNG', '', 'T', false, 300, 'C');

    // --- CONTENIDO DEL MARKDOWN ---
    $pdf->AddPage();
    $markdown_content = file_get_contents(__DIR__ . '/../DOCUMENTACION_SITIO.md');

    if ($markdown_content === false) {
        $pdf->Write(5, "Error: No se pudo leer el archivo DOCUMENTACION_SITIO.md");
    } else {
        $lines = explode("\n", $markdown_content);
        $is_table = false;
        $table_col_count = 0;
        $table_widths = [];
        $table_aligns_header = [];
        $table_aligns_body = [];
        $margins = $pdf->getMargins();
        $available_table_width = $pdf->getPageWidth() - ($margins['left'] ?? PDF_MARGIN_LEFT) - ($margins['right'] ?? PDF_MARGIN_RIGHT);

        $build_table_widths = function(int $col_count) use ($available_table_width) {
            if ($col_count <= 0) return [];
            $width = $available_table_width / $col_count;
            return array_fill(0, $col_count, $width);
        };

        foreach ($lines as $line) {
            $line = trim($line);

            if (preg_match('/^# (.*)/', $line, $matches)) {
                $is_table = false;
                $table_col_count = 0;
                $table_widths = [];
                $pdf->SetFont('helvetica', 'B', 20);
                $pdf->SetTextColor(22, 101, 52);
                $pdf->Ln(10);
                $pdf->Cell(0, 12, $matches[1], 0, 1, 'L');
                $pdf->Ln(4);
            } elseif (preg_match('/^## (.*)/', $line, $matches)) {
                $is_table = false;
                $table_col_count = 0;
                $table_widths = [];
                $pdf->SetFont('helvetica', 'B', 16);
                $pdf->SetTextColor(21, 128, 61);
                $pdf->Ln(8);
                $pdf->Cell(0, 10, $matches[1], 0, 1, 'L');
                $pdf->Ln(2);
            } elseif (preg_match('/^### (.*)/', $line, $matches)) {
                $is_table = false;
                $table_col_count = 0;
                $table_widths = [];
                $pdf->SetFont('helvetica', 'B', 12);
                $pdf->SetTextColor(30, 64, 175);
                $pdf->Ln(6);
                $pdf->Cell(0, 8, $matches[1], 0, 1, 'L');
            }
            elseif (strpos($line, '|') !== false && strlen($line) > 1) {
                if (preg_match('/^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/', $line)) {
                    continue;
                }
                $cells = array_map('trim', explode('|', trim($line, '|')));
                
                if (!$is_table) {
                    // This is the header row
                    $is_table = true;
                    $table_col_count = count($cells);
                    $table_widths = $build_table_widths($table_col_count);
                    $table_aligns_header = array_fill(0, $table_col_count, 'C');
                    $table_aligns_body = array_fill(0, $table_col_count, 'L');
                    $pdf->DrawTableRow($cells, $table_widths, $table_aligns_header, true); // Draw header
                } else {
                    // This is a data row
                    if ($table_col_count > 0 && count($cells) !== $table_col_count) {
                        while (count($cells) < $table_col_count) {
                            $cells[] = '';
                        }
                        if (count($cells) > $table_col_count) {
                            $cells = array_slice($cells, 0, $table_col_count);
                        }
                    }
                    $pdf->DrawTableRow($cells, $table_widths, $table_aligns_body, false); // Draw row
                }
            } else {
                if (preg_match('/^\|[:\-\s|]+/', $line)) continue; // Ignorar línea de separación de tabla
                $is_table = false;
                $table_col_count = 0;
                $table_widths = [];
                $pdf->SetFont('helvetica', '', 10);
                $pdf->SetTextColor(51, 65, 85);
                if (strpos($line, '```') !== false) {
                    // Ignorar bloques de código
                } else {
                    $pdf->WriteHTML('<p>'.$line.'</p>', true, false, true, false, '');
                }
            }
        }
    }

    // --- DIAGRAMA DE BASE DE DATOS ---
    $pdf->AddPage();
    $pdf->SetFont('helvetica', 'B', 20);
    $pdf->SetTextColor(22, 101, 52);
    $pdf->Cell(0, 12, 'Diagrama de Base de Datos', 0, 1, 'L');
    $pdf->Ln(10);
    $image_db = __DIR__ . '/../images/diagrama_db.png';
    if (file_exists($image_db)) {
        $pdf->Image($image_db, 15, $pdf->GetY(), 180, 0, 'PNG', '', 'T', false, 300, 'C');
    } else {
        $pdf->SetFont('helvetica', '', 10);
        $pdf->SetTextColor(255, 0, 0);
        $pdf->Write(5, "Error: No se encontró el archivo 'diagrama_db.png' en la carpeta 'images'.");
    }

    // --- MAPA DEL SITIO ---
    $pdf->AddPage();
    $pdf->SetFont('helvetica', 'B', 20);
    $pdf->SetTextColor(22, 101, 52);
    $pdf->Cell(0, 12, 'Mapa del Sitio', 0, 1, 'L');
    $pdf->Ln(10);
    $image_mapa = __DIR__ . '/../images/mapa_sitio.png';
    if (file_exists($image_mapa)) {
        $pdf->Image($image_mapa, 15, $pdf->GetY(), 180, 0, 'PNG', '', 'T', false, 300, 'C');
    } else {
        $pdf->SetFont('helvetica', '', 10);
        $pdf->SetTextColor(255, 0, 0);
        $pdf->Write(5, "Error: No se encontró el archivo 'mapa_sitio.png' en la carpeta 'images'.");
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
$json_data = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$file_path = '';
$variable_name = '';

switch ($type) {
    case 'slider':
        $file_path = '../js/slider-data.js';
        $variable_name = 'sliderData';
        break;
    case 'states':
        $file_path = '../js/states-data.js';
        $variable_name = 'statesData';
        break;
    case 'cine':
        $file_path = '../js/cine-data.js';
        $variable_name = 'cineData';
        break;
    case 'event':
        $file_path = '../js/event-data.js';
        $variable_name = 'eventsList';
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid type']);
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
} elseif ($type === 'event') {
    $content = "// Datos de Eventos\n";
    $content .= "const eventsList = " . $json_data . ";\n";
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
