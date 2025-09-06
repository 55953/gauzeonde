// hooks/useMyShipments.ts
import { useEffect, useState } from 'react';
import { ShipmentApi } from '@api/api';

export type Shipment = {
  id: number;
  origin: string;
  destination: string;
  status: string;
  created_at: string;
  tracking_number?: string;
  // ...other fields you return
};

export default function useMyShipments(filters?: { status?: string }) {
  const [items, setItems] = useState<Shipment[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async (reset = false) => {
    try {
      setLoading(true);
      setErr(null);
      const p = reset ? 1 : page;
      const res = await ShipmentApi.listMine({ page: p, per_page: perPage, status: filters?.status });
      const data = res.data.data as Shipment[];
      const meta = res.data.meta;
      setTotalPages(meta?.total_pages ?? 1);
      setItems(reset ? data : [...items, ...data]);
      setPage(p + 1);
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setPage(1);
    await load(true);
  };

  return { items, loading, err, load, refresh, hasMore: page <= totalPages };
}
