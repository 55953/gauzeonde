// screens/AdminUsersScreen.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserApi } from "@api/api";
import { useSession } from "../../../contexts/AuthContext";
import { User } from "../../../types/models";

type UserRow = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: "driver" | "sender" | "admin";
  status?: string;
  online?: boolean;
  vehicle_type?: string;
};

export default function ManageAllUsersScreen() {
  const nav = useNavigation<any>();
  const { session } = useSession();
  const [items, setItems] = useState<UserRow[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const canView = useMemo(() => session?.user?.role === "admin", [session?.user]);
  const filters = useMemo(() => ({ page, per_page: perPage, search: search || undefined, role: role || undefined }), [page, perPage, search, role]);

  const fetchUsers = useCallback(async (overrides?: Partial<typeof filters>, append = false) => {
    setLoading(true);
    try {
      const params = { ...filters, ...(overrides || {}) };
      const res = await UserApi.listUsers(params as any);
      const data = res.data?.data ?? res.data ?? [];
      const meta = res.data?.meta;
      if (append) setItems(prev => [...prev, ...data]);
      else setItems(data);
      if (meta?.total_pages) setTotalPages(meta.total_pages);
    } catch (e) {
      // handle error silently or show toast
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (!canView) return;
    fetchUsers();
  }, [canView, fetchUsers]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers({ page: 1 }, false);
    setPage(1);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (page >= totalPages || loading) return;
    const next = page + 1;
    setPage(next);
    await fetchUsers({ page: next }, true);
  };

  if (!canView) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Unauthorized</Text>
        <Text>You must be an admin to view this page.</Text>
      </View>
    );
  }

  return (
     <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, padding: 12 }}>
          <Text style={styles.title}>Users</Text>
          <View style={styles.filters}>
            <View style={{ width: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="Search name/email/phone"
                value={search}
                onChangeText={setSearch}
                onSubmitEditing={() => fetchUsers({ page: 1 })}
                returnKeyType="search"
              />
              <TextInput
                style={styles.input}
                placeholder="Role (driver/sender/admin)"
                value={role}
                onChangeText={setRole}
                onSubmitEditing={() => fetchUsers({ page: 1 })}
                autoCapitalize="none"
              />
          </View>
          {loading && items.length === 0 ? (
            <View style={styles.center}><ActivityIndicator /></View>
          ) : (
            
            <FlatList
              data={items}
              keyExtractor={(u) => String(u.id)}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => nav.navigate("(users)/adminEditUser", { id: item.id })}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name || "(no name)"}  {item.online ? "🟢" : "⚪"}</Text>
                    <Text style={styles.sub}>{item.email}</Text>
                    {!!item.phone && <Text style={styles.sub}>{item.phone}</Text>}
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.badge}>{item.role}</Text>
                    {!!item.status && <Text style={styles.status}>{item.status}</Text>}
                  </View>
                </TouchableOpacity>
              )}
              ListFooterComponent={
                page < totalPages ? (
                  <TouchableOpacity style={styles.loadMore} onPress={loadMore}>
                    <Text style={{ color: "#1e40af", fontWeight: "600" }}>Load More</Text>
                  </TouchableOpacity>
                ) : null
              }
            />
          )}
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", marginBottom: 30 },
  filters: { flexDirection: "row", gap: 8, marginBottom: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  row: { flexDirection: "row", paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#eee" },
  name: { fontSize: 16, fontWeight: "600" },
  sub: { color: "#555" },
  badge: { backgroundColor: "#eef2ff", color: "#4338ca", fontWeight: "700", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, textTransform: "capitalize" },
  status: { color: "#64748b", marginTop: 4, textTransform: "capitalize" },
  loadMore: { paddingVertical: 12, alignItems: "center" }
});
