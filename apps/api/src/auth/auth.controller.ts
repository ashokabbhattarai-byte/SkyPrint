import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { IsEmail, IsString, MinLength } from "class-validator";
import type { Response } from "express";
import { ADMIN_COOKIE_NAME, AuthService } from "./auth.service";
import {
  AdminAuthGuard,
  type AuthenticatedRequest,
} from "./admin-auth.guard";

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = this.authService.validateCredentials(dto.email, dto.password);
    const token = this.authService.signToken(user);

    res.cookie(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 8 * 60 * 60 * 1000,
    });

    return { user, token };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(ADMIN_COOKIE_NAME, { path: "/" });
    return { ok: true };
  }

  @Get("me")
  @UseGuards(AdminAuthGuard)
  me(@Req() req: AuthenticatedRequest) {
    return { user: req.user };
  }
}
