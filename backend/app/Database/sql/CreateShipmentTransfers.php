<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateShipmentTransfers extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'             => ['type' => 'SERIAL', 'auto_increment' => true],
            'shipment_id'    => ['type' => 'INT', 'unsigned' => true],
            'from_driver'    => ['type' => 'INT', 'unsigned' => true],
            'to_driver'      => ['type' => 'INT', 'unsigned' => true],
            'transfer_token' => ['type' => 'VARCHAR', 'constraint' => 32, 'null' => true],
            'transferred_at' => ['type' => 'TIMESTAMP', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('shipment_id');
        $this->forge->addKey('from_driver');
        $this->forge->addKey('to_driver');
        $this->forge->createTable('shipment_transfers');
    }

    public function down()
    {
        $this->forge->dropTable('shipment_transfers');
    }
}
