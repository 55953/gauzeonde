<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePaymentsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'            => ['type' => 'SERIAL', 'unsigned' => true, 'auto_increment' => true],
            'shipment_id'   => ['type' => 'INT', 'unsigned' => true],
            'payer_id'      => ['type' => 'INT', 'unsigned' => true],
            'payee_id'      => ['type' => 'INT', 'unsigned' => true],
            'amount'        => ['type' => 'DECIMAL', 'constraint' => '10,2'],
            'status'        => ['type' => 'VARCHAR', 'constraint' => 20, 'default' => 'pending'],
            'payment_method'=> ['type' => 'VARCHAR', 'constraint' => 50, 'null' => true],
            'transaction_id'=> ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'created_at'    => ['type' => 'TIMESTAMP', 'null' => false],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('payments');

        // Add the default via a raw SQL ALTER TABLE statement for PostgreSQL compatibility:
        $db = \Config\Database::connect();
        $db->query("ALTER TABLE payments ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP");
    }

    public function down()
    {
        $this->forge->dropTable('payments');
    }
}