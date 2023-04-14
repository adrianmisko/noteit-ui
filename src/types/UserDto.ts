import UserRoleDto from './UserRoleDto';

export default interface UserDto {
  id: number;
  email: string;
  imageUrl: string;
  name: string;
  userRoleDTOs: UserRoleDto[];
}
