<?php
    session_start();
    require_once '<security/auth.php';
    $auth = new Auth();
    $auth->logout();
    echo "Cerrado";
?>