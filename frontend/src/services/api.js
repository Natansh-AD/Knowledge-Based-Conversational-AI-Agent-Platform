

export const verifyTenant = async (orgName) => {
  try {
    const response = await fetch(
      `http://localhost:8000/${orgName}/`,
      {
        method: "GET",
      }
    )

    if (!response.ok) {
      throw new Error("Tenant not found")
    }

    return true
  } catch (error) {
    throw error
  }
}