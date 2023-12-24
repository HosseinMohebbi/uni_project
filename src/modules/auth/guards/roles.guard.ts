import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';
import { UserErrorEnum } from '../../../../libs/common/src/exceptions/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  matchRoles(roles: string[], userRole: string): boolean {
    return roles.some((role) => role === userRole);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = await this.usersService.findOne({
      id: request.user['id'],
    });
    const is_access = this.matchRoles(roles, user.role);
    if (!is_access) throw new ForbiddenException(UserErrorEnum.USER_FORBIDDEN);
    return is_access;
  }
}
