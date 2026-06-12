import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VacationRequest } from './vacation-request.entity';

@Injectable()
export class VacationsService {
  constructor(
    @InjectRepository(VacationRequest)
    private repo: Repository<VacationRequest>,
  ) {}

  findAll(company?: string) {
    if (company) return this.repo.find({ where: { company }, order: { createdAt: 'DESC' } });
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findByEmployee(employeeId: number) {
    return this.repo.find({ where: { employeeId }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const req = await this.repo.findOne({ where: { id } });
    if (!req) throw new NotFoundException(`Solicitud ${id} no encontrada`);
    return req;
  }

  create(data: Partial<VacationRequest>) {
    const req = this.repo.create({ ...data, status: 'Pendiente' });
    return this.repo.save(req);
  }

  async approve(id: number, approvedBy: string) {
    await this.findOne(id);
    await this.repo.update(id, { status: 'Aprobado', approvedBy });
    return this.findOne(id);
  }

  async reject(id: number, approvedBy: string, rejectionReason?: string) {
    await this.findOne(id);
    await this.repo.update(id, { status: 'Rechazado', approvedBy, rejectionReason });
    return this.findOne(id);
  }

  async remove(id: number) {
    const req = await this.findOne(id);
    await this.repo.delete(id);
    return { message: `Solicitud ${req.id} eliminada` };
  }
}
