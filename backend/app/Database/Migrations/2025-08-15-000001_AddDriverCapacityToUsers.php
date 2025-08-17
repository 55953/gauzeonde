<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;
use CodeIgniter\Database\RawSql;

class AddDriverCapacityToUsers extends Migration
{
    public function up()
    {
        // Online/availability fields
        $this->forge->addColumn('users', [
            'online' => [
                'type'       => 'BOOLEAN',
                'null'       => false,
                'default'    => false,
                'after'      => 'status',
            ],
            'last_online_at' => [
                'type'       => 'TIMESTAMP',
                'null'       => true,
                'after'      => 'online',
            ],
        ]);

        // Capacity & vehicle fields (nullable = unconstrained)
        $this->forge->addColumn('users', [
            'max_weight_kg' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'null'       => true,
                'after'      => 'last_online_at',
            ],
            'max_volume_cuft' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'null'       => true,
                'after'      => 'max_weight_kg',
            ],
            'max_length_cm' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'null'       => true,
                'after'      => 'max_volume_cuft',
            ],
            'max_width_cm' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'null'       => true,
                'after'      => 'max_length_cm',
            ],
            'max_height_cm' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'null'       => true,
                'after'      => 'max_width_cm',
            ],
            'vehicle_type' => [
                'type'       => 'VARCHAR',
                'constraint' => 60,
                'null'       => true,
                'after'      => 'max_height_cm',
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('users', 'online');
        $this->forge->dropColumn('users', 'last_online_at');
        $this->forge->dropColumn('users', 'max_weight_kg');
        $this->forge->dropColumn('users', 'max_volume_cuft');
        $this->forge->dropColumn('users', 'max_length_cm');
        $this->forge->dropColumn('users', 'max_width_cm');
        $this->forge->dropColumn('users', 'max_height_cm');
        $this->forge->dropColumn('users', 'vehicle_type');
    }
}
