import React, { useEffect, useState, useCallback, useMemo } from "react";
import Layout from "../../components/Layout";
import { getUsers, updateUserRole, deleteUser } from "../../services/userService";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [filterRole, setFilterRole] = useState("ALL");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedUser, setSelectedUser] = useState(null);
  const [editRole, setEditRole] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(null);

  // ================= DEBOUNCE SEARCH =================
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // ================= FETCH USERS =================
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getUsers(
        page,
        10,
        debouncedSearch,
        filterRole === "ALL" ? "" : filterRole
      );

      setUsers(res.data.content || res.data);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setError("Unable to load users");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filterRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ================= ROLE UPDATE =================
  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    const backup = [...users];

    // optimistic UI update
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? { ...u, role: { ...u.role, name: editRole } }
          : u
      )
    );

    setActionLoading(true);

    try {
      await updateUserRole(selectedUser.id, editRole);
      setSelectedUser(null);
    } catch {
      setUsers(backup);
      setError("Role update failed");
    } finally {
      setActionLoading(false);
    }
  };

  // ================= DELETE USER =================
  const handleDelete = async () => {
    const id = confirmDelete;
    if (!id) return;

    const backup = [...users];

    setUsers((prev) => prev.filter((u) => u.id !== id));

    try {
      await deleteUser(id);
      setConfirmDelete(null);
    } catch {
      setUsers(backup);
      setError("Delete failed");
    }
  };

  // ================= ROLE BADGE =================
  const roleBadge = useMemo(() => {
    return (role) => {
      const styles = {
        ADMIN: "bg-red-100 text-red-700",
        DOCTOR: "bg-green-100 text-green-700",
        USER: "bg-blue-100 text-blue-700",
      };

      return (
        <span
          className={`px-2 py-1 text-xs rounded-full ${styles[role] || "bg-gray-100"}`}
        >
          {role}
        </span>
      );
    };
  }, []);

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            User Management Center
          </h1>
          <p className="text-gray-500">
            Enterprise-grade hospital access control system
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="p-3 border rounded-lg w-full md:w-1/2"
          />

          <select
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setPage(0);
            }}
            className="p-3 border rounded-lg"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="DOCTOR">Doctor</option>
            <option value="USER">User</option>
          </select>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="bg-white p-6 rounded shadow animate-pulse">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-gray-500">
            No users found.
          </div>
        ) : (
          <div className="bg-white shadow rounded-xl overflow-hidden">

            <table className="w-full text-left">

              <thead className="bg-gray-100 text-gray-600 text-sm">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">

                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3 text-gray-600">{user.email}</td>

                    <td className="p-3">
                      {roleBadge(user.role.name)}
                    </td>

                    <td className="p-3 flex gap-2">

                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setEditRole(user.role.name);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit Role
                      </button>

                      <button
                        onClick={() => setConfirmDelete(user.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-3 py-1 rounded ${
                page === i ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* ================= ROLE MODAL ================= */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

            <div className="bg-white p-6 rounded-xl w-96">

              <h2 className="text-xl font-bold mb-4">
                Update User Role
              </h2>

              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full p-3 border rounded mb-4"
              >
                <option value="ADMIN">Admin</option>
                <option value="DOCTOR">Doctor</option>
                <option value="USER">User</option>
              </select>

              <div className="flex justify-end gap-2">

                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdateRole}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  {actionLoading ? "Saving..." : "Save"}
                </button>

              </div>

            </div>

          </div>
        )}

        {/* ================= DELETE MODAL ================= */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

            <div className="bg-white p-6 rounded-xl w-96">

              <h2 className="text-lg font-bold mb-3">
                Confirm Delete
              </h2>

              <p className="text-gray-600 mb-4">
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-2">

                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </Layout>
  );
}