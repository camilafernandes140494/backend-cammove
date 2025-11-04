import { PermissionType } from 'src/permission/permission.types';

export type User = {
  id?: string;
  name: string;
  gender: string;
  image: string;
  birthDate: string;
  permission: PermissionType  | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | null;
  phone: string;
  deviceToken?: string
  termsOfUse?: string
};

export type UpdateUser = Partial<User>;
