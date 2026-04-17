import React, { useEffect, useState, useCallback } from "react";
import Layout from "../../components/Layout";

import {
  getUsers,
  updateUserRole,
  deleteUser,
} from "../../services/userService";

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

  // ================= DEBOUNCE SEARCH =================
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);

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
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filterRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ================= UPDATE ROLE (OPTIMISTIC UI) =================
  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    const oldUsers = [...users];

    // optimistic update
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
      setUsers(oldUsers); // rollback
      setError("Failed to update user role");
    } finally {
      setActionLoading(false);
    }
  };

  // ================= DELETE USER =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    const oldUsers = [...users];

    setUsers((prev) => prev.filter((u) => u.id !== id));

    try {
      await deleteUser(id);
    } catch {
      setUsers(oldUsers); // rollback
      setError("Delete failed");
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            User Management
          </h1>
          <p className="text-gray-500">
            Enterprise Admin Control Panel
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
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
        {loading && (
          <div className="bg-white p-4 rounded shadow animate-pulse">
            Loading users...
          </div>
        )}

        {/* TABLE */}
        {!loading && (
          <div className="bg-white shadow rounded-xl overflow-hidden">

            <table className="w-full text-left">

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">

                    <td className="p-3">{user.id}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>

                    <td className="p-3">
                      {user.role.name}
                    </td>

                    <td className="p-3 flex gap-2">

                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setEditRole(user.role.name);
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
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
        <div className="flex gap-2 mt-4">
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

        {/* MODAL */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

            <div className="bg-white p-6 rounded-xl w-96">

              <h2 className="text-xl font-bold mb-4">
                Edit Role
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

      </div>
    </Layout>
  );
}