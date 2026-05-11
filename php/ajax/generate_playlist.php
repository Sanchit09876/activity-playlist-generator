<?php
header('Content-Type: application/json');
require_once "../config/load_env.php";

$activity = $_POST['activity'] ?? '';
if (empty($activity)) {
    echo json_encode(['error' => 'No activity provided']);
    exit();
}

$apiKey = getenv('GROQ_API_KEY');
if (!$apiKey) {
    echo json_encode(['error' => 'API Key not configured']);
    exit();
}

$messages = [
    [
        'role' => 'system',
        'content' => 'You are a playlist generator. The user will describe an activity. You MUST reply ONLY with a valid JSON array of exactly 5 objects. Each object MUST have exactly two keys: "title" and "artist". Example: [{"title":"Song Name","artist":"Artist Name"}]. No extra text, no markdown, no explanation, no other content.'
    ],
    [
        'role' => 'user',
        'content' => $activity
    ]
];

$data = [
    'model' => 'llama-3.1-8b-instant',

    'messages' => $messages,
    'temperature' => 0.7, // Controls randomness (0 = deterministic, 1 = creative).
    'max_tokens' => 250
];

$groqAPIurl = 'https://api.groq.com/openai/v1/chat/completions';

$ch = curl_init($groqAPIurl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true); // use the POST method
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data)); // attach the JSON‑encoded request body

$response = curl_exec($ch);

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    error_log("GORQ API error: HTTP $httpCode, response: $response");
    echo json_encode(['error' => 'AI service temporarily unavailable']);
    exit();
}

$result = json_decode($response, true);
$content = $result['choices'][0]['message']['content'] ?? '';

$content = preg_replace('/```json|```/', '', $content);
$content = trim($content);

$playlist = json_decode($content, true);

if (!is_array($playlist) || count($playlist) < 1) {
    echo json_encode(['error' => 'AI returned an invalid playlist']);
    exit();
}

echo json_encode(['playlist' => $playlist]);
