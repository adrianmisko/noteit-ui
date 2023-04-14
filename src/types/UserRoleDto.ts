export default interface UserRoleDto {
  projectId: number;
  projectRole: ProjectRole;
}

type ProjectRole = 'ROLE_MANAGER' | 'ROLE_USER';
