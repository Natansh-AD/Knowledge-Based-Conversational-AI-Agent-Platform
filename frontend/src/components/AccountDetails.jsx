export default function AccountDetails({ user }) {

  return (

    <div className="section">

      <h3>Account Details</h3>

      <div className="details-grid">

        <div>
          <label>First Name</label>
          <p>{user?.first_name || "-"}</p>
        </div>

        <div>
          <label>Last Name</label>
          <p>{user?.last_name || "-"}</p>
        </div>

        <div>
          <label>Email</label>
          <p>{user?.email}</p>
        </div>

        <div>
          <label>Phone</label>
          <p>{user?.phone_number || "-"}</p>
        </div>

        <div>
          <label>Date Joined</label>
          <p>{new Date(user?.date_joined).toLocaleDateString()}</p>
        </div>

        <div>
          <label>Last Login</label>
          <p>
            {user?.last_login
              ? new Date(user.last_login).toUTCString()
              : "Never"}
          </p>
        </div>

      </div>

    </div>

  )
}