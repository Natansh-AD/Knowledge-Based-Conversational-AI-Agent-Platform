import { useEffect, useState } from "react";
import { useAuth } from "../services/auth/useAuth";

export default function UsersTable() {
  const { getInvitedUsers } = useAuth()
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roleMap = { 1: "Admin", 2: "Member" };

  useEffect(() => { loadUsers() }, []);

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

  const statusClass = (status) => {
    return status === "accepted"
      ? "px-2 py-1 rounded text-green-800 bg-green-100 font-medium"
      : "px-2 py-1 rounded text-yellow-800 bg-yellow-100 font-medium"
  }

  return (
    <div className="bg-white p-8 rounded-lg mb-8 w-full">

      <h3 className="text-lg font-semibold mb-4">Users Invited By You</h3>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 border-b border-gray-200">Email</th>
                <th className="text-left p-3 border-b border-gray-200">Role</th>
                <th className="text-left p-3 border-b border-gray-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-3 text-center text-gray-500">
                    No invited users found
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id}>
                    <td className="p-3 border-b border-gray-200">{u.email}</td>
                    <td className="p-3 border-b border-gray-200">{roleMap[u.role] || u.role}</td>
                    <td className="p-3 border-b border-gray-200">
                      <span className={statusClass(u.status)}>{u.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}