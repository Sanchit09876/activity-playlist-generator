<?php
function loadEnv($path)
{
    if (!file_exists($path)) {
        return;
    }

    // read the entire file into an array, each element = one line
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue; // skip comments

        // split the line at the first '='
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);

        putenv("$name=$value");
        $_ENV[$name] = $value; //manually set $_ENV superglobal array if php doesn't set it automatically
    }
}

$path = '/../../.env';
loadEnv(__DIR__ . $path);
