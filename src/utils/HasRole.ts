export default function hasRole(roleCode: string): boolean {
  const rolesItem: string | null = sessionStorage.getItem('roles')
  if (rolesItem === null) return false
  const roles: string[] = JSON.parse(rolesItem)
  return roles.includes(roleCode)
}
