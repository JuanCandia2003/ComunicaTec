<?php
$servername = "localhost";
$username = "root";
$password = "";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS comunicatec_db";
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully\n";
} else {
    echo "Error creating database: " . $conn->error . "\n";
}

$conn->select_db("comunicatec_db");

// Create table
$sql = "CREATE TABLE IF NOT EXISTS posts (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    author VARCHAR(50) NOT NULL,
    avatar VARCHAR(10) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_text TEXT NOT NULL,
    description TEXT NOT NULL,
    likes INT(6) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table posts created successfully\n";
} else {
    echo "Error creating table: " . $conn->error . "\n";
}

// Check if data exists
$result = $conn->query("SELECT count(*) as count FROM posts");
$row = $result->fetch_assoc();

if ($row['count'] == 0) {
    // Insert initial data
    $postsData = [
        [
            "author" => "academico",
            "avatar" => "U",
            "category" => "academico",
            "imageText" => "https://via.placeholder.com/600x400.png/156fc9/FFFFFF?text=Comunicado",
            "description" => "La Universidad comunica que el dia 16 de Noviembre del presente año no habra clases, ni atencion todo el dia",
            "likes" => 0
        ],
        [
            "author" => "academico",
            "avatar" => "U",
            "category" => "academico",
            "imageText" => "https://via.placeholder.com/600x400.png/156fc9/FFFFFF?text=Nuevo+Edificio",
            "description" => "Hoy celebramos la inauguración del nuevo edificio de la Facultad de Ciencias, equipado con laboratorios de última generación para impulsar la investigación estudiantil.",
            "likes" => 0
        ],
        [
            "author" => "Emprendedor",
            "avatar" => "E",
            "category" => "emprendedor",
            "imageText" => "https://via.placeholder.com/600x400.png/f32008/FFFFFF?text=Campeones",
            "description" => "¡Felicidades a nuestro equipo de futbol que ha ganado el campeonato regional tras una emocionante final contra la Universidad del Este.",
            "likes" => 0
        ],
        [
            "author" => "Cultura",
            "avatar" => "C",
            "category" => "cultural-artistico",
            "imageText" => "https://via.placeholder.com/600x400.png/3498DB/FFFFFF?text=Festival+de+Arte",
            "description" => "No te pierdas el Festival de Arte Universitario este viernes en el patio central. Música en vivo, exposiciones de arte y performances estudiantiles.",
            "likes" => 0
        ],
        [
            "author" => "Comunidad",
            "avatar" => "C",
            "category" => "comunidad",
            "imageText" => "https://via.placeholder.com/600x400.png/2ecc71/FFFFFF?text=Club+de+Debate",
            "description" => "Este jueves tendremos nuestra reunión semanal para preparar el torneo interuniversitario. ¡Nuevos miembros son bienvenidos!",
            "likes" => 0
        ],
        [
            "author" => "Ruby-tips",
            "avatar" => "R",
            "category" => "ruby-tips",
            "imageText" => "https://via.placeholder.com/600x400.png/e74c3c/FFFFFF?text=Ruby+Tips",
            "description" => "Para transformar colecciones, prefiere usar `map`. Es más idiomático y devuelve un nuevo array con los resultados. Ejemplo: `numbers.map { |n| n * 2 }`.",
            "likes" => 0
        ],
        [
            "author" => "ComunicaTec Team",
            "avatar" => "CT",
            "category" => "equipo-comunicatec",
            "imageText" => "https://via.placeholder.com/600x400.png/9b59b6/FFFFFF?text=Equipo",
            "description" => "Somos un grupo de estudiantes apasionados por la comunicación y la tecnología, trabajando para mantenerte informado.",
            "likes" => 0
        ],
        [
            "author" => "Ilustracion",
            "avatar" => "I",
            "category" => "grafica-ilustracion",
            "imageText" => "https://via.placeholder.com/600x400.png/f1c40f/FFFFFF?text=Ilustración",
            "description" => "Participa en nuestro taller gratuito de ilustración digital este sábado. Aprende a usar Procreate desde cero. ¡Cupos limitados!",
            "likes" => 0
        ]
    ];

    $stmt = $conn->prepare("INSERT INTO posts (author, avatar, category, image_text, description, likes) VALUES (?, ?, ?, ?, ?, ?)");

    foreach ($postsData as $post) {
        $stmt->bind_param("sssssi", $post['author'], $post['avatar'], $post['category'], $post['imageText'], $post['description'], $post['likes']);
        $stmt->execute();
    }

    echo "Initial data inserted successfully\n";
    $stmt->close();
} else {
    echo "Data already exists, skipping insertion\n";
}

$conn->close();
?>
