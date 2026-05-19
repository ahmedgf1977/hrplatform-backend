import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationRequest } from './vacation-request.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// ── Service ──────────────────────────────────────────────
@Injectable()
export class VacationsService {
  constructor(
    @InjectRepository(VacationRequest)
    private repo: Repository<VacationRequest>,
  ) {}

  findAll(company?: string, status?: string) {
    const where: any = {};
    if (company) where.company = company;
    if (status) where.status = status;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const req = await this.repo.findOne({ where: { id } });
    if (!req) throw new NotFoundException(`Solicitud ${id} no encontrada`);
    return req;
  }

  create(data: Partial<VacationRequest>) {
    const req = this.repo.create(data);
    return this.repo.save(req);
  }

  async approve(id: number, approvedBy: string) {
    await this.findOne(id);
    await this.repo.update(id, { status: 'Aprobado', approvedBy });
    return this.findOne(id);
  }

  async reject(id: number, approvedBy: string, reason: string) {
    await this.findOne(id);
    await this.repo.update(id, { status: 'Rechazado', approvedBy, rejectionReason: reason });
    return this.findOne(id);
  }
}

// ── Controller ───────────────────────────────────────────
@Controller('vacations')
@UseGuards(JwtAuthGuard)
export class VacationsController {
  constructor(private service: VacationsService) {}

  @Get()
  findAll(@Query('company') company?: string, @Query('status') status?: string) {
    return this.service.findAll(company, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Put(':id/approve')
  approve(@Param('id') id: string, @Body() body: { approvedBy: string }) {
    return this.service.approve(+id, body.approvedBy);
  }

  @Put(':id/reject')
  reject(@Param('id') id: string, @Body() body: { approvedBy: string; reason: string }) {
    return this.service.reject(+id, body.approvedBy, body.reason);
  }
}

// ── Module ───────────────────────────────────────────────
@Module({
  imports: [TypeOrmModule.forFeature([VacationRequest])],
  providers: [VacationsService],
  controllers: [VacationsController],
  exports: [VacationsService],
})
export class VacationsModule {}
