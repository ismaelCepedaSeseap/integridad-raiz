<?php
    session_start();
    require_once 'auth.php';
    $auth = new Auth();
    if($actual!="login.php"){
        if(!$auth->isLoggedIn()){
           header("Location:../login.php");
        }
    }
    else{
        if($auth->isLoggedIn()){
           header("Location:admin/dashboard.php");
        }
    }
?>