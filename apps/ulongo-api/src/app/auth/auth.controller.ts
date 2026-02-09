import { Body, Controller, Post, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() Body, @Req() req) {
    if (!req.tenant) {
      throw new UnauthorizedException('Instituição não encontrada.');
    }

    const user = await this.authService.validateUser(
      Body.email,
      Body.password,
      req.tenant.id,
    );
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    return this.authService.login(user);
  }
}
