import { PermissionType } from 'src/permission/permission.types';

export type User = {
  id?: string;
  name: string;
  gender: string;
  image: string;
  birthDate: string;
  permission: PermissionType;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type UpdateUser = Partial<User>;
