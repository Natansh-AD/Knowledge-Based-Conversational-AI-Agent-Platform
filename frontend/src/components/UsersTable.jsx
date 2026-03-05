import { useEffect, useState } from "react";
import { useAuth } from "../services/auth/useAuth";

export default function UsersTable() {
  const { getInvitedUsers } = useAuth()
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roleMap = {
    1: "Admin",
    2: "Member",
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getInvitedUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">

      <h3>Users Invited By You</h3>

      {loading && <p>Loading users...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table>

          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {users.length === 0 ? (
              <tr>
                <td colSpan="4">No invited users found</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{roleMap[user.role] || user.role}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        background:
                          user.status === "accepted"
                            ? "#d4edda"
                            : "#fff3cd",
                        color:
                          user.status === "accepted"
                            ? "#155724"
                            : "#856404",
                        fontWeight: "500"
                      }}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>
      )}

    </div>
  );
}