<?php
$nachricht = wordwrap($_POST['feedback'], 70, "\r\n");

mail('feedback@shittyidle.com', 'Feedback for ShittyIdle', $nachricht);
?>