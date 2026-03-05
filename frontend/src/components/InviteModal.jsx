import { useState } from "react"
import { useAuth } from "../services/auth/useAuth"

export default function InviteModal({ close }) {

  const { sendInvite } = useAuth()

  const [form, setForm] = useState({
    email: ""
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {
      await sendInvite(form)

      setSuccess(true)

      setTimeout(() => {
        close()
      }, 1500)

    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="modal-overlay">

      <div className="modal">

        <h3>Enter email-id of the user to Invite them</h3>
        <div style={{ height: '20px' }} />

        {success ? (
          <p style={{ color: "green", fontWeight: "500" }}>
            Invite sent successfully!
          </p>
        ) : (

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Email</label>

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                disabled={loading}
              />
            </div>

            <div className="modal-actions">

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Invite"}
              </button>

              <button type="button" onClick={close} disabled={loading}>
                Cancel
              </button>

            </div>

          </form>

        )}

      </div>

    </div>

  )
}