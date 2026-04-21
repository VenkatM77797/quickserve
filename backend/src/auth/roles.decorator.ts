import { SetMetadata } from '@nestjs/common';

export enum AppRole {
  MANAGER = 1,
  EMPLOYEE = 2,
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);