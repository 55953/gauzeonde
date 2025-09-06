<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;
use CodeIgniter\Database\RawSql;

class PlatformBaseline extends Migration
{
    public function up()
    {
        /**
         * USERS
         */
        if (! $this->db->tableExists('users')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'auto_increment' => true, 'null' => false],
                'name' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => false],
                'email' => ['type' => 'VARCHAR', 'constraint' => 150, 'null' => false],
                'phone' => ['type' => 'VARCHAR', 'constraint' => 30, 'null' => true],
                'password' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => false],
                'role' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => false, 'default' => 'sender'], // driver|sender|admin
                'status' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => false, 'default' => 'pending'], // active|pending|suspended| blocked|inactive| on_hold|pending_verification
                'is_suspended' => ['type' => 'BOOLEAN', 'null' => false, 'default' => false],
                'reason_of_suspension' => ['type' => 'TEXT', 'null' => true],
                // driver presence
                'online' => ['type' => 'BOOLEAN', 'null' => false, 'default' => false],
                'last_online_at' => ['type' => 'TIMESTAMP', 'null' => true],

                // driver capacity
                'vehicle_type' => ['type' => 'VARCHAR', 'constraint' => 60, 'null' => true],
                'max_weight_kg' => ['type' => 'DECIMAL', 'constraint' => '10,2', 'null' => true],
                'max_volume_cuft' => ['type' => 'DECIMAL', 'constraint' => '10,2', 'null' => true],
                'max_length_cm' => ['type' => 'DECIMAL', 'constraint' => '10,2', 'null' => true],
                'max_width_cm' => ['type' => 'DECIMAL', 'constraint' => '10,2', 'null' => true],
                'max_height_cm' => ['type' => 'DECIMAL', 'constraint' => '10,2', 'null' => true],

                // KYC & rating
                'kyc_status' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true], // pending|verified|rejected
                'rating' => ['type' => 'DECIMAL', 'constraint' => '3,2', 'null' => true],

                // activation & reset
                'activation_code' => ['type' => 'VARCHAR', 'constraint' => 10, 'null' => true],
                'activation_expires' => ['type' => 'TIMESTAMP', 'null' => true],
                'reset_token' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
                'reset_token_expires' => ['type' => 'TIMESTAMP', 'null' => true],

                // document
                'document_status' => ['type' => 'VARCHAR', 'constraint' => 20, 'default' => 'pending'],
                'document_file' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],

                // timestamps
                'created_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
                'updated_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addUniqueKey('email');
            $this->forge->addUniqueKey('phone');
            $this->forge->createTable('users', true);
        }

        /**
         * SHIPMENTS
         */
        if (! $this->db->tableExists('shipments')) {
            $this->forge->addField([
                'id' => ['type' => 'SERIAL', 'unsigned' => true,'auto_increment' => true],
                'tracking_number' => ['type' => 'VARCHAR', 'constraint' => 50, 'null' => false],
                'status' => ['type' => 'VARCHAR', 'constraint' => 30, 'null' => false, 'default' => 'ready_for_pickup'],
                'origin' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
                'destination' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
                'current_location' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
                'pickup_time' => ['type' => 'DATETIME', 'null' => true],
                'delivery_time' => ['type' => 'DATETIME', 'null' => true],

                // dims
                'weight_kg' => ['type' => 'DECIMAL', 'constraint' => '10,2', 'null' => true],
                'volume_cuft' => ['type' => 'DECIMAL', 'constraint' => '10,2', 'null' => true],
                'length_cm' => ['type' => 'DECIMAL', 'constraint' => '10,2', 'null' => true],
                'width_cm' => ['type' => 'DECIMAL', 'constraint' => '10,2', 'null' => true],
                'height_cm' => ['type' => 'DECIMAL', 'constraint' => '10,2', 'null' => true],

                // relations
                'driver_id' => ['type' => 'INT', 'null' => true],
                'sender_id' => ['type' => 'INT', 'null' => true],

                // money
                'payout' => ['type' => 'DECIMAL', 'constraint' => '12,2', 'null' => true],

                // timestamps
                'created_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
                'updated_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addUniqueKey('tracking_number');
            $this->forge->addKey('status');
            $this->forge->addKey('driver_id');
            $this->forge->addKey('sender_id');
            $this->forge->addForeignKey('driver_id', 'users', 'id', 'SET NULL', 'CASCADE');
            $this->forge->addForeignKey('sender_id', 'users', 'id', 'SET NULL', 'CASCADE');
            $this->forge->createTable('shipments', true);
        }

        /**
         * DRIVER LOCATIONS
         */
        if (! $this->db->tableExists('driver_locations')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'auto_increment' => true, 'null' => false],
                'driver_id' => ['type' => 'INT', 'null' => false],
                'latitude' => ['type' => 'DECIMAL', 'constraint' => '10,7', 'null' => false],
                'longitude' => ['type' => 'DECIMAL', 'constraint' => '10,7', 'null' => false],
                'speed' => ['type' => 'DECIMAL', 'constraint' => '8,2', 'null' => true],
                'heading' => ['type' => 'DECIMAL', 'constraint' => '6,2', 'null' => true],
                'updated_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
                'recorded_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addKey('driver_id');
            $this->forge->addForeignKey('driver_id', 'users', 'id', 'CASCADE', 'CASCADE');
            $this->forge->createTable('driver_locations', true);
        }

        /**
         * ITINERARIES
         */
        if (! $this->db->tableExists('itineraries')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'auto_increment' => true, 'null' => false],
                'driver_id' => ['type' => 'INT', 'null' => false],
                'title' => ['type' => 'VARCHAR', 'constraint' => 120, 'null' => true],
                'origin' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
                'destination' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
                'start_lat' => ['type' => 'DECIMAL', 'constraint' => '10,7', 'null' => true],
                'start_lng' => ['type' => 'DECIMAL', 'constraint' => '10,7', 'null' => true],
                'end_lat' => ['type' => 'DECIMAL', 'constraint' => '10,7', 'null' => true],
                'end_lng' => ['type' => 'DECIMAL', 'constraint' => '10,7', 'null' => true],
                'departure_time' => ['type' => 'TIMESTAMP', 'null' => true],
                'arrival_time' => ['type' => 'TIMESTAMP', 'null' => true],
                'status' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => false, 'default' => 'draft'], // draft|active|paused|completed|cancelled
                'vehicle_details' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
                'polyline' => ['type' => 'TEXT', 'null' => true], // encoded polyline or JSON path
                'created_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
                'updated_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addKey('driver_id');
            $this->forge->addForeignKey('driver_id', 'users', 'id', 'CASCADE', 'CASCADE');
            $this->forge->createTable('itineraries', true);
        }

        /**
         * SHIPMENT LOCATIONS (track points per shipment)
         */
        if (! $this->db->tableExists('shipment_locations')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'auto_increment' => true, 'null' => false],
                'shipment_id' => ['type' => 'INT', 'null' => false],
                'driver_id' => ['type' => 'INT', 'null' => true],
                'latitude' => ['type' => 'DECIMAL', 'constraint' => '10,7', 'null' => false],
                'longitude' => ['type' => 'DECIMAL', 'constraint' => '10,7', 'null' => false],
                'source' => ['type' => 'VARCHAR', 'constraint' => 30, 'null' => false, 'default' => 'driver_gps'],
                'recorded_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addKey('shipment_id');
            $this->forge->addKey('driver_id');
            $this->forge->addForeignKey('shipment_id', 'shipments', 'id', 'CASCADE', 'CASCADE');
            $this->forge->addForeignKey('driver_id', 'users', 'id', 'SET NULL', 'CASCADE');
            $this->forge->createTable('shipment_locations', true);
        }

        /**
         * SHIPMENT TRANSFERS (handoff audit)
         */
        if (! $this->db->tableExists('shipment_transfers')) {
            $this->forge->addField([
                'id' => ['type' => 'SERIAL', 'auto_increment' => true, 'null' => false],
                'shipment_id' => ['type' => 'INT', 'null' => false],
                'from_driver_id' => ['type' => 'INT', 'null' => true],
                'to_driver_id' => ['type' => 'INT', 'null' => true],
                'initiated_by' => ['type' => 'INT', 'null' => true], // user who initiated (driver/admin)
                'status' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => false, 'default' => 'pending'], // pending|accepted|completed|cancelled|rejected
                'transfer_token' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true], // optional token/qr
                'notes' => ['type' => 'TEXT', 'null' => true],
                'accepted_at' => ['type' => 'TIMESTAMP', 'null' => true],
                'completed_at' => ['type' => 'TIMESTAMP', 'null' => true],
                'created_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addKey('shipment_id');
            $this->forge->addKey('from_driver_id');
            $this->forge->addKey('to_driver_id');
            $this->forge->addForeignKey('shipment_id', 'shipments', 'id', 'CASCADE', 'CASCADE');
            $this->forge->addForeignKey('from_driver_id', 'users', 'id', 'SET NULL', 'CASCADE');
            $this->forge->addForeignKey('to_driver_id', 'users', 'id', 'SET NULL', 'CASCADE');
            $this->forge->createTable('shipment_transfers', true);
        }

        /**
         * QR CODES (transfer tokens)
         */
        if (! $this->db->tableExists('qr_codes')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'auto_increment' => true, 'null' => false],
                'code' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => false],
                'shipment_id' => ['type' => 'INT', 'null' => true],
                'driver_id' => ['type' => 'INT', 'null' => true],
                'status' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => false, 'default' => 'active'], // active|used|expired|revoked
                'expires_at' => ['type' => 'TIMESTAMP', 'null' => true],
                'used_at' => ['type' => 'TIMESTAMP', 'null' => true],
                'created_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addUniqueKey('code');
            $this->forge->addKey('shipment_id');
            $this->forge->addKey('driver_id');
            $this->forge->addForeignKey('shipment_id', 'shipments', 'id', 'SET NULL', 'CASCADE');
            $this->forge->addForeignKey('driver_id', 'users', 'id', 'SET NULL', 'CASCADE');
            $this->forge->createTable('qr_codes', true);
        }

        /**
         * PAYMENTS
         */
        if (! $this->db->tableExists('payments')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'auto_increment' => true, 'null' => false],
                'shipment_id' => ['type' => 'INT', 'null' => true],
                'payer_id' => ['type' => 'INT', 'null' => true], // sender
                'payee_id' => ['type' => 'INT', 'null' => true], // driver/platform
                'amount' => ['type' => 'DECIMAL', 'constraint' => '12,2', 'null' => false],
                'currency' => ['type' => 'VARCHAR', 'constraint' => 3, 'null' => false, 'default' => 'USD'],
                'payment_method' => ['type' => 'VARCHAR', 'constraint' => 30, 'null' => true], // card|cash|stripe|paypal|wallet
                'status' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => false, 'default' => 'pending'],
                'transaction_id' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
                'external_id' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
                'meta' => ['type' => 'TEXT', 'null' => true], // JSON text
                'created_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
                'updated_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addKey('shipment_id');
            $this->forge->addKey('payer_id');
            $this->forge->addKey('payee_id');
            $this->forge->addForeignKey('shipment_id', 'shipments', 'id', 'SET NULL', 'CASCADE');
            $this->forge->addForeignKey('payer_id', 'users', 'id', 'SET NULL', 'CASCADE');
            $this->forge->addForeignKey('payee_id', 'users', 'id', 'SET NULL', 'CASCADE');
            $this->forge->createTable('payments', true);
        }

        /**
         * TRANSACTIONS (ledger)
         */
        if (! $this->db->tableExists('transactions')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'auto_increment' => true, 'null' => false],
                'user_id' => ['type' => 'INT', 'null' => false],
                'shipment_id' => ['type' => 'INT', 'null' => true],
                'type' => ['type' => 'VARCHAR', 'constraint' => 10, 'null' => false], // debit|credit
                'amount' => ['type' => 'DECIMAL', 'constraint' => '12,2', 'null' => false],
                'currency' => ['type' => 'VARCHAR', 'constraint' => 3, 'null' => false, 'default' => 'USD'],
                'reference' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
                'description' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
                'balance_after' => ['type' => 'DECIMAL', 'constraint' => '14,2', 'null' => true],
                'created_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addKey('user_id');
            $this->forge->addKey('shipment_id');
            $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
            $this->forge->addForeignKey('shipment_id', 'shipments', 'id', 'SET NULL', 'CASCADE');
            $this->forge->createTable('transactions', true);
        }

        /**
         * PAYOUTS
         */
        if (! $this->db->tableExists('payouts')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'auto_increment' => true, 'null' => false],
                'driver_id' => ['type' => 'INT', 'null' => false],
                'period_start' => ['type' => 'DATE', 'null' => false],
                'period_end' => ['type' => 'DATE', 'null' => false],
                'amount' => ['type' => 'DECIMAL', 'constraint' => '12,2', 'null' => false],
                'currency' => ['type' => 'VARCHAR', 'constraint' => 3, 'null' => false, 'default' => 'USD'],
                'status' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => false, 'default' => 'pending'], // pending|processing|paid|failed
                'external_id' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
                'created_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
                'updated_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addKey('driver_id');
            $this->forge->addForeignKey('driver_id', 'users', 'id', 'CASCADE', 'CASCADE');
            $this->forge->createTable('payouts', true);
        }

        /**
         * NOTIFICATIONS
         */
        if (! $this->db->tableExists('notifications')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'auto_increment' => true, 'null' => false],
                'user_id' => ['type' => 'INT', 'null' => true],
                'type' => ['type' => 'VARCHAR', 'constraint' => 40, 'null' => true], // shipment_status, assignment, payout, generic
                'title' => ['type' => 'VARCHAR', 'constraint' => 150, 'null' => true],
                'body' => ['type' => 'TEXT', 'null' => true],
                'channel' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => false, 'default' => 'push'], // email|sms|push|websocket
                'status' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => false, 'default' => 'queued'], // queued|sent|failed
                'is_read' => ['type' => 'BOOLEAN', 'null' => false, 'default' => false],
                'meta' => ['type' => 'TEXT', 'null' => true], // JSON text
                'sent_at' => ['type' => 'TIMESTAMP', 'null' => true],
                'created_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addKey('user_id');
            $this->forge->addForeignKey('user_id', 'users', 'id', 'SET NULL', 'CASCADE');
            $this->forge->createTable('notifications', true);
        }

        /**
         * WEBHOOKS
         */
        if (! $this->db->tableExists('webhooks')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'auto_increment' => true, 'null' => false],
                'event' => ['type' => 'VARCHAR', 'constraint' => 50, 'null' => false], // e.g., shipment.status_changed
                'target_url' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => false],
                'secret' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
                'active' => ['type' => 'BOOLEAN', 'null' => false, 'default' => true],
                'created_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->createTable('webhooks', true);
        }

        /**
         * WEBHOOK DELIVERIES
         */
        if (! $this->db->tableExists('webhook_deliveries')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'auto_increment' => true, 'null' => false],
                'webhook_id' => ['type' => 'INT', 'null' => false],
                'event' => ['type' => 'VARCHAR', 'constraint' => 50, 'null' => false],
                'payload' => ['type' => 'TEXT', 'null' => true],
                'response_status' => ['type' => 'INT', 'null' => true],
                'response_body' => ['type' => 'TEXT', 'null' => true],
                'attempt' => ['type' => 'INT', 'null' => false, 'default' => 1],
                'delivered_at' => ['type' => 'TIMESTAMP', 'null' => true],
                'created_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addKey('webhook_id');
            $this->forge->addForeignKey('webhook_id', 'webhooks', 'id', 'CASCADE', 'CASCADE');
            $this->forge->createTable('webhook_deliveries', true);
        }

        /**
         * DOCUMENTS (KYC)
         */
        if (! $this->db->tableExists('documents')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'auto_increment' => true, 'null' => false],
                'user_id' => ['type' => 'INT', 'null' => false],
                'type' => ['type' => 'VARCHAR', 'constraint' => 30, 'null' => false], // profile_picture|driver_license|insurance
                'file_path' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => false],
                'mime_type' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
                'size_bytes' => ['type' => 'BIGINT', 'null' => true],
                'status' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => false, 'default' => 'pending'], // pending|approved|rejected
                'verified_by' => ['type' => 'INT', 'null' => true],
                'verified_at' => ['type' => 'TIMESTAMP', 'null' => true],
                'remarks'    => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
                'created_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
                'updated_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addKey('user_id');
            $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
            $this->forge->addForeignKey('verified_by', 'users', 'id', 'SET NULL', 'CASCADE');
            $this->forge->createTable('documents', true);
        }

        /**
         * DOMAIN EVENTS (audit of emitted events)
         */
        if (! $this->db->tableExists('domain_events')) {
            $this->forge->addField([
                'id' => ['type' => 'INT', 'auto_increment' => true, 'null' => false],
                'event_name' => ['type' => 'VARCHAR', 'constraint' => 80, 'null' => false],
                'entity_type' => ['type' => 'VARCHAR', 'constraint' => 40, 'null' => true], // shipment|user|payment|...
                'entity_id' => ['type' => 'INT', 'null' => true],
                'payload' => ['type' => 'TEXT', 'null' => true], // JSON text
                'created_at' => ['type' => 'TIMESTAMP', 'null' => false, 'default' => new RawSql('CURRENT_TIMESTAMP')],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addKey('event_name');
            $this->forge->addKey('entity_type');
            $this->forge->addKey('entity_id');
            $this->forge->createTable('domain_events', true);
        }

        /**
         * Helpful composite index for driver_locations
         */
        if ($this->db->tableExists('driver_locations')) {
            // Postgres/MySQL 8+: safe to attempt IF NOT EXISTS
            try { $this->db->query('CREATE INDEX IF NOT EXISTS idx_driver_locations_driver_time ON driver_locations (driver_id, recorded_at DESC)'); } catch (\Throwable $e) {}
        }
        if ($this->db->tableExists('shipment_locations')) {
            try { $this->db->query('CREATE INDEX IF NOT EXISTS idx_shipment_locations_ship_time ON shipment_locations (shipment_id, recorded_at DESC)'); } catch (\Throwable $e) {}
        }

        /**
         * Idempotent “add missing columns” patching (useful if DB is partially provisioned)
         */
        $this->addColumnIfMissing('users', 'vehicle_type', ['type' => 'VARCHAR', 'constraint' => 60, 'null' => true]);
        $this->addColumnIfMissing('users', 'online', ['type' => 'BOOLEAN', 'null' => false, 'default' => false]);
        $this->addColumnIfMissing('shipments', 'payout', ['type' => 'DECIMAL', 'constraint' => '12,2', 'null' => true]);
    }

    public function down()
    {
        // reverse dependency order
        foreach ([
            'domain_events',
            'documents',
            'webhook_deliveries',
            'webhooks',
            'notifications',
            'payouts',
            'transactions',
            'payments',
            'qr_codes',
            'shipment_transfers',
            'shipment_locations',
            'itineraries',
            'driver_locations',
            'shipments',
            'users',
        ] as $table) {
            if ($this->db->tableExists($table)) {
                $this->forge->dropTable($table, true);
            }
        }
    }

    /**
     * Helper: add a column if missing (safe on both Postgres & MySQL)
     */
    private function addColumnIfMissing(string $table, string $column, array $definition): void
    {
        if ($this->db->tableExists($table) && ! $this->db->fieldExists($column, $table)) {
            $this->forge->addColumn($table, [$column => $definition]);
        }
    }
}
