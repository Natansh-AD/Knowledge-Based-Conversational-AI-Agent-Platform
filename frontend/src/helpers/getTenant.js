export function getOrgFromPath() {
  const path = window.location.pathname.split("/")
  return path[1] || null
}