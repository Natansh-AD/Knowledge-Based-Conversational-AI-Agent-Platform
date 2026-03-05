import { useState } from "react"
import { useAuth } from "../services/auth/useAuth"

export default function EditProfileModal({ user, close }) {

  const { updateUser } = useAuth()

  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone_number: user?.phone_number || "",
    username: user?.username || ""
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateUser(form)
      close()
    } catch (err) {
      alert(err.message)
    }
  }

  return (

    <div className="modal-overlay">

      <div className="modal">

        <h3>Edit Profile</h3>
        <div style={{ height: '20px' }} />

        <form onSubmit={handleSubmit}>

            <div className="form-group">
                <label>Username</label>
                <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter username"
                />
            </div>

            <div className="form-group">
                <label>First Name</label>
                <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
                />
            </div>

            <div className="form-group">
                <label>Last Name</label>
                <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
                />
            </div>

            <div className="form-group">
                <label>Phone Number</label>
                <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number"
                />
            </div>

            <div className="modal-actions">

                <button type="submit">
                Save
                </button>

                <button type="button" onClick={close}>
                Cancel
                </button>

            </div>

        </form>

      </div>

    </div>

  )
}