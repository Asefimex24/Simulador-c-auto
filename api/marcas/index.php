<?php

// api/niveles_atencion.php - Script principal
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight request para CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Incluir configuración de base de datos
    require_once '../../config/database.php';
    
    // Crear instancia de la base de datos
    $database = new Database();
    $db = $database->getConnection();
    
    // Consulta SQL para obtener niveles de atención
    $query = "SELECT idMarca,marca
              FROM marcas
              ORDER BY idMarca ASC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    // Obtener resultados
    $marcas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Verificar si se encontraron resultados
    if ($marcas) {
        // Estructurar la respuesta
        $response = [
            'success' => true,
            'data' => $marcas,
            'count' => count($marcas),
            'message' => 'marcas obtenidos correctamente'
        ];
        
        http_response_code(200);
        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    } else {
        // No se encontraron niveles
        $response = [
            'success' => false,
            'data' => [],
            'count' => 0,
            'message' => 'No se encontraron causas'
        ];
        
        http_response_code(404);
        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
    
} catch(PDOException $exception) {
    // Error de base de datos
    $response = [
        'success' => false,
        'data' => [],
        'message' => 'Error de base de datos: ' . $exception->getMessage()
    ];
    
    http_response_code(500);
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch(Exception $exception) {
    // Error general
    $response = [
        'success' => false,
        'data' => [],
        'message' => 'Error: ' . $exception->getMessage()
    ];
    
    http_response_code(500);
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
?>