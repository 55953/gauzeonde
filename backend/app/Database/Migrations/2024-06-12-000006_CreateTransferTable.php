<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateTransferTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'          => ['type' => 'SERIAL', 'auto_increment' => true],
            'shipment_id' => ['type' => 'INT', 'unsigned' => true],
            'from_driver' => ['type' => 'INT', 'unsigned' => true],
            'to_driver'   => ['type' => 'INT', 'unsigned' => true],
            'transferred_at' => ['type' => 'TIMESTAMP', 'null' => false],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('transfers');

        // Add the default via a raw SQL ALTER TABLE statement for PostgreSQL compatibility:
        $db = \Config\Database::connect();
        $db->query("ALTER TABLE transfers ALTER COLUMN transferred_at SET DEFAULT CURRENT_TIMESTAMP");
    }

    public function down()
    {
        $this->forge->dropTable('transfers');
    }
}