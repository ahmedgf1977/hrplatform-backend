import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.update(Number(id), body);
  }

  // Crear usuario desde employee — evita dependencia circular
  // POST /api/users/from-employee
  @Post('from-employee')
  @UseGuards(JwtAuthGuard)
  async createFromEmployee(@Body() body: {
    employeeId: number;
    firstName: string;
    lastName1: string;
    email: string;
    imss?: string;
    company: string;
    position?: string;
    area?: string;
    department?: string;
    manager?: string;
    phone?: string;
    contractType?: string;
    schedule?: string;
    startDate?: string;
  }) {
    // Verificar si ya existe
    const existing = await this.usersService.findByEmail(body.email);
    if (existing) {
      return { message: 'Usuario ya existe', user: existing };
    }
    // Contraseña temporal = últimos 4 dígitos IMSS o HRP2025
    const tempPassword = body.imss ? body.imss.slice(-4) : 'HRP2025';
    const user = await this.usersService.create({
      name: `${body.firstName} ${body.lastName1}`.trim(),
      email: body.email,
      password: tempPassword,
      role: 'colaborador',
      company: body.company as 'zavix' | 'adc',
      employeeId: body.employeeId,
      position: body.position,
      area: body.area,
      department: body.department,
      manager: body.manager,
      phone: body.phone,
      contractType: body.contractType,
      schedule: body.schedule,
      startDate: body.startDate,
      active: true,
    });
    return { message: 'Usuario creado', tempPassword, user };
  }
}
