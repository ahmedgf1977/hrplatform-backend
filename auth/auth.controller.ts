import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  register(@Body() body: { name: string; email: string; password: string; role?: string; company?: string }) {
    return this.usersService.create({
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role || 'employee',
      company: body.company || 'zavix',
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Request() req: any) {
    return req.user;
  }

  @Get('seed')
  async seed() {
    await this.usersService.seedAdmins();
    return { message: '✅ Usuarios admin creados correctamente' };
  }
}
