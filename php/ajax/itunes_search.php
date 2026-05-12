<?php
header('Content-Type: application/json');

$title = $_POST['title'] ?? '';
$artist = $_POST['artist'] ?? '';

if (empty($title) || empty($artist)) {
    echo json_encode(['error' => 'No song info provided']);
    exit();
}

$query = urlencode("$title $artist");
$url = "https://itunes.apple.com/search?term=$query&media=music&limit=1";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

$preview = $data['results'][0]['previewUrl'] ?? null;

if(!$preview){
    echo json_encode(['error' => 'Preview not found']);
    exit();
}

echo json_encode(['preview_url' => $preview]);