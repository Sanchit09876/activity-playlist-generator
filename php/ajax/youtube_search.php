<?php
header('Content-Type: application/json');
require_once "../config/load_env.php";

$title = $_POST['title'] ?? '';
$artist = $_POST['artist'] ?? '';

if (empty($title) || empty($artist)) {
    echo json_encode(['error' => 'No song info provided']);
    exit();
}

$apiKey = getenv('YOUTUBE_API_KEY');
if (!$apiKey) {
    // echo json_encode(['error' => 'API Key not configured']);
    echo json_encode(['error' => 'API key not found', 'env_check' => $_ENV]);
    exit();
}

$query = urlencode("$title $artist");
$url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=$query&type=video&maxResults=1&key=$apiKey";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

if ($httpCode !== 200) {
    // echo json_encode(['error' => 'YouTube API error']);
    echo json_encode([
        'error' => 'YouTube API error',
        'http_code' => $httpCode,
        'response' => $response
    ]);
    exit();
}

$data = json_decode($response, true);

$videoId = $data['items'][0]['id']['videoId'] ?? null;

if (!$videoId) {
    echo json_encode(['error' => 'No video found']);
    exit();
}

echo json_encode(['youtube_url' => "https://www.youtube.com/watch?v=$videoId"]);