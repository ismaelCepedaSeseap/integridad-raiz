<?php
$apiKey = "AIzaSyCwgeGmzzTOH789Wf9uOI4qdLU37dmj2Sk";
$url = "https://generativelanguage.googleapis.com/v1/models?key=$apiKey";

$response = file_get_contents($url);
echo $response;
?>