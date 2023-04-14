import Role from './Role';

export default interface User {
  email: string;
  username: string;
  imageUrl: string;
  projectRoles: ProjectRole[];
}

export interface ProjectRole {
  projectId: number;
  role: Role;
}
