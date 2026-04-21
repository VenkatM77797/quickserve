import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, AppRole } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('Decorator roles:', roles);

    if (!roles || roles.length === 0) {
      console.log('No roles required, access allowed');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('request.user in RolesGuard:', user);
    console.log('raw user.role:', user?.role, 'type:', typeof user?.role);

    if (!user) {
      console.log('Access denied: no user on request');
      throw new ForbiddenException('Access denied');
    }

    if (user.role === undefined || user.role === null) {
      console.log('Access denied: user role missing');
      throw new ForbiddenException('User role missing');
    }

    const userRole = Number(user.role);
    console.log('converted userRole:', userRole, 'type:', typeof userRole);

    if (!roles.includes(userRole)) {
      console.log('Access denied: role mismatch');
      console.log('Expected one of:', roles, 'but got:', userRole);
      throw new ForbiddenException('Insufficient permissions');
    }

    console.log('Access granted: role matched');
    return true;
  }
}