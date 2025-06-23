<?php
// app/Database/Migrations/2024-06-12-000100_CreateDriverLocations.php

namespace App\Database\Migrations;
use CodeIgniter\Database\Migration;

class CreateDriverLocations extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'         => ['type' => 'SERIAL', 'auto_increment' => true],
            'driver_id'  => ['type' => 'INT', 'unsigned' => true],
            'latitude'   => ['type' => 'DOUBLE PRECISION'],
            'longitude'  => ['type' => 'DOUBLE PRECISION'],
            'updated_at' => ['type' => 'TIMESTAMP', 'null' => false],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('driver_id');
        $this->forge->createTable('driver_locations');

        // Add the default via a raw SQL ALTER TABLE statement for PostgreSQL compatibility:
        $db = \Config\Database::connect();
        $db->query("ALTER TABLE driver_locations ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP");
    }
    public function down()
    {
        $this->forge->dropTable('driver_locations');
    }
}
