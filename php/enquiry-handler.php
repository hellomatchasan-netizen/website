<?php
declare(strict_types=1);

header('Content-Type: application/json');

// Where enquiries are delivered. Change this if the receiving inbox changes.
const RECIPIENT_EMAIL = 'hello.matchasan@gmail.com';
const SITE_NAME = 'Matcha San';

function respond(bool $ok, ?string $error = null): void {
    http_response_code($ok ? 200 : 400);
    echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.');
}

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$eventType = trim((string)($_POST['eventType'] ?? ''));
$date = trim((string)($_POST['date'] ?? ''));
$guests = trim((string)($_POST['guests'] ?? ''));

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please add your name and a valid email.');
}
if ($eventType === '') {
    respond(false, 'Please choose an event type.');
}

$safeName = str_replace(["\r", "\n"], '', $name);
$safeEmail = str_replace(["\r", "\n"], '', $email);

$subject = SITE_NAME . ' — new event enquiry from ' . $safeName;

$bodyLines = [
    'New event enquiry from the website:',
    '',
    'Name: ' . $name,
    'Email: ' . $email,
    'Event type: ' . $eventType,
    'Preferred date: ' . ($date !== '' ? $date : 'not specified'),
    'Guest count: ' . ($guests !== '' ? $guests : 'not specified'),
];
$body = implode("\n", $bodyLines);

$headers = [
    'From: ' . SITE_NAME . ' Website <no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . '>',
    'Reply-To: ' . $safeEmail,
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail(RECIPIENT_EMAIL, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    respond(false, 'Could not send the enquiry right now. Please email us directly.');
}

respond(true);
