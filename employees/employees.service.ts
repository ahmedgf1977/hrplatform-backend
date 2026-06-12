import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private repo: Repository<Employee>,
    private usersService: UsersService,
  ) {}

  findAll(company?: string) {
    if (company) return this.repo.find({ where: { company } });
    return this.repo.find();
  }

  async findOne(id: number) {
    const emp = await this.repo.findOne({ where: { id } });
    if (!emp) throw new NotFoundException(`Colaborador ${id} no encontrado`);
    return emp;
  }

  async create(data: Partial<Employee>) {
    const emp = this.repo.create(data);
    const saved = await this.repo.save(emp);

    // Auto-crear usuario para el colaborador
    try {
      const existingUser = await this.usersService.findByEmail(saved.email);
      if (!existingUser) {
        // Contraseña temporal = últimos 4 dígitos del IMSS o 'HRP2025' por defecto
        const tempPassword = saved.imss
          ? saved.imss.slice(-4)
          : 'HRP2025';

        await this.usersService.create({
          name: `${saved.firstName} ${saved.lastName1}`.trim(),
          email: saved.email,
          password: tempPassword,
          role: 'colaborador',
          company: saved.company as 'zavix' | 'adc',
          employeeId: saved.id,
          position: saved.position,
          area: saved.area,
          department: saved.department,
          manager: saved.manager,
          phone: saved.phone,
          contractType: saved.contractType,
          schedule: saved.schedule,
          startDate: saved.startDate,
          active: true,
        });
        console.log(`✅ Usuario creado para ${saved.email} — contraseña temporal: ${tempPassword}`);
      }
    } catch (err) {
      // Si falla la creación del usuario, no afecta al employee
      console.error(`⚠️ No se pudo crear usuario para ${saved.email}:`, err.message);
    }

    return saved;
  }

  async update(id: number, data: Partial<Employee>) {
    await this.findOne(id);
    await this.repo.update(id, data);

    // Sincronizar datos del usuario si existen
    const updated = await this.findOne(id);
    try {
      const user = await this.usersService.findByEmail(updated.email);
      if (user) {
        await this.usersService.update(user.id, {
          position: updated.position,
          area: updated.area,
          department: updated.department,
          manager: updated.manager,
          phone: updated.phone,
          contractType: updated.contractType,
          schedule: updated.schedule,
          startDate: updated.startDate,
        });
      }
    } catch (err) {
      console.error(`⚠️ No se pudo sincronizar usuario:`, err.message);
    }

    return updated;
  }

  async remove(id: number) {
    const emp = await this.findOne(id);
    await this.repo.update(id, { status: 'Baja' });

    // Desactivar usuario
    try {
      const user = await this.usersService.findByEmail(emp.email);
      if (user) await this.usersService.update(user.id, { active: false });
    } catch (err) {
      console.error(`⚠️ No se pudo desactivar usuario:`, err.message);
    }

    return { message: `Colaborador ${emp.firstName} dado de baja` };
  }

  async bulkCreate(employees: Partial<Employee>[]) {
    const created = [];
    const errors = [];
    for (const emp of employees) {
      try {
        const saved = await this.create(emp);
        created.push(saved);
      } catch (err) {
        errors.push({ data: emp, error: (err as any).message });
      }
    }
    return { created: created.length, errors: errors.length, details: errors };
  }
}
