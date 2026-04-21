import { useEffect, useMemo, useState } from "react";
import "./css/UserList.css";

const API = import.meta.env.VITE_API_URL;

type User = {
  id: string;
  name: string;
  email: string;
  role: 1 | 2;
};

type Props = {
  goBack: () => void;
  showToast: (msg: string) => void;
};

type SortOption =
  | "name-asc"
  | "name-desc"
  | "role"
  | "managers-first"
  | "employees-first";

function UserList({ goBack, showToast }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmUser, setConfirmUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleLabel = (role: 1 | 2) => (role === 1 ? "MANAGER" : "EMPLOYEE");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(data);
    } catch (err: any) {
      const msg = err.message || "Something went wrong";
      setError(msg);
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!confirmUser) return;

    try {
      setDeletingId(confirmUser.id);
      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/auth/users/${confirmUser.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      setUsers((prev) => prev.filter((u) => u.id !== confirmUser.id));
      showToast(`${confirmUser.name} deleted successfully`);
    } catch (err: any) {
      const msg = err.message || "Delete failed";
      setError(msg);
      showToast(msg);
    } finally {
      setDeletingId(null);
      setConfirmUser(null);
    }
  };

  const cancelDelete = () => {
    setConfirmUser(null);
  };

  const sortedUsers = useMemo(() => {
    const copiedUsers = [...users];

    switch (sortBy) {
      case "name-asc":
        return copiedUsers.sort((a, b) => a.name.localeCompare(b.name));

      case "name-desc":
        return copiedUsers.sort((a, b) => b.name.localeCompare(a.name));

      case "role":
        return copiedUsers.sort((a, b) => a.role - b.role);

      case "managers-first":
        return copiedUsers.sort((a, b) => {
          if (a.role === b.role) return a.name.localeCompare(b.name);
          return a.role === 1 ? -1 : 1;
        });

      case "employees-first":
        return copiedUsers.sort((a, b) => {
          if (a.role === b.role) return a.name.localeCompare(b.name);
          return a.role === 2 ? -1 : 1;
        });

      default:
        return copiedUsers;
    }
  }, [users, sortBy]);

  return (
    <div className="users-container">
      <button onClick={goBack} className="users-back-btn">
        Back
      </button>

      <h2 className="users-title">Managers & Employees</h2>

      <div className="users-toolbar">
        <label className="sort-label">
          Sort By:
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="managers-first">Managers First</option>
            <option value="employees-first">Employees First</option>
          </select>
        </label>
      </div>

      {loading && <p className="users-info">Loading...</p>}
      {error && <p className="users-error">{error}</p>}

      <div className="users-list">
        {sortedUsers.map((user) => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p>{user.email}</p>

            <div className="user-card-footer">
              <span
                className={`role-badge ${user.role === 1 ? "manager" : "employee"}`}
              >
                {getRoleLabel(user.role)}
              </span>

              <button
                className="delete-user-btn"
                onClick={() => setConfirmUser(user)}
                disabled={deletingId === user.id}
              >
                {deletingId === user.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmUser && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Delete User</h3>
            <p>
              Are you sure you want to delete <b>{confirmUser.name}</b>?
            </p>

            <div className="confirm-actions">
              <button className="confirm-no" onClick={cancelDelete}>
                No
              </button>

              <button className="confirm-yes" onClick={confirmDelete}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;