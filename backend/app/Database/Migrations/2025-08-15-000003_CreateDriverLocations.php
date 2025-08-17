<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;
use CodeIgniter\Database\RawSql;

class CreateDriverLocations extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'auto_increment' => true,
                'null'           => false,
            ],
            'driver_id' => [
                'type' => 'INT',
                'null' => false,
            ],
            'latitude' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,7', // ~1.1cm precision
                'null'       => false,
            ],
            'longitude' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,7',
                'null'       => false,
            ],
            'speed' => [
                'type'       => 'DECIMAL',
                'constraint' => '8,2',
                'null'       => true,
            ],
            'heading' => [
                'type'       => 'DECIMAL',
                'constraint' => '6,2',
                'null'       => true,
            ],
            'recorded_at' => [
                'type'    => 'TIMESTAMP',
                'null'    => false,
                'default' => new RawSql('CURRENT_TIMESTAMP'),
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('driver_id');
        $this->forge->createTable('driver_locations', true);

        // Optional indexes (useful for queries by driver or time)
        $this->db->query('CREATE INDEX IF NOT EXISTS idx_driver_locations_driver_time ON driver_locations (driver_id, recorded_at DESC)');
    }

    public function down()
    {
        $this->forge->dropTable('driver_locations', true);
    }
}
