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

if (!$response) {
    echo json_encode(['error' => 'cURL failed - no response']);
    exit();
}

$data = json_decode($response, true);

if (!$data) {
    echo json_encode(['error' => 'JSON decode failed', 'raw' => $response]);
    exit();
}

if (empty($data['results'])) {
    echo json_encode(['error' => 'No iTunes results', 'query' => "$title $artist", 'resultCount' => $data['resultCount'] ?? 0]);
    exit();
}

$fullData = $data['results'];
$result = $data['results'][0];

$preview = $result['previewUrl'] ?? null;
$artwork = $result['artworkUrl100'] ?? null;
$trackUrl = $result['trackViewUrl'] ?? null;


if (!$preview && !$trackUrl) {
    echo json_encode(['error' => 'Preview not found']);
    exit();
}

echo json_encode([
    'preview_url' => $preview,
    'artwork_url' => $artwork,
    'track_url' => $trackUrl,
    'full_data' => $fullData,
]);
