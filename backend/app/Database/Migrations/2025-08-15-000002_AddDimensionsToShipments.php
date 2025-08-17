<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;
use CodeIgniter\Database\RawSql;

class AddDimensionsToShipments extends Migration
{
    public function up()
    {
        // Core descriptor fields (if not already present)
        $fields = [
            'tracking_number' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'null'       => true, // set false if you already control it
                'after'      => 'id',
            ],
            'status' => [
                'type'       => 'VARCHAR',
                'constraint' => 30,
                'null'       => false,
                'default'    => 'ready_for_pickup',
                'after'      => 'tracking_number',
            ],
            'origin' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'status',
            ],
            'destination' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
                'null'       => true,
                'after'      => 'origin',
            ],
        ];
        // Add only if columns don’t exist
        foreach ($fields as $name => $def) {
            if (! $this->db->fieldExists($name, 'shipments')) {
                $this->forge->addColumn('shipments', [$name => $def]);
            }
        }

        // Dimensions & weight
        $this->forge->addColumn('shipments', [
            'weight_kg' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'null'       => true,
                'after'      => 'destination',
            ],
            'volume_cuft' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'null'       => true,
                'after'      => 'weight_kg',
            ],
            'length_cm' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'null'       => true,
                'after'      => 'volume_cuft',
            ],
            'width_cm' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'null'       => true,
                'after'      => 'length_cm',
            ],
            'height_cm' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'null'       => true,
                'after'      => 'width_cm',
            ],
        ]);

        // Relations & payout
        $this->forge->addColumn('shipments', [
            'driver_id' => [
                'type'       => 'INT',
                'null'       => true,
                'after'      => 'height_cm',
            ],
            'sender_id' => [
                'type'       => 'INT',
                'null'       => true,
                'after'      => 'driver_id',
            ],
            'payout' => [
                'type'       => 'DECIMAL',
                'constraint' => '12,2',
                'null'       => true,
                'after'      => 'sender_id',
            ],
            'updated_at' => [
                'type'       => 'TIMESTAMP',
                'null'       => false,
                'default'    => new RawSql('CURRENT_TIMESTAMP'),
                'after'      => 'created_at',
            ],
        ]);

        // Optional indexes / foreign keys
        // (FKs require existing `users.id`; adjust names/types for your DB)
        // PostgreSQL/MySQL supported by CI4:
        if (! $this->db->tableExists('shipments')) return;

        // Add indexes
        $this->db->query('CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments (status)');
        $this->db->query('CREATE INDEX IF NOT EXISTS idx_shipments_driver ON shipments (driver_id)');
        $this->db->query('CREATE INDEX IF NOT EXISTS idx_shipments_sender ON shipments (sender_id)');

        // Add foreign keys if not already present (safe to skip if you prefer)
        // In CI4 Forge, adding FK after table exists may require manual SQL per driver.
        // Example for Postgres:
        $this->db->query('
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints
                    WHERE constraint_name = ''fk_shipments_driver''
                    AND table_name = ''shipments''
                ) THEN
                    ALTER TABLE shipments
                        ADD CONSTRAINT fk_shipments_driver
                        FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL;
                END IF;
            END$$;
        ');

        $this->db->query('
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints
                    WHERE constraint_name = ''fk_shipments_sender''
                    AND table_name = ''shipments''
                ) THEN
                    ALTER TABLE shipments
                        ADD CONSTRAINT fk_shipments_sender
                        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL;
                END IF;
            END$$;
        ');
    }

    public function down()
    {
        // Drop FKs if created (Postgres)
        $this->db->query('DO $$ BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = ''fk_shipments_driver'' AND table_name = ''shipments'') THEN
                ALTER TABLE shipments DROP CONSTRAINT fk_shipments_driver;
            END IF;
        END $$;');

        $this->db->query('DO $$ BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = ''fk_shipments_sender'' AND table_name = ''shipments'') THEN
                ALTER TABLE shipments DROP CONSTRAINT fk_shipments_sender;
            END IF;
        END $$;');

        // Drop added columns (reverse order not strictly required but tidy)
        foreach ([
            'payout','sender_id','driver_id',
            'height_cm','width_cm','length_cm','volume_cuft','weight_kg',
            'destination','origin','status','tracking_number',
            'updated_at'
        ] as $col) {
            if ($this->db->fieldExists($col, 'shipments')) {
                $this->forge->dropColumn('shipments', $col);
            }
        }
    }
}
