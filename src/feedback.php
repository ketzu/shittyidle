<?php
header('Content-type: application/json');

########## Database Info ##########
$db_server = 'rdbms.strato.de';
$db_name = 'DB1613657';
$db_user = 'U1613657';
$db_passwd = 'DDZF0rumPW';
$cookiename = 'DSA374960Blub';

########## READ DATA

$data = $_POST["feedback"]?: '';

// Create connection
$mysqli = new mysqli($db_server, $db_user, $db_passwd, $db_name);
if ($mysqli->connect_errno) {
    die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
}

$success = FALSE;

$stmt = $mysqli->prepare("INSERT INTO SI_feedback (message) VALUES (?)");
$stmt->bind_param('s',$data);
$stmt->execute();
$success = TRUE;

$mysqli->close();

echo json_encode(array('success' => $success, 'data' => $data));
?>