export default function AccountDetails({ user }) {
  return (
    <div className="bg-white p-8 rounded-lg mb-8 w-full">

      <h3 className="text-lg font-semibold mb-4">Account Details</h3>

      <div className="grid grid-cols-3 gap-5 mt-4 md:grid-cols-2 sm:grid-cols-1">

        <div>
          <label className="text-xs text-gray-500">First Name</label>
          <p>{user?.first_name || "-"}</p>
        </div>

        <div>
          <label className="text-xs text-gray-500">Last Name</label>
          <p>{user?.last_name || "-"}</p>
        </div>

        <div>
          <label className="text-xs text-gray-500">Email</label>
          <p>{user?.email}</p>
        </div>

        <div>
          <label className="text-xs text-gray-500">Phone</label>
          <p>{user?.phone_number || "-"}</p>
        </div>

        <div>
          <label className="text-xs text-gray-500">Date Joined</label>
          <p>{new Date(user?.date_joined).toLocaleDateString()}</p>
        </div>

        <div>
          <label className="text-xs text-gray-500">Last Login</label>
          <p>{user?.last_login ? new Date(user.last_login).toUTCString() : "Never"}</p>
        </div>

      </div>

    </div>
  )
}