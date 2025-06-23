<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateUserDocuments extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'         => ['type' => 'SERIAL', 'unsigned' => true, 'auto_increment' => true],
            'user_id'    => ['type' => 'INT', 'unsigned' => true],
            'type'       => ['type' => 'VARCHAR', 'constraint' => 50], // e.g. profile_picture, driver_license, insurance
            'file'       => ['type' => 'VARCHAR', 'constraint' => 255],
            'status'     => ['type' => 'VARCHAR', 'constraint' => 20, 'default' => 'pending'], // pending, approved, rejected
            'uploaded_at'=> ['type' => 'TIMESTAMP', 'null' => false],
            'remarks'    => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('user_id');
        $this->forge->createTable('user_documents');

        // Add the default via a raw SQL ALTER TABLE statement for PostgreSQL compatibility:
        $db = \Config\Database::connect();
        $db->query("ALTER TABLE user_documents ALTER COLUMN uploaded_at SET DEFAULT CURRENT_TIMESTAMP");
    }

    public function down()
    {
        $this->forge->dropTable('user_documents');
    }
}
