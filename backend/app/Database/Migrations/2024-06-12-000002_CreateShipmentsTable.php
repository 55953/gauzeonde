<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateShipmentsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'             => ['type' => 'SERIAL', 'unsigned' => true, 'auto_increment' => true],
            'sender_id'      => ['type' => 'INT', 'unsigned' => true],
            'tracking_number'=> ['type' => 'VARCHAR', 'constraint' => 32, 'unique' => true],
            'description'    => ['type' => 'TEXT'],
            'origin'         => ['type' => 'VARCHAR', 'constraint' => 255],
            'destination'    => ['type' => 'VARCHAR', 'constraint' => 255],
            'weight'         => ['type' => 'DECIMAL', 'constraint' => '8,2'],
            'status'         => ['type' => 'VARCHAR', 'constraint' => 32, 'default' => 'pending'],
            'driver_id'      => ['type' => 'INT', 'unsigned' => true, 'null' => true],
            'current_location'=>['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'pickup_time'    => ['type' => 'TIMESTAMP', 'null' => true],
            'delivery_time'  => ['type' => 'TIMESTAMP', 'null' => true],
            'created_at'     => ['type' => 'TIMESTAMP', 'null' => false],
            'updated_at'     => ['type' => 'TIMESTAMP', 'null' => false]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('tracking_number');
        $this->forge->createTable('shipments');

        // Add the default via a raw SQL ALTER TABLE statement for PostgreSQL compatibility:
        $db = \Config\Database::connect();
        $db->query("ALTER TABLE shipments ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP");
        $db->query("ALTER TABLE shipments ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP");

    }

    public function down()
    {
        $this->forge->dropTable('shipments');
    }
}