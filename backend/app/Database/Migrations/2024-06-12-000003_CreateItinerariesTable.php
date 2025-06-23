<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateItinerariesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'            => ['type' => 'SERIAL', 'unsigned' => true, 'auto_increment' => true],
            'user_id'       => ['type' => 'INT', 'unsigned' => true],
            'origin'        => ['type' => 'VARCHAR', 'constraint' => 255],
            'destination'   => ['type' => 'VARCHAR', 'constraint' => 255],
            'departure_time'=> ['type' => 'TIMESTAMP'],
            'arrival_time'  => ['type' => 'TIMESTAMP', 'null' => true],
            'vehicle_details'=>['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'status'        => ['type' => 'VARCHAR', 'constraint' => 32, 'default' => 'active'],
            'created_at'    => ['type' => 'TIMESTAMP', 'null' => false],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('itineraries');

        // Add the default via a raw SQL ALTER TABLE statement for PostgreSQL compatibility:
        $db = \Config\Database::connect();
        $db->query("ALTER TABLE itineraries ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP");
    }

    public function down()
    {
        $this->forge->dropTable('itineraries');
    }
}