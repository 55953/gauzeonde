<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;
use CodeIgniter\Database\RawSql;

class CreateUsersTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'        => [
                'type'           => 'INT',
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'name'      => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
            ],
            'email'     => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
                'unique'     => true,
            ],
            'phone'     => [
                'type'       => 'VARCHAR',
                'constraint' => 30,
                'unique'     => true,
            ],
            'password'  => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
            ],
            'role'      => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
            ],
            'created_at' => [
                'type'    => 'TIMESTAMP',
                'null'    => false,
            ],
            'updated_at' => [
                'type'    => 'TIMESTAMP',
                'null'    => false,
            ],
            'status' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
                'default'    => 'pending',
            ],
            'online' => [
                'type'    => 'BOOLEAN',
                'default' => false,
            ],
            'last_online_at' => [
                'type' => 'TIMESTAMP',
                'null' => true,
            ],
            'document_status' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
                'default'    => 'pending',
            ],
            'document_file' => [
                'type'    => 'VARCHAR',
                'constraint' => 255,
                'null'    => true,
            ],
            'reset_token' => [
                'type'    => 'VARCHAR',
                'constraint' => 64,
                'null'    => true,
            ],
            'reset_token_expires' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'activation_code' => [
                'type'    => 'VARCHAR',
                'constraint' => 10,
                'null'    => true,
            ],
            'activation_expires' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('users');

        // Add the default via a raw SQL ALTER TABLE statement for PostgreSQL compatibility:
        $db = \Config\Database::connect();
        $db->query("ALTER TABLE users ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP");
        $db->query("ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP");
        // $db->query("CREATE INDEX IF NOT EXISTS idx_users_role_online ON users (role, online)");
        // $db->query("CREATE INDEX IF NOT EXISTS idx_users_last_online ON users (last_online_at)");
        // $db->query("CREATE INDEX IF NOT EXISTS idx_users_status ON users (status)");
        // $db->query("CREATE INDEX IF NOT EXISTS idx_users_vehicle_type ON users (vehicle_type)");
        // CREATE INDEX IF NOT EXISTS idx_users_role_online ON users (role, online);
        // CREATE INDEX IF NOT EXISTS idx_users_last_online ON users (last_online_at);
        // CREATE INDEX IF NOT EXISTS idx_users_status ON users (status);
        // CREATE INDEX IF NOT EXISTS idx_users_vehicle_type ON users (vehicle_type);
    }

    public function down()
    {
        $this->forge->dropTable('users');
    }
}
