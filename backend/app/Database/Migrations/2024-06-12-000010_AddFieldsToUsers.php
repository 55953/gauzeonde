<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddFieldsToUsers extends Migration
{
    public function up()
    {
        $fields = [
            'kyc_status' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'default' => 'pending',
                'after' => 'document_status'
            ],
            'rating' => [
                'type' => 'DECIMAL',
                'constraint' => '3,2',
                'default' => 0.00,
                'after' => 'kyc_status'
            ]
        ];
        $this->forge->addColumn('users', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('users', 'kyc_status');
        $this->forge->dropColumn('users', 'rating');
    }
}
