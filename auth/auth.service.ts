import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.active) throw new UnauthorizedException('Credenciales inválidas');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');
    await this.usersService.updateLastLogin(user.id);
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      company: user.company,
      name: user.name,
      position: user.position,
      area: user.area,
      department: user.department,
      division: user.division,
      manager: user.manager,
      phone: user.phone,
      costCenter: user.costCenter,
      contractType: user.contractType,
      schedule: user.schedule,
      startDate: user.startDate,
      vacationDays: user.vacationDays,
      workLocation: user.workLocation,
    };
    return {
      access_token: this.jwtService.sign(payload),
     user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        position: user.position,
        area: user.area,
        department: user.department,
        division: user.division,
        manager: user.manager,
        phone: user.phone,
        costCenter: user.costCenter,
        contractType: user.contractType,
        schedule: user.schedule,
        startDate: user.startDate,
        vacationDays: user.vacationDays,
        workLocation: user.workLocation,
      },
    };
  }
}
