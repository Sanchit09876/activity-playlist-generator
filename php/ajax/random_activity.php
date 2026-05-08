<?php

header('Content-Type: application/json'); // sends a raw HTTP header to the browser, informs the browser that the response will be in JSON format

$apiUrl = "https://bored-api.appbrewery.com/random"; // Store the URL of the Bored API endpoint in a variable

$ch = curl_init($apiUrl); // curl_init() initializes a new cURL session and returns a cURL handle//

// curl_setopt() sets various options for the cURL session
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // if set to true, it tells cURL to return the response as a string instead of outputting it directly
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']); // sets an array of HTTP headers to be sent with the request

$response = curl_exec($ch); // curl_exec() executes the configured cURL session

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE); // curl_getinfo() gets information about the last transfer
// fetches the HTTP status code from the response example: 200 for success, 404 for not found, 403 for forbiddened

curl_close($ch); // curl_close()  the cURL session and frees up system resources

if ($httpCode === 200 && $response !== false) {
    $data = json_decode($response, true);

    if (isset($data['activity'])) {
        echo json_encode(['activity' => $data['activity']]);
    } else {
        echo json_encode(['error' => 'API response missing activity field']);
    }
} else {
    error_log("Bored API failed: HTTP $httpCode, response: $response");
    echo json_encode(['error' => 'Could not fetch a random activity.']);
}
