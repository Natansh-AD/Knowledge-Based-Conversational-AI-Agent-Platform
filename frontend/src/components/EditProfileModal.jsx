import { useState } from "react"
import { useAuth } from "../services/auth/useAuth"
import { toast } from "react-hot-toast"

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
      toast.success("User Details updated")
      close()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">

        <h3 className="text-xl font-semibold mb-6">Edit Profile</h3>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">First Name</label>
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="Enter first name"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Last Name</label>
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Enter last name"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Phone Number</label>
            <input
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="submit"
              className="px-5 py-2 bg-gray-800 text-white rounded-md font-semibold hover:bg-gray-900 transition"
            >
              Save
            </button>

            <button
              type="button"
              onClick={close}
              className="px-5 py-2 border border-gray-300 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>

        </form>

      </div>

    </div>
  )
}