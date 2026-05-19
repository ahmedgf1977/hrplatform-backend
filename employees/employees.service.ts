import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private repo: Repository<Employee>,
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

  create(data: Partial<Employee>) {
    const emp = this.repo.create(data);
    return this.repo.save(emp);
  }

  async update(id: number, data: Partial<Employee>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const emp = await this.findOne(id);
    await this.repo.update(id, { status: 'Baja' });
    return { message: `Colaborador ${emp.firstName} dado de baja` };
  }

  async bulkCreate(employees: Partial<Employee>[]) {
    const created = [];
    const errors = [];
    for (const emp of employees) {
      try {
        const e = this.repo.create(emp);
        const saved = await this.repo.save(e);
        created.push(saved);
      } catch (err) {
        errors.push({ data: emp, error: (err as any).message });
      }
    }
    return { created: created.length, errors: errors.length, details: errors };
  }
}
