<?php

namespace App\Services;

class WebsocketService
{
    protected string $url;
    protected string $secret;

    public function __construct()
    {
        $this->url    = rtrim(getenv('WS_BRIDGE_URL') ?: 'http://localhost:3001', '/');
        $this->secret = getenv('WS_SECRET') ?: '';
    }

    /**
     * Emit a single event to the Node bridge.
     * @param string      $event  e.g. "driver.location"
     * @param array       $data   payload
     * @param string|null $room   optional room (e.g. "driver:42" or "shipment:123")
     * @param array       $opts   e.g. ['namespace' => '/live']
     */
    public function emit(string $event, array $data, ?string $room = null, array $opts = []): bool
    {
        $payload = [
            'secret' => $this->secret,
            'event'  => $event,
            'data'   => $data,
            'room'   => $room,
            'opts'   => $opts,
        ];
        return $this->postJson('/emit', $payload);
    }

    /**
     * Emit many events in one go (batch).
     * items: [{event, data, room?, opts?}, ...]
     */
    public function emitBatch(array $items): bool
    {
        $payload = [
            'secret' => $this->secret,
            'items'  => $items,
        ];
        return $this->postJson('/emit-batch', $payload);
    }

    protected function postJson(string $path, array $payload): bool
    {
        $url = $this->url . $path;
        $ch  = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_SLASHES),
            CURLOPT_TIMEOUT        => 5,
        ]);
        $res  = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err  = curl_error($ch);
        curl_close($ch);

        if ($code >= 200 && $code < 300) {
            return true;
        }
        log_message('error', 'WS emit failed: HTTP {code} {err} body={res}', ['code' => $code, 'err' => $err ?: '-', 'res' => $res ?: '-']);
        return false;
    }
}
