import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import type { AdminUser } from "@skyprint/shared";
import { ADMIN_COOKIE_NAME, AuthService } from "./auth.service";

export interface AuthenticatedRequest extends Request {
  user?: AdminUser;
}

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : undefined;
    const cookieToken = req.cookies?.[ADMIN_COOKIE_NAME] as string | undefined;

    const user = this.authService.verifyToken(bearerToken || cookieToken);
    if (!user) {
      throw new UnauthorizedException("Admin authentication required.");
    }

    req.user = user;
    return true;
  }
}
