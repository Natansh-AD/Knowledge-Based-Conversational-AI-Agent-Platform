import { useState } from "react"
import { useAuth } from "../services/auth/useAuth"
import { toast } from "react-hot-toast"

export default function InviteModal({ close }) {
  const { sendInvite } = useAuth()

  const [form, setForm] = useState({ email: "" })
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
      toast.success("User created !!")
      setTimeout(() => {
        close()
      }, 1500)
    } catch (err) {
      toast.err(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">

        <h3 className="text-xl font-semibold mb-6">
          Enter email-id of the user to Invite them
        </h3>

        {success ? (
          <p className="text-green-600 font-semibold">
            Invite sent successfully!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                disabled={loading}
                type="email"
                required
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-100"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">

              <button
                type="submit"
                disabled={loading}
                className={`px-5 py-2 rounded-md font-semibold transition
                  ${loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-900"
                  }`}
              >
                {loading ? "Sending..." : "Send Invite"}
              </button>

              <button
                type="button"
                onClick={close}
                disabled={loading}
                className="px-5 py-2 border border-gray-300 rounded-md font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>

            </div>

          </form>
        )}

      </div>

    </div>
  )
}