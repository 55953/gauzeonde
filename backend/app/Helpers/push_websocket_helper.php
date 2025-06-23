<?php

if (!function_exists('pushToWebSocket')) {
    /**
     * Push a single event to the WebSocket bridge.
     */
    function pushToWebSocket(string $event, string $room, array $data): void
    {
        $url = getenv('WEBSOCKET_BRIDGE_URL') ?: 'http://localhost:3001/emit';
        $secret = getenv('WEBSOCKET_BRIDGE_SECRET') ?: 'your-very-strong-secret';

        try {
            $client = \Config\Services::curlrequest();
            $client->setHeader('Content-Type', 'application/json');
            $client->setHeader('x-ws-secret', $secret);

            $payload = [
                'event' => $event,
                'room'  => $room,
                'data'  => $data
            ];

            $client->post($url, [
                'body' => json_encode($payload)
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Failed to push to WebSocket: ' . $e->getMessage());
        }
    }
}

if (!function_exists('pushBatchToWebSocket')) {
    /**
     * Push a batch event to the WebSocket bridge.
     */
    function pushBatchToWebSocket(string $event, string $room, array $batchData): void
    {
        $url = getenv('WEBSOCKET_BRIDGE_URL') ?: 'http://localhost:3001/emit';
        $secret = getenv('WEBSOCKET_BRIDGE_SECRET') ?: 'your-very-strong-secret';

        try {
            $client = \Config\Services::curlrequest();
            $client->setHeader('Content-Type', 'application/json');
            $client->setHeader('x-ws-secret', $secret);

            $payload = [
                'event' => $event,
                'room'  => $room,
                'data'  => $batchData
            ];
            $client->post($url, [
                'body' => json_encode($payload)
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Failed to push batch to WebSocket: ' . $e->getMessage());
        }
    }
}
