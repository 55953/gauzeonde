<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateNotificationsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'         => ['type' => 'SERIAL', 'unsigned' => true, 'auto_increment' => true],
            'user_id'    => ['type' => 'INT', 'unsigned' => true],
            'type'       => ['type' => 'VARCHAR', 'constraint' => 50, 'null' => true],
            'content'    => ['type' => 'TEXT'],
            'is_read'    => ['type' => 'BOOLEAN', 'default' => false],
            'created_at' => ['type' => 'TIMESTAMP', 'null' => false],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('notifications');

        // Add the default via a raw SQL ALTER TABLE statement for PostgreSQL compatibility:
        $db = \Config\Database::connect();
        $db->query("ALTER TABLE notifications ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP");
    }

    public function down()
    {
        $this->forge->dropTable('notifications');
    }
}