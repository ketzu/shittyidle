<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <link rel="icon" href="<%= BASE_URL %>favicon.ico">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <title>City Idle</title>
</head>
<body style="background-color:#2e7d32;">

    <div class="container">

    </div> <!-- /container -->
<?php
########## Database Info ##########
$db_server = 'rdbms.strato.de';
$db_name = 'DB1613657';
$db_user = 'U1613657';
$db_passwd = 'DDZF0rumPW';
$cookiename = 'DSA374960Blub';

########## READ DATA

$password = $_POST["password"]?: '';

if($password=="FUCKOFF666") {
    // Create connection
    $mysqli = new mysqli($db_server, $db_user, $db_passwd, $db_name);
    if ($mysqli->connect_errno) {
        die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
    }

    $sql = "SELECT * FROM MyGuests";
    $result = $mysqli->query($sql);

    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            echo "<div class='row'>".$row["message"]."</div>";
        }
    } else {
        echo "<div class='row'>0 results</div>";
    }
    $mysqli->close();
}
?>
</body>
</html>
